import axios from 'axios'
import {
  Message,
  MessageBox
} from 'element-ui'
import router from '@/router'
import store from '@/store'
const baseURL = process.env.NODE_ENV === 'production' ? 'http://39.97.255.236' : 'http://localhost:3000'
const request = axios.create({
  baseURL: baseURL,
  timeout: 10 * 1000,
  headers: {},
  //没有设置withCredentials 浏览器不会保存服务器传过来的cookie
  withCredentials: true
})
//
request.interceptors.request.use(function (config) {
  //
  return config;
}, function (error) {
  //
  return Promise.reject(error);
});

//
request.interceptors.response.use((res) => {
    const data = res.data
    //
    switch (res.status) {
      case 200:
        //code:0，则返回data
        if (data.code === 0) {
          if (data.msg) {
            Message({
              type: 'success',
              message: data.msg,
              duration: 2 * 1000
            })
          }
          return Promise.resolve(data.data)
        }
        //code:-1，则返回后端返回的报错信息msg
        else {
          Message({
            type: 'error',
            message: data.msg,
            duration: 3 * 1000,
            showClose: true
          })
          return Promise.reject(data.msg)
        }
        break;
      case 401:
        //
        MessageBox.alert('您未登录或登录已超时，请重新登录。', '提示', {
          confirmButtonText: '确定',
          showClose: false,
          callback: action => {
            store.commit('LOGOUT')
            router.replace({
              path: '/login',
              query: {
                redirect: router.currentRoute.fullPath
              }
            })
          }
        })
        break;
      default:
        console.log('服务器出错，请稍后重试！')
        alert('服务器出错，请联系管理员！')
    }
  },
  (err) => {
    //
    try {
      if(err.response.status===401){
        store.commit('LOGOUT')
        router.replace({
          path: '/login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      }
    } catch (error) {
      
    }
    return Promise.reject(err);
  });
export default request
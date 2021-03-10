import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from 'views/layout.vue'
import store from '../store'
import {
  MessageBox
} from 'element-ui'
Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'home',
    meta: {
      title: '首页'
    },
    redirect: '/MyTeachFile',
    component: Layout,
    children: [{
        path: '/MyTeachFile',
        name: 'MyTeachFile',
        meta: {
          title: '我的教案'
        },
        component: resolve => require(['views/MyTeachFile/index.vue'], resolve)
      },
      {
        path: '/TeachPost',
        name: 'TeachPost',
        meta: {
          title: '教案广场'
        },
        component: resolve => require(['views/TeachPost/index.vue'], resolve)
      },
      {
        path: '/Article',
        name: 'Article',
        meta: {
          title: '学习中心'
        },
        component: resolve => require(['views/Article/index.vue'], resolve)
      },
      {
        path: '/design',
        component: resolve => require(['views/design/layout.vue'], resolve),
        redirect: '/design/CourseBrief',
        children: [{
            path: 'CourseBrief',
            name: 'CourseBrief',
            meta: {
              title: '课程简介'
            },
            component: resolve => require(['views/CourseBrief'], resolve)
          },
          {
            path: 'AcademicAnalysis',
            name: 'AcademicAnalysis',
            meta: {
              title: '学情分析'
            },
            component: resolve => require(['views/AcademicAnalysis'], resolve)
          },
          {
            path: 'TeachDemand',
            name: 'TeachDemand',
            meta: {
              title: '教学目标'
            },
            component: resolve => require(['views/TeachDemand'], resolve)
          },
          {
            path: 'TeachHard',
            name: 'TeachHard',
            meta: {
              title: '教学重难点'
            },
            component: resolve => require(['views/TeachHard'], resolve)
          },
          {
            path: 'TeachEnv',
            name: 'TeachEnv',
            meta: {
              title: '教学环境'
            },
            component: resolve => require(['views/TeachEnv'], resolve)
          },
          {
            path: 'TeachFlow',
            name: 'TeachFlow',
            meta: {
              title: '教学流程'
            },
            component: resolve => require(['views/TeachFlow'], resolve)
          },
          {
            path: 'TeachEvaluate',
            name: 'TeachEvaluate',
            meta: {
              title: '教学评价'
            },
            component: resolve => require(['views/TeachEvaluate'], resolve)
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: resolve => require(['views/Login/login'], resolve)
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      title: '注册'
    },
    component: resolve => require(['views/Login/register'], resolve)
  },
  {
    path: '*',
    name: 'page404',
    meta: {
      title: '404'
    },
    component: resolve => require(['views/404.vue'], resolve)
  },
]

const router = new VueRouter({
  routes
})
const whiteList = ['/login', '/register', '/404']
router.beforeEach((to, from, next) => {
  const session = store.state.session
  if (session) {
    if (to.path === '/login') {
      next({
        path: '/MyTeachFile'
      })
    } else if (to.path.includes('/design')) {
      let file_id = localStorage.getItem('file_id')
      if (!file_id) {
        MessageBox.alert('您还没有新建个一个教案快去新建一个吧', '提示', {
          confirmButtonText: '好的',
          showClose: false,
          callback: action => {
            next({
              path: '/MyTeachFile'
            })
          }
        })
      } else {
        next()
      }
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath //同时记录下当前页面路由方便下次直接跳转。
        }
      }) //
    }
  }
})

export default router
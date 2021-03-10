import vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ELEMENTUI from 'element-ui';
if (process.env.NODE_ENV !== 'production') {
  require('element-ui/lib/theme-chalk/index.css')
}
import './styles/index.scss'
vue.config.productionTip = false
//
import initEditData from './initEditData'
initEditData.init()
vue.use(ELEMENTUI);
new vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
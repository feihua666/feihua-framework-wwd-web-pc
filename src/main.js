// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import http from '@/utils/httpUtils.js'
import store from './store/store'
import Element from 'element-ui'
// bootstrap 中已经引入
// import 'normalize.css/normalize.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'element-ui/lib/theme-chalk/index.css'
import config from '@/utils/config.js'
Vue.use(Element)

Vue.prototype.$http = http
Vue.prototype.$config = config
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

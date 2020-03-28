import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI, { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'assets/fonts/iconfont.css'
// import axios from 'axios'
import VueQuillEditor from 'vue-quill-editor'

//配置axios
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// Vue.prototype.$http = axios

Vue.use(ElementUI);
Vue.prototype.$message = Message    //弹框

Vue.config.productionTip = false

/* 引用VueQuillEditor相关的样式 */
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
/* 注册VueQuillEditor */
Vue.use(VueQuillEditor)

/* 时间过滤器 */
Vue.filter('dataFormat', function(originVal) {
  const dt = new Date(originVal*1000) 
  const y = dt.getFullYear()
  const m = ('0' + dt.getMonth() + 1).slice(-2)
  const d = ('0' + dt.getDate()).slice(-2)
  const hh = ('0' + dt.getHours()).slice(-2)
  const mm = ('0' + dt.getMinutes()).slice(-2)
  const ss = ('0' + dt.getSeconds()).slice(-2)

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

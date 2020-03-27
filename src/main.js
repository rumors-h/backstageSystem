import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI, { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'assets/fonts/iconfont.css'
// import axios from 'axios'

//配置axios
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// Vue.prototype.$http = axios

Vue.use(ElementUI);
Vue.prototype.$message = Message    //弹框

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
var a = (x,y) => x + y
    console.log(a(1,2))
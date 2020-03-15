import Vue from 'vue'
import App from './App.vue'

//导入通用样式
import './styles/base.less'
import './styles/iconfont.less'

//导入lib-flexible 自动适配所有文件
import 'lib-flexible'

//导入路由
import router from './router'

//引入axios
import axios from 'axios'

//----------------全局注册组件----------------
import HmHeader from './components/HmHeader.vue'
import HmLogo from './components/HmLogo.vue'
import HmButton from './components/HmButton.vue'
import HmInput from './components/HmInput.vue'

Vue.component('hm-header', HmHeader)
Vue.component('hm-logo', HmLogo)
Vue.component('hm-button', HmButton)
Vue.component('hm-input', HmInput)

// --------------axios-----------------------
// axios和vue没有关系，强行让axios和Vue有关系
// 把axios绑定到了vue的原型上，所有的vue实例（组件）都可以通过 this.axios访问到axios
// 给axios配置默认的基础路径
// axios在发请求的时候，把url的路径自动拼接上baseUR
axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$axios = axios

//-----------------vant 插件处理----------------
//按需加载
import { Toast } from 'vant'
Vue.use(Toast)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

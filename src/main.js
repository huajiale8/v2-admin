import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import auth from "@/http/auth";
import '@/assets/fontawesome/css/fontawesome.css'
import VueWechatTitle from 'vue-wechat-title'

Vue.prototype.auth = auth
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueWechatTitle);
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

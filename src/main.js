import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import '../static/css/icon.css';
import "babel-polyfill";
import FastClick from 'fastclick'
import vueResource from 'vue-resource'
import CryptoJS from 'crypto-js'
import md5 from 'js-md5';
import 'axios'


Vue.use(ElementUI, { size: 'small' });
Vue.prototype.$axios = axios;
Vue.use(vueResource)
Vue.prototype.$md5 = md5;
FastClick.attach(document.body)

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = sessionStorage.getItem('user');
    if(!role && to.path !== '/login'){
        next('/login');
    }else if(to.meta.permission){
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
       next({
            path: '/',
            query:{ referrer: to.fullPath}
        });
    }else{
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        }else{
            next();
        }
    }
})


Vue.prototype.encrypt = function (obj) {
    var key = CryptoJS.enc.Utf8.parse('1234567812345678')
    var srcs = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})
    return encrypted.toString()
}
Vue.prototype.decode = function (obj) {
    var key = CryptoJS.enc.Utf8.parse('1234567812345678')
    var decrypt = CryptoJS.AES.decrypt(obj, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})
    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}
Vue.http.interceptors.push(function (request, next) {
    request.body = this.encrypt(request.body)
    next((response) => {
        response.body = JSON.parse(this.decode(response.body))
        return response
    })
})

FastClick.attach(document.body)
Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');

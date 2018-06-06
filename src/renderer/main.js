import Vue from 'vue'
import axios from 'axios'
import request from 'request'

import App from './App'
import router from './router'
import store from './store'

import '@/components/';

import db from '@/nedb'

import '@/styles/main.less'
import tool from '@/tools/tools'
import API from '@/API/'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.http    = Vue.prototype.$http    = axios
Vue.tool    = Vue.prototype.$tool    = tool
Vue.API     = Vue.prototype.$API     = API
Vue.request = Vue.prototype.$request = request
Vue.db      = Vue.prototype.$db      = db

axios.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el        : '#app',
    router,
    store,
    components: {App},
    template  : '<App/>',
    data      : {
        eventHub: new Vue()
    }
})
// 某一个组件内调用事件
// this.$root.eventHub.$emit('eventName', event.target);
// 某一个组件内接受事件
// this.$root.eventHub.$on('eventName',(target) => {
//     this.functionName(target)
// });

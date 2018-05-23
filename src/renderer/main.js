import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'
import request from 'request'

import App from './App'
import router from './router'
import store from './store'

import db from './nedb'

import './styles/main.less'
import tool from './tools/tools.js'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.http    = Vue.prototype.$http    = axios
Vue.tool    = Vue.prototype.$tool    = tool
Vue.$       = Vue.prototype.$        = $
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
    components: { App },
    router,
    store,
    template: '<App/>'
}).$mount('#app')

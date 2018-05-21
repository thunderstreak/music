import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/home',
            name: 'home',
            meta     : {
                auth : false,
                level: 1,
                title: '登录',
            },
            component: resolve => require(['@/view/home'], resolve)
        },
        {
            path: '/landing-page',
            name: 'landing-page',
            component: resolve => require(['@/components/LandingPage'], resolve)
        },
        {
            path: '*',
            redirect: {
                name: 'home'
            }
        }
    ]
})

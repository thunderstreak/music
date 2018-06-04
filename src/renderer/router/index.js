import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/audio',
            name: 'audio',
            meta     : {
                auth : false,
                title: 'AudioPlayer',
            },
            component: resolve => require(['@/view/audio'], resolve)
        },
        {
            path: '/video',
            name: 'video',
            meta     : {
                auth : false,
                title: 'VideoPlayer',
            },
            component: resolve => require(['@/view/video'], resolve)
        },
        {
            path: '/landing-page',
            name: 'landing-page',
            component: resolve => require(['@/components/LandingPage'], resolve)
        },
        {
            path: '*',
            redirect: {
                name: 'audio'
            }
        }
    ]
})

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    linkActiveClass: 'active',
    // mode: 'history',
    routes: [
        {
            path: '/',
            component: resolve => require(['@/pages/index.vue'], resolve),
            meta: {
                title: 'INDEX FRONT-END-TOOL',
                auth: false
            }
        },
        {
            path: '/code',
            component: resolve => require(['@/pages/code.vue'], resolve),
            meta: {
                title: 'CODE FRONT-END-TOOL',
                auth: false
            }
        },
        {
            path: '/request',
            component: resolve => require(['@/pages/request.vue'], resolve),
            meta: {
                title: 'REQUEST FRONT-END-TOOL',
                auth: false
            }
        },
        {
            path: '/codefileview',
            component: resolve => require(['@/pages/codefileview.vue'], resolve),
            meta: {
                title: 'CODE FILE VIEW FRONT-END-TOOL',
                auth: false
            }
        },
		{
            path: '/imagecompress',
            component: resolve => require(['@/pages/imagecompress.vue'], resolve),
            meta: {
                title: 'IMAGE COMPRESS FRONT-END-TOOL',
                auth: false
            }
        },
        {
            path: '/share/:id',
            component: resolve => require(['@/pages/codeShare.vue'], resolve),
            meta: {
                title: 'CODE SHARE FRONT-END-TOOL',
                auth: false
            }
        },
        {
            path: '/d3',
            component: resolve => require(['@/pages/d3.vue'], resolve),
            meta: {
                title: 'D3 SHOW FRONT-END-TOOL',
                auth: false
            }
        },
        {
            path: '/capture',
            component: resolve => require(['@/pages/capture.vue'], resolve),
            meta: {
                title: 'CAPTURE SHOW FRONT-END-TOOL',
                auth: false
            }
        },
        {
            path: '/fingerprint',
            component: resolve => require(['@/pages/fingerprint.vue'], resolve),
            meta: {
                title: 'FINGERPRINT SHOW FRONT-END-TOOL',
                auth: false
            }
        },
        {
            path: '/media',
            component: resolve => require(['@/pages/media.vue'], resolve),
            meta: {
                title: 'MEDIA SHOW FRONT-END-TOOL',
                auth: false
            }
        },
        {
            path: '/svg',
            component: resolve => require(['@/pages/svg.vue'], resolve),
            meta: {
                title: 'SVG SHOW FRONT-END-TOOL',
                auth: false
            }
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})

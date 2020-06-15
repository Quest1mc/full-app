import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _3125b1c6 = () => interopDefault(import('../pages/account/index.vue' /* webpackChunkName: "pages/account/index" */))
const _0204b299 = () => interopDefault(import('../pages/login/index.vue' /* webpackChunkName: "pages/login/index" */))
const _7a57f97e = () => interopDefault(import('../pages/signup/index.vue' /* webpackChunkName: "pages/signup/index" */))
const _9a458bf2 = () => interopDefault(import('../pages/account/content/index.vue' /* webpackChunkName: "pages/account/content/index" */))
const _a60e776a = () => interopDefault(import('../pages/p/_id/index.vue' /* webpackChunkName: "pages/p/_id/index" */))
const _360f570a = () => interopDefault(import('../pages/p/_id/ambassadors.vue' /* webpackChunkName: "pages/p/_id/ambassadors" */))
const _0fed109d = () => interopDefault(import('../pages/p/_id/creatives.vue' /* webpackChunkName: "pages/p/_id/creatives" */))
const _03eef970 = () => interopDefault(import('../pages/p/_id/events.vue' /* webpackChunkName: "pages/p/_id/events" */))
const _8d2ee1ba = () => interopDefault(import('../pages/p/_id/places.vue' /* webpackChunkName: "pages/p/_id/places" */))
const _1f96cc03 = () => interopDefault(import('../pages/p/_id/updates.vue' /* webpackChunkName: "pages/p/_id/updates" */))
const _68d45c2f = () => interopDefault(import('../pages/p/_id/videos.vue' /* webpackChunkName: "pages/p/_id/videos" */))
const _e65e5d02 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))
const _b851d62c = () => interopDefault(import('../pages/_id/index.vue' /* webpackChunkName: "pages/_id/index" */))
const _1020d3a4 = () => interopDefault(import('../pages/_id/cms/index.vue' /* webpackChunkName: "pages/_id/cms/index" */))
const _9bcb7924 = () => interopDefault(import('../pages/_id/cms/pagebuilder/header.vue' /* webpackChunkName: "pages/_id/cms/pagebuilder/header" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/account",
    component: _3125b1c6,
    name: "account"
  }, {
    path: "/login",
    component: _0204b299,
    name: "login"
  }, {
    path: "/signup",
    component: _7a57f97e,
    name: "signup"
  }, {
    path: "/account/content",
    component: _9a458bf2,
    name: "account-content"
  }, {
    path: "/p/:id?",
    component: _a60e776a,
    name: "p-id"
  }, {
    path: "/p/:id?/ambassadors",
    component: _360f570a,
    name: "p-id-ambassadors"
  }, {
    path: "/p/:id?/creatives",
    component: _0fed109d,
    name: "p-id-creatives"
  }, {
    path: "/p/:id?/events",
    component: _03eef970,
    name: "p-id-events"
  }, {
    path: "/p/:id?/places",
    component: _8d2ee1ba,
    name: "p-id-places"
  }, {
    path: "/p/:id?/updates",
    component: _1f96cc03,
    name: "p-id-updates"
  }, {
    path: "/p/:id?/videos",
    component: _68d45c2f,
    name: "p-id-videos"
  }, {
    path: "/",
    component: _e65e5d02,
    name: "index"
  }, {
    path: "/:id",
    component: _b851d62c,
    name: "id"
  }, {
    path: "/:id/cms",
    component: _1020d3a4,
    name: "id-cms"
  }, {
    path: "/:id/cms/pagebuilder/header",
    component: _9bcb7924,
    name: "id-cms-pagebuilder-header"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}

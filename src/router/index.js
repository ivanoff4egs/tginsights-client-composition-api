import { createRouter, createWebHistory } from 'vue-router'
import {useAuthStore} from "@/stores/auth.js";

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false, showHeader: false }
  },
  {
    path: '/',
    name: 'home',
    alias: '/home',
    redirect: '/favorites'
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('@/views/FavoritesView.vue'),
    meta: { requiresAuth: true, showHeader: true }
  },
  {
    path: '/channels',
    name: 'channels',
    component: () => import('@/views/ChannelsView.vue'),
    meta: { requiresAuth: true, showHeader: true }
  },
  {
    path: '/channel/:source_id',
    name: 'channel.view',
    component: () => import('@/views/ChannelView.vue'),
    meta: { requiresAuth: true, showHeader: true }
  },
  {
    path: '/messages/search',
    name: 'messages.search',
    component: () => import('@/views/SearchView.vue'),
    meta: { requiresAuth: true, showHeader: true }
  },
  {
    path: '/message/matches/:id',
    name: 'message.matches',
    component: () => import('@/views/MatchesView.vue'),
    meta: { requiresAuth: true, showHeader: true }
  },
  // {
  //   path: '/tags',
  //   name: 'tags',
  //   component: () => import('@/views/TagsView.vue'),
  // },
  // {
  //   path: '/tag/search/:tagName',
  //   name: 'tag.search',
  //   component: () => import('@/views/TagSearchView.vue')
  // },
  // {
  //   path: '/telegram/auth/:context',
  //   name: 'telegram.auth',
  //   component: () => import('@/views/TelegramAuthView.vue')
  // },
  // {
  //   path: '/telegram/auth/qr/:context',
  //   name: 'telegram.auth.qr',
  //   component: () => import('@/views/TelegramAuthQrView.vue')
  // },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { requiresAuth: false, showHeader: false }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {name: 'login', query: {redirectedFrom: to.fullPath}}
  }
})

export default router

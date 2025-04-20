import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/messages/search/:searchValue/:strict/:timerange',
      name: 'messages.search',
      component: () => import('@/views/SearchView.vue'),
    },
  ],

})

export default router

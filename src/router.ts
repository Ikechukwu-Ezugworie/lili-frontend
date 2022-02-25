import {
  createRouter, createWebHashHistory, RouteRecordRaw, NavigationGuardNext,
  RouteLocationNormalized,
} from "vue-router";


const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./pages/Home.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('./pages/Login.vue'),
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
  strict: true,
})


export default router

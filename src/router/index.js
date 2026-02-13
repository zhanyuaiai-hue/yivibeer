import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import BeerDiary from '../views/BeerDiary.vue'
import BeerGuide from '../views/BeerGuide.vue'
import HallOfFame from '../views/HallOfFame.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/diary',
      name: 'diary',
      component: BeerDiary,
      meta: { requiresAuth: true }
    },
    {
      path: '/guide',
      name: 'guide',
      component: BeerGuide,
      meta: { requiresAuth: true }
    },
    {
      path: '/hall',
      name: 'hall',
      component: HallOfFame,
      meta: { requiresAuth: true }
    }
  ]
})

// 路由守卫：检查登录状态
router.beforeEach((to, from, next) => {
  const userMode = localStorage.getItem('yivi_user_mode')

  if (to.meta.requiresAuth && !userMode) {
    // 需要登录但未登录，跳转到登录页
    next('/login')
  } else if (to.path === '/login' && userMode) {
    // 已登录用户访问登录页，跳转到日记页
    next('/diary')
  } else {
    next()
  }
})

export default router

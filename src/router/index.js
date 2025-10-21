import Layout from '@/layout'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import { afterEachGuard, beforeEachGuard } from './guard'

// 路由模式
const historyCreatorMap = {
  hash: createWebHashHistory,
  history: createWebHistory,
  memory: createMemoryHistory,
}

const router = createRouter({
  history: historyCreatorMap['history'](),
  // 是否禁止尾部斜杠。
  // strict: true,
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/register/index.vue'),
    },
    {
      path: '/401',
      name: '401',
      component: () => import('@/views/401/index.vue'),
    },
    {
      path: '/404',
      name: '404',
      component: () => import('@/views/404/index.vue'),
    },
    {
      path: '',
      name: 'Layout',
      component: Layout,
      children: [],
    },
  ],
})

// 全局捕捉路由异常
let push = router.push
router.push = function (to) {
  return push.call(this, to).catch(err => err)
}

// 前置路由守卫
beforeEachGuard(router)
// 后置路由守卫
afterEachGuard(router)

export default router

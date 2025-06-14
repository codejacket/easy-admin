import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'
import { isRelogin } from '@/utils/request'
import { useAppStore } from '@store/app'
import { useUserStore } from '@store/user'
import { useRouteStore } from '@store/route'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 不显示旋转图标
NProgress.configure({ showSpinner: false })

// 白名单
const whiteList = ['/login', '/register']

export function beforeEachGuard(router) {
    router.beforeEach(async (to, from, next) => {
        NProgress.start()
        if (getToken()) {
            if (to.meta.title) useAppStore().title = to.meta.title
            if (to.path === '/login') {
                next({ path: '/' })
                NProgress.done()
            } else {
                const userStore = useUserStore()
                if (userStore.roles.length) {
                    next()
                } else {
                    isRelogin.show = true
                    // 判断当前用户是否已拉取完user_info信息
                    try {
                        await userStore.getInfo()
                        isRelogin.show = false
                        let accessRoutes = await useRouteStore().generateRoutes()
                        // 动态添加可访问路由表
                        accessRoutes.forEach(route => router.addRoute('Layout', route))
                        router.addRoute('Layout', { path: '/:pathMatch(.*)*', redirect: '404' })
                        next({ ...to, replace: true })
                    } catch (err) {
                        await userStore.logout()
                        ElMessage.error(err)
                        next({ path: '/' })
                    }
                }
            }
        } else {
            // 没有token
            if (whiteList.includes(to.path)) {
                // 在免登录白名单，直接进入
                next()
            } else {
                // 否则全部重定向到登录页
                next(`/login?redirect=${to.fullPath}`)
                NProgress.done()
            }
        }
    })
}

export function afterEachGuard(router) {
    router.afterEach(() => {
        NProgress.done()
    })
}
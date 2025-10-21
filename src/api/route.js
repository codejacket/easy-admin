import request from '@/api'

/**
 * {
 *   path: 'xxx',           -> 路由地址，如/home。若该值设置为外链地址时， 则会打开一个新窗口
 *   query: 'xxx',          -> 访问路由的默认传递参数
 *   component: 'xxx',      -> 路由组件路径，对应路径src/xxx/index.vue。若该值设置为外链时，则会打开一个内嵌<iframe src="xxx" />
 *   meta: {
 *     icon: 'xxx',         -> 设置该路由的图标，对应路径src/icons/svg
 *     title: 'xxx',        -> 设置该路由在侧边栏和面包屑中展示的标题
 *     affixTab: true,      -> 如果设置为true，则会固定在tabs中(默认 false)
 *     noCache: true,       -> 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
 *     hidden: true,        -> 当设置true时，该路由不会在侧边栏出现，但仍然可访问。 如401，404等
 *     disabled: true,      -> 当设置true 时，该路由不会再出现，也不可访问。后台也会自动过滤disabled为true的路由，所以该设置可忽略
 *     transition: 'xxx'    -> 动画名称，对应路径src/styles/transition
 *   }
 * }
 */

export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get',
  })
}

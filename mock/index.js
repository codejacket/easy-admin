import { viteMockServe } from 'vite-plugin-mock'
import authInterceptor from './middlewares/authInterceptor'

export default function vitePluginMock(configEnv) {
  if (configEnv.mode === 'mock') {
    let { configureServer, ...options } = viteMockServe({
      mockPath: 'mock/modules',
      watchFiles: true,
      logger: false, // 是否在控制台显示请求日志
    })
    return {
      ...options,
      async configureServer(server) {
        server.middlewares.use(authInterceptor)
        return await configureServer(server)
      },
    }
  }
}

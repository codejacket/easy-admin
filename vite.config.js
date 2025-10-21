import vueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { fileURLToPath, URL } from 'node:url'
import UnoCSS from 'unocss/vite'
import autoImport from 'unplugin-auto-import/vite'
import { defineConfig, loadEnv } from 'vite'
import { parseLoadedEnv } from 'vite-plugin-env-parse'
import vitePluginInspect from 'vite-plugin-inspect'
import vueDevTools from 'vite-plugin-vue-devtools'
import vitePluginMock from './mock'
import vitePluginDisableDevTool from './plugins/vite-plugin-disable-devtool'
import vitePluginLocalIconify from './plugins/vite-plugin-local-iconify'
import vitePluginStartConsole from './plugins/vite-plugin-start-console'

// https://vite.dev/config/
export default defineConfig(configEnv => {
  const resolvePath = path => fileURLToPath(new URL(path, import.meta.url))
  const viteEnv = parseLoadedEnv(loadEnv(configEnv.mode, process.cwd()))
  return {
    // 开发服务器选项 https://cn.vitejs.dev/config/server-options
    server: {
      port: 8080,
      open: true,
    },
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      vueI18nPlugin({
        include: [resolvePath('./src/**/locales/**.json')],
      }),
      autoImport({
        imports: ['vue', 'pinia'],
        dts: false,
      }),
      vitePluginInspect(),
      UnoCSS(),
      vitePluginDisableDevTool({
        disable: !viteEnv.VITE_APP_DISABLE_DEVTOOL,
        md5: '47fa7d90b549389b06072695d05df64a',
      }),
      vitePluginLocalIconify(),
      vitePluginStartConsole(),
      vitePluginMock(configEnv),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: `@use "@/assets/style/mixin.scss" as *;`,
        },
      },
    },
    resolve: {
      alias: {
        '@': resolvePath('./src'),
        '@api': resolvePath('./src/api/modules'),
        '@plugins': resolvePath('./src/plugins/modules'),
        '@store': resolvePath('./src/store/modules'),
      },
      // 自动补全的扩展名
      extensions: ['.js', '.vue'],
      // 默认的入口文件
      mainFiles: ['index'],
    },
  }
})

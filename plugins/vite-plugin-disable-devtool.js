export default function vitePluginDisableDevTool(options) {
  return {
    name: 'disable-devtool',
    enforce: 'pre',
    transform(code, id) {
      if (/src\/main\.(js|ts)$/.test(id)) {
        // 开启防调试
        if (!options.disable) {
          code = code.concat(`
              import DisableDevtool from 'disable-devtool'
              DisableDevtool(${JSON.stringify(options)})
            `)
        }
        return {
          code,
          map: null,
        }
      }
    },
  }
}

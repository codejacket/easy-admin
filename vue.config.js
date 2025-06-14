const { defineConfig } = require('@vue/cli-service')
const InjectPlugin = require('webpack-inject-plugin').default
const path = require('path')

module.exports = defineConfig({
    devServer: {
        port: 8088,
        open: false,
        setupMiddlewares: require('./mock'),
        client: {
            overlay: false
        }
    },
    configureWebpack: (config) => {
        config.name = process.env.VUE_APP_TITLE
        // 开启防调试
        if (process.env.VUE_APP_DISABLE_DEVTOOL === 'true') {
            config.plugins.push(new InjectPlugin(() => `
                import DisableDevtool from 'disable-devtool';
                DisableDevtool({
                    md5: '47fa7d90b549389b06072695d05df64a',
                    disableMenu: false,
                });
            `))
        }
    },
    chainWebpack: config => {
        // 让 svg-sprite-loader 处理 'src/assets/svg' 目录下的 icons
        config.module
            .rule('svg')
            .exclude
            .add(path.resolve(__dirname, 'src/assets/svg'))
            .end()

        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include
            .add(path.resolve(__dirname, 'src/assets/svg'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })

        // @intlify/vue-i18n-loader
        config.module
            .rule('i18n')
            .resourceQuery(/blockType=i18n/)
            .type('javascript/auto')
            .use('i18n')
            .loader('@intlify/vue-i18n-loader')

        // 配置别名
        config.resolve.alias
            .set('@api', path.resolve(__dirname, 'src/api/modules'))
            .set('@store', path.resolve(__dirname,'src/store/modules'))

        // 消除 __VUE_PROD_HYDRATION_MISMATCH_DETAILS__ 警告信息
        config.plugin('define').tap((definitions) => {
            Object.assign(definitions[0], {
                __VUE_OPTIONS_API__: 'true',
                __VUE_PROD_DEVTOOLS__: 'false',
                __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
            })
            return definitions
        })
    }
})

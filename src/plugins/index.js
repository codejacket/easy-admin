import cache from './modules/cache'
import dict from './modules/dict'
import download from './modules/download'
import modal from './modules/modal'

export default {
    install(app) {
        app.config.globalProperties.$cache = cache
        app.config.globalProperties.$dict = dict
        app.config.globalProperties.$download = download
        app.config.globalProperties.$modal = modal
    }
}
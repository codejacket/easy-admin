import clipboard from './modules/clipboard'
import auth from './modules/auth'
import preventReclick from './modules/preventReclick'
import onClickRotate from './modules/onClickRotate'

export default {
    install(app) {
        app.directive('clipboard', clipboard)
        app.directive('auth', auth)
        app.directive('preventReclick', preventReclick)
        app.directive('onClickRotate', onClickRotate)
    }
}

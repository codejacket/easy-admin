import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { tap } from '@/utils'
import { $t } from '@/locales'

let messageInstance
let loadingInstance

let types = ['success', 'info', 'warning', 'error']

export default {
    // 消息弹框
    alert: tap(() => {
        return types.reduce((func, type) => {
            func[type] = func.bind(type)
            return func
        }, function (content, options) {
            if (Object.prototype.toString.call(options) !== '[object Object]') options = {}
            return ElMessageBox.alert(content, $t('common.systemTip'), {
                confirmButtonText: $t('common.confirm'),
                cancelButtonText: $t('common.cancel'),
                type: this,
                ...options
            })
        }.bind(null))
    }),
    // 确认弹框
    confirm: tap(() => {
        return types.reduce((func, type) => {
            func[type] = func.bind(type)
            return func
        }, function (content, options) {
            if (Object.prototype.toString.call(options) !== '[object Object]') options = {}
            return ElMessageBox.confirm(content, $t('common.systemTip'), {
                confirmButtonText: $t('common.confirm'),
                cancelButtonText: $t('common.cancel'),
                type: this,
                ...options
            })
        }.bind(null))
    }),
    // 提交弹框
    prompt: tap(() => {
        return types.reduce((func, type) => {
            func[type] = func.bind(type)
            return func
        }, function (content, options) {
            if (Object.prototype.toString.call(options) !== '[object Object]') options = {}
            return ElMessageBox.prompt(content, $t('common.systemTip'), {
                confirmButtonText: $t('common.confirm'),
                cancelButtonText: $t('common.cancel'),
                type: this,
                ...options
            })
        }.bind(null))
    }),
    // 消息提示
    message: tap(() => {
        return types.reduce((func, type) => {
            func[type] = func.bind(type)
            return func
        }, function(options) {
            if (typeof options === 'string') options = { message: options }
            // 避免重复提示
            if (messageInstance?.message !== options.message || messageInstance?.type !== this) {
                messageInstance = { message: options.message, type: this }
                ElMessage.closeAll()
            }
            return ElMessage({
                grouping: true,
                type: this,
                ...options
            })
        })
    }),
    // 遮罩层
    loading: {
        // 打开
        open(content) {
            loadingInstance = ElLoading.service({
                lock: true,
                text: content,
                background: "rgba(0, 0, 0, 0.7)",
            })
        },
        // 关闭
        close() {
            loadingInstance?.close()
        }
    }
}
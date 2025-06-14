import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { $t } from '@/locales'

let messageInstance
let loadingInstance

let types = ['success', 'info', 'warning', 'error']

export default {
    // 消息弹框
    alert: types.reduce((func, type) => {
        func[type] = alertFactory(type)
        return func
    }, alertFactory()),
    // 确认弹框
    confirm: types.reduce((func, type) => {
        func[type] = confirmFactory(type)
        return func
    }, confirmFactory()),
    // 提交弹框
    prompt: types.reduce((func, type) => {
        func[type] = promptFactory(type)
        return func
    }, promptFactory()),
    // 消息提示
    message: types.reduce((func, type) => {
        func[type] = messageFactory(type)
        return func
    }, messageFactory()),
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

function alertFactory(type) {
    return function (content, options) {
        if (Object.prototype.toString.call(options) !== '[object Object]') options = {}
        return ElMessageBox.alert(content, $t('common.systemTip'), {
            confirmButtonText: $t('common.confirm'),
            cancelButtonText: $t('common.cancel'),
            type,
            ...options
        })
    }
}

function confirmFactory(type) {
    return function (content, options) {
        if (Object.prototype.toString.call(options) !== '[object Object]') options = {}
        return ElMessageBox.confirm(content, $t('common.systemTip'), {
            confirmButtonText: $t('common.confirm'),
            cancelButtonText: $t('common.cancel'),
            type,
            ...options
        })
    }
}

function promptFactory(type) {
    return function (content, options) {
        if (Object.prototype.toString.call(options) !== '[object Object]') options = {}
        return ElMessageBox.prompt(content, $t('common.systemTip'), {
            confirmButtonText: $t('common.confirm'),
            cancelButtonText: $t('common.cancel'),
            type,
            ...options
        })
    }
}

function messageFactory(type) {
    return function (options) {
        if (typeof options === 'string') options = { message: options }
        // 避免重复提示
        if (messageInstance?.message !== options.message || messageInstance?.type !== type) {
            messageInstance = { message: options.message, type }
            ElMessage.closeAll()
        }
        return ElMessage({
            grouping: true,
            type,
            ...options
        })
    }
}
import axios from 'axios'
import i18n from '@/locales'
import modal from '@/plugins/modules/modal'
import { session } from '@/plugins/modules/cache'
import { $t, $tm } from '@/locales'
import { getToken } from '@/utils/auth'
import { useUserStore } from '@store/user'
import { tansParams } from '@/utils'
import { ElNotification } from 'element-plus'

export let isRelogin = { show: false }

// 错误码
const errorCode = $tm('state')

// 设置axios默认请求头
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: process.env.VUE_APP_BASE_API,
    // 超时
    timeout: 10000
})

// request拦截器
service.interceptors.request.use(config => {
    // 告知后端希望接收的语言
    config.headers['Accept-Language'] = i18n.global.locale
    // 是否需要设置 token
    const isToken = config.headers?.isToken === false
    // 是否需要防止数据重复提交
    const isRepeatSubmit = config.headers?.repeatSubmit === false
    // 获取 token
    const token = getToken()
    if (token && !isToken) {
        // 让每个请求携带自定义token 请根据实际情况自行修改
        config.headers.Authorization = 'Bearer ' + token
    }
    if (config.method === 'get' && config.params) {
        config.url = `${config.url}?${tansParams(config.params)}`.slice(0, -1)
        config.params = {}
    }
    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
        const requestObj = {
            url: config.url,
            data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
            time: new Date().getTime()
        }
        const sessionObj = session.getItem('sessionObj')
        if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
            session.setItem('sessionObj', requestObj)
        } else {
            const { url, data, time } = sessionObj
            const interval = 1000       // 间隔时间(ms)，小于此时间视为重复提交
            if (data === requestObj.data && requestObj.time - time < interval && url === requestObj.url) {
                const message = $t('message.committing')
                console.warn(`[${url}]: ${message}`)
                return Promise.reject(new Error(message))
            } else {
                session.setItem('sessionObj', requestObj)
            }
        }
    }
    return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
    // 未设置状态码则默认成功状态
    let code = res.data?.code || 200
    // 获取错误信息
    let msg = errorCode[code] || res.data?.msg || errorCode['default']
    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
        return res.data
    }
    // 处理状态码
    if (code === 200) {
        return res.data
    } else if (code === 401) {
        if (!isRelogin.show) {
            isRelogin.show = true
            modal.confirm($t('message.loginExpired'), $t('common.systemTip'), {
                confirmButtonText: $t('common.relogin'),
                cancelButtonText: $t('common.cancel'),
                type: 'warning',
            }).then(() => {
                isRelogin.show = false
                useUserStore().logout().then(() => {
                    location.href = '/'
                })
            }).catch(() => {
                isRelogin.show = false
            })
        }
        return Promise.reject($t('message.invalidSession'))
    } else if (code === 500) {
        modal.message.error(msg)
        return Promise.reject(new Error(msg))
    } else if (code === 601) {
        modal.message.warning(msg)
        return Promise.reject('error')
    } else {
        ElNotification.error(msg)
        return Promise.reject('error')
    }
}, error => {
    console.error('err:' + error)
    console.log('error.response.data.status:' + error.response?.data?.status)
    let { message } = error
    if (message == "Network Error") {
        message = $t('message.networkError')
    } else if (message.includes("timeout")) {
        message = $t('message.timeout')
    } else if (message.includes("Request failed with status code")) {
        message = message.substr(message.length - 3)
    }
    modal.message.error({ message, duration: 5 * 1000 })
    Promise.reject(error)
})

export default service

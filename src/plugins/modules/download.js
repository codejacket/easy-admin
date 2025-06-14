import service from '@/utils/request'
import axios from 'axios'
import modal from '@/plugins/modules/modal'
import { ElLoading } from 'element-plus'
import { saveAs } from 'file-saver'
import { getToken } from '@/utils/auth'
import { $t, $tm } from '@/locales'
import { tansParams } from '@/utils'
import { isBlob } from '@/utils/validate'

const baseURL = process.env.VUE_APP_BASE_API
// 错误码
const errorCode = $tm('state')

// 通用下载方法
let downloadLoadingInstance
async function download(url, params, filename, config) {
    downloadLoadingInstance = ElLoading.service({ text: $t('message.downloading'), background: 'rgba(0, 0, 0, 0.7)' })
    try {
        const data = await service.post(url, params, {
            transformRequest: [(params) => tansParams(params)],
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            responseType: 'blob',
            ...config
        })
        if (isBlob(data)) {
            saveAs(new Blob([data]), filename)
        } else {
            handleErrorResponse(data)
        }
    } catch (error) {
        console.error(error)
        modal.message.error($t('message.downloadFailed'))
    } finally {
        downloadLoadingInstance.close()
    }
}

download.zip = async function (url, name) {
    const { data } = await axios({
        method: 'get',
        url: baseURL + url,
        responseType: 'blob',
        headers: { 'Authorization': 'Bearer ' + getToken() }
    })
    if (isBlob(data)) {
        saveAs(new Blob([data], { type: 'application/zip' }), name)
    } else {
        handleErrorResponse(data)
    }
}

async function handleErrorResponse(data) {
    const resText = await data.text()
    const rspObj = JSON.parse(resText)
    const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
    modal.message.error(errMsg)
}

export default download
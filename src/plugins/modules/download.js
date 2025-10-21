import service from '@/api'
import { $t, $tm } from '@/locales'
import { tansParams } from '@/utils'
import { getToken } from '@/utils/auth'
import { isBlob } from '@/utils/validate'
import modal from '@plugins/modal'
import axios from 'axios'
import { ElLoading } from 'element-plus'
import { saveAs } from 'file-saver'

const baseURL = import.meta.env.VITE_APP_BASE_API
// 错误码
const errorCode = $tm('state')

// 通用下载方法
let downloadLoadingInstance

async function download(url, params, filename, config) {
  downloadLoadingInstance = ElLoading.service({
    text: $t('message.downloading'),
    background: 'rgba(0, 0, 0, 0.7)',
  })
  try {
    const data = await service.post(url, params, {
      transformRequest: [tansParams],
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob',
      ...config,
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
    headers: { 'Authorization': 'Bearer ' + getToken() },
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

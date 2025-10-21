import request from '@/api'

export function getInfo() {
  return request({
    url: '/system/info',
    method: 'get',
  })
}

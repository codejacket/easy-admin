import request from '@/api'
import { upperFirst } from 'lodash-es'

export function crud(url, suffix) {
  let name = upperFirst(suffix)
  if (url) {
    return {
      [`list${name}`](params) {
        return request({
          method: 'get',
          url,
          params,
        })
      },
      [`get${name}`](id) {
        return request({
          method: 'get',
          url: `${url}/${id}`,
        })
      },
      [`add${name}`](data) {
        return request({
          url,
          method: 'post',
          data,
        })
      },
      [`update${name}`](data) {
        return request({
          method: 'put',
          url,
          data,
        })
      },
      [`patch${name}`](data) {
        return request({
          method: 'patch',
          url,
          data,
        })
      },
      [`del${name}`](ids) {
        return request({
          method: 'delete',
          url,
          data: ids,
        })
      },
    }
  }
}

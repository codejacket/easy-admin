import request from '@/api'
import { crud } from '@/utils/crud'

export const { listDict, getDict, addDict, updateDict, delDict } = crud('/system/dict', 'dict')
export const { listDictData, getDictData, addDictData, updateDictData, delDictData } = crud(
  '/system/dictData',
  'dictData',
)

export function getDicts(params) {
  return request({
    url: '/system/dicts',
    method: 'get',
    params,
  })
}

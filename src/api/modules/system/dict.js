import request from '@/utils/request'
import { crud } from '@/utils/crud'

export const { list, get, add, update, del } = crud('/system/dict')

export const { listDictData, getDictData, addDictData, updateDictData, delDictData } = crud('/system/dictData', 'dictData')

export function getDict(keys, locales) {
    return request({
        url: '/system/dict/getDict',
        method: 'get',
        params: { keys, locales },
        headers: {
            repeatSubmit: false
        }
    })
}
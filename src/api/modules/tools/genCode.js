import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { crud } from '@/utils/crud'

export const { list, get, add, update, del } = crud("/tools/genCode")

// 查询数据库列表
export function listDbTable(params) {
    return request({
        url: "/tools/genCode/dbTable",
        method: "get",
        params
    })
}

// 查询数据库名称列表
export function listDbTableName() {
    return request({
        url: "/tools/genCode/dbTable/name",
        method: "get"
    })
}

export function importDbTable(tableName) {
    return request({
        url: `/tools/genCode/dbTable/${tableName}/import`,
        method: "get"
    })
}

// 查询数据库表字段列表
export function listDbTableField(tableName) {
    return request({
        url: `/tools/genCode/dbTable/${tableName}/field`,
        method: "get"
    })
}

// 预览代码
export function previewCode(id) {
    return request({
        url: `/tools/genCode/${id}/previewCode`,
        method: "get"
    })
}

// 生成代码
export function downloadCode(ids) {
    return request({
        method: 'get',
        url: `/tools/genCode/download?ids=${ids}`,
        responseType: 'blob',
        headers: { 'Authorization': 'Bearer ' + getToken() }
    })
}
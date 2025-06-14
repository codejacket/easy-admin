import request from '@/utils/request'

// 查询菜单列表
export function list(params) {
    return request({
        url: '/system/menu',
        method: 'get',
        params
    })
}

// 查询菜单详情
export function get(id) {
    return request({
        url: `/system/menu/${id}`,
        method: 'get'
    })
}

// 新增菜单
export function add(data) {
    return request({
        url: '/system/menu',
        method: 'post',
        data
    })
}

// 删除菜单
export function del(ids) {
    return request({
        url: '/system/menu',
        method: 'delete',
        data: ids
    })
}

// 修改菜单
export function update(data) {
    return request({
        url: '/system/menu',
        method: 'put',
        data
    })
}

// 排序菜单
export function move(id, targetId, order) {
    return request({
        url: '/system/menu/move',
        method: 'get',
        params: { id, targetId, order }
    })
}
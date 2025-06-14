import request from '@/utils/request'

// 获取基本信息
export function getBaseInfo() {
    return request({
        url: '/system/profile/getBaseInfo',
        methods: 'get'
    })
}

// 修改基本信息
export function updateBaseInfo(data) {
    return request({
        url: '/system/profile/updateBaseInfo',
        method: 'post',
        data: data
    })
}

// 用户头像上传
export function uploadAvatar(data) {
    return request({
        url: '/system/profile/uploadAvatar',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}

// 修改密码
export function updatePwd(data) {
    return request({
        url: '/system/profile/updatePwd',
        method: 'post',
        data: data
    })
}

// 查询登录日志
export function getLoginLogs(params) {
    return request({
        url: '/system/profile/getLoginLogs',
        method: 'get',
        params
    })
}
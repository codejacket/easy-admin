const { usersList, loginList } = require(`${process.cwd()}/mock/data`)
const { pick, omit, tokenManager } = require(`${process.cwd()}/mock/utils`)

module.exports = [{
    url: '/mock/system/profile/getBaseInfo',
    method: 'get',
    response(req) {
        let data = tokenManager.parseToken(req.headers.authorization.replace('Bearer ', ''))
        let user = usersList.find(item => item.username === data.username && item.password === data.password)
        return {
            code: 200,
            msg: '操作成功',
            data: omit(user, ['password'])
        }
    }
}, {
    url: '/mock/system/profile/updateBaseInfo',
    method: 'post',
    response(req) {
        let form = req.body
        let data = tokenManager.parseToken(req.headers.authorization.replace('Bearer ', ''))
        let user = usersList.find(item => item.username === data.username && item.password === data.password)
        user = Object.assign(user, form)
        return {
            code: 200,
            msg: '操作成功',
        }
    }
}, {
    url: '/mock/system/profile/uploadAvatar',
    method: 'post',
    response(req) {
        let data = tokenManager.parseToken(req.headers.authorization.replace('Bearer ', ''))
        return {
            code: 200,
            msg: '操作成功',
        }
    }
}, {
    url: '/mock/system/profile/updatePwd',
    method: 'post',
    response(req) {
        let { oldPassword, newPassword, confirmPassword } = req.body
        let data = tokenManager.parseToken(req.headers.authorization.replace('Bearer ', ''))
        let user = usersList.find(item => item.username === data.username && item.password === data.password)
        if (newPassword === confirmPassword) {
            if (newPassword !== '') {
                if (user.password === oldPassword) {
                    user.password = newPassword
                    return {
                        code: 200,
                        msg: '操作成功',
                    }
                } else {
                    return {
                        code: 500,
                        msg: '旧密码错误',
                    }
                }
            } else {
                return {
                    code: 500,
                    msg: '密码不能为空',
                }
            }
        } else {
            return {
                code: 500,
                msg: '两次输入的密码不一致',
            }
        }
    }
}, {
    url: '/mock/system/profile/getLoginLogs',
    method: 'get',
    response(req) {
        let { pageIndex, pageSize, ...params } = req.query
        let data = loginList.filter(item => {
            return Object.keys(params).every(key => {
                return item[key]?.includes(params[key])
            })
        })
        .slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
        .map(item => pick(item, ['title', 'time']))
        return {
            code: 200,
            msg: '操作成功',
            data: {
                rows: data,
                total: loginList.length
            }
        }
    }
}]
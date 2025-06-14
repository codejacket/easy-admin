const { usersList } = require(`${process.cwd()}/mock/data`)
const { pick, tokenManager, tap } = require(`${process.cwd()}/mock/utils`)

module.exports = [{
    url: '/mock/login',
    method: 'post',
    response(req) {
        const { username, password } = req.body
        const user = usersList.find(item => item.username === username && item.password === password)
        if (user) {
            return {
                code: 200,
                msg: '操作成功',
                token: tokenManager.createToken({
                    username: username,
                    password: password
                })
            }
        } else {
            return {
                code: 500,
                msg: '用户名或密码错误'
            }
        }
    }
}, {
    url: '/mock/logout',
    method: 'post'
}, {
    url: '/mock/getInfo',
    method: 'get',
    response(req) {
        let data = tokenManager.parseToken(req.headers.authorization.replace('Bearer ', ''))
        let user = usersList.find(item => item.username === data.username && item.password === data.password)
        return {
            code: 200,
            mag: "操作成功",
            data: {
                roles: ["admin"],
                permissions: [],
                user: pick(user, ['username', 'nickname', 'avatar']),
            }
        }
    }
}, {
    url: '/mock/captcha',
    method: 'get',
    response(req) {
        let vaildKey = 'captcha'
        let captchaType = req.query.captchaType || 'image'
        let captcha = {
            'pick': {
                code: btoa(`${vaildKey}:${captchaType}`),
                img: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/default-captcha-image.jpeg',
                options: ['<六角形>', '雨', '<圆>']
            },
            'slide': {
                code: btoa(`${vaildKey}:${captchaType}`),
                img: 'https://p9-catpcha.byteimg.com/tos-cn-i-188rlo5p4y/11f43444d4e7463a9f9da4df85e49bc0~tplv-188rlo5p4y-2.jpeg',
                pieces: 'https://p9-catpcha.byteimg.com/tos-cn-i-188rlo5p4y/0f382e60408e49ac860551096b21861e~tplv-188rlo5p4y-1.png',
                y: '50',
            },
            'image': {
                code: btoa(`${vaildKey}:${captchaType}`),
                img: 'https://pic.baike.soso.com/ugc/baikepic2/15771/20180126172741-129018030_jpg_273_136_7519.jpg/300',
            }
        }
        return {
            code: 200,
            msg: "操作成功",
            data: captcha[captchaType]
        }
    }
}, {
    url: '/mock/captcha/check',
    method: 'post',
    response(req) {
        let str = atob(req.body.code)
        let captchaType = str.replace('captcha:', '')
        let successResult = {
            code: 200,
            msg: '操作成功',
        }
        let failResult = {
            code: 500,
            msg: '验证失败'
        }
        if (str.includes('captcha')) {
            let result = {
                'pick': tap(() => {
                    return successResult
                }),
                'slide': tap(() => {
                    if (req.body.x > 222 && req.body.x < 233) {
                        if (req.body.timestamp < 3000) {
                            return successResult
                        } else {
                            return {
                                code: 500,
                                msg: '验证超时'
                            }
                        }
                    } else {
                        return failResult
                    }
                }),
                'image': tap(() => {
                    return req.body.code === 'uwv6' ?
                        successResult : failResult
                })
            }
            return result[captchaType]
        } else {
            return failResult
        }
    }
}]
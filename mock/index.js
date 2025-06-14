const Mock = require('mockjs')
const chalk = require('chalk')
const chokidar = require('chokidar')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')

const mockDir = path.join(process.cwd(), 'mock')

module.exports = function (middlewares, devServer) {
    // 是否开启Mock
    if (process.env.VUE_APP_MOCK === 'true') {
        devServer.app.use(bodyParser.json())
        devServer.app.use(bodyParser.urlencoded({ extended: false }))
        // 注册 拦截器
        devServer.app.use(authMiddleware)
        // 注册 Mock api
        const res = registerApis(devServer.app)
        console.log(chalk.magentaBright(`Mock Server started successfully!`))
        if (res && process.env.VUE_APP_MOCK_HOT_RELOAD === 'true') {
            mockHotReload(devServer.app, res.mockStartIndex, res.mocksLength)
        }
    }
    // 返回中间件 (必须)
    return middlewares
}

function getJsFiles(dir, result = []) {
    const files = fs.readdirSync(dir)
    files.forEach(file => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        if (stat.isDirectory()) {
            getJsFiles(filePath, result)
        } else if (stat.isFile() && path.extname(file) === '.js') {
            result.push(filePath)
        }
    })

    return result
}

function registerApis(app) {
    const modules = getJsFiles(mockDir + '/modules').map(require)
    if (modules instanceof Array) {
        let mocksLength = 0
        modules.forEach(module => {
            module.forEach(({ url, method, timeout, response }) => {
                const mock = responseFake(url, method, timeout, response)
                app[mock.method](mock.url, mock.response)
                mocksLength++
            })
        })
        return {
            mockStartIndex: app._router.stack.length - mocksLength,
            mocksLength
        }
    }
}

function deregisterApis() {
    Object.keys(require.cache).forEach(i => {
        if (i.includes(mockDir)) {
            delete require.cache[require.resolve(i)]
        }
    })
}

// 登录拦截器
function authMiddleware(req, res, next) {
    let { tokenManager } = require('./utils')
    let token = req.headers.authorization
    let data = tokenManager.parseToken(token?.replace?.('Bearer ', ''))
    if (data || token === undefined) {
        next()
    } else {
        res.send({
            code: 401
        })
    }
}

function responseFake(url, method, timeout, respond) {
    return {
        url,
        method: method || 'get',
        async response(req, res, next) {
            // console.log(chalk.magentaBright(`request invoke: ${req.path}`))
            if (typeof timeout === "number") await new Promise(resolve => setTimeout(resolve, timeout))
            let result = respond instanceof Function ? await respond(req, res, next) : respond
            res.json(Mock.mock(result))
        }
    }
}

function mockHotReload(app, mockStartIndex, mocksLength) {
    chokidar.watch(mockDir, { ignoreInitial: true }).on('all', (event, path) => {
        if (event === 'change' || event === 'add') {
            try {
                // 重新注册路由
                app._router.stack.splice(mockStartIndex, mocksLength)
                deregisterApis()
                const res = registerApis(app)
                mockStartIndex = res.mockStartIndex
                mocksLength = res.mocksLength
                // console.log(chalk.magentaBright(`\n > Mock Server hot reload success! changed  ${path}`))
            } catch (error) {
                console.log(chalk.redBright(error))
            }
        }
    })
}
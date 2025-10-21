import { loadEnv } from 'vite'
import jwt from '../utils/jwt'

const baseApi = loadEnv('mock', process.cwd()).VITE_APP_BASE_API

// 白名单
const whiteList = ['/mock/login', '/mock/captcha', '/mock/captcha/verify']

export default function authInterceptor(req, res, next) {
  let include = whiteList.some(item => {
    if (item instanceof RegExp) {
      return item.test(req.url)
    } else {
      return item === req.url
    }
  })
  if (req.url.startsWith(`${baseApi}/`) && !include) {
    try {
      let token = req.headers.authorization.replace('Bearer ', '')
      jwt.verifyToken(token)
      next()
    } catch (error) {
      res.end(
        JSON.stringify({
          code: 401,
        }),
      )
    }
  } else {
    next()
  }
}

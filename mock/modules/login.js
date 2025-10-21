import { find, pick } from 'lodash-es'
import { authList, roleList, userList } from '../data'
import { getUser } from '../utils/index'
import { generateToken } from '../utils/jwt'
import { error, success } from '../utils/result'

const captchaType = 'pick'

export default [
  {
    url: '/mock/login',
    method: 'post',
    response({ body }) {
      const { username, password } = body
      const user = find(userList, { username, password })
      if (user) {
        return {
          code: 200,
          msg: '登录成功',
          token: generateToken(pick(user, ['username', 'nickname'])),
        }
      } else {
        return error('用户名或密码错误')
      }
    },
  },
  {
    url: '/mock/logout',
    method: 'post',
  },
  {
    url: '/mock/getInfo',
    method: 'get',
    response({ headers }) {
      let user = getUser(headers)
      let roles = roleList.filter(item => user.roles.includes(item.id))
      let authIds = [...new Set(roles.flatMap(item => item.auths))]
      let auths = authList.filter(item => authIds.includes(item.id))
      return success({
        roles: roles.map(item => item.key),
        auths: auths.map(item => item.key),
        user: pick(user, ['username', 'nickname', 'avatar']),
      })
    },
  },
  {
    url: '/mock/captcha',
    method: 'get',
    response() {
      switch (captchaType) {
        case 'pick':
          return success({
            type: 'pick',
            width: 350,
            height: 200,
            img: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/default-captcha-image.jpeg',
            options: ['找', '比', '燕'],
            code: JSON.stringify([
              { x: 33, y: 44 },
              { x: 78, y: 44 },
              { x: 323, y: 75 },
            ]),
          })
        case 'slide':
          return success({
            type: 'slide',
            img: 'https://github.com/xingyuv/captcha-plus/blob/main/images/jigsaw/original/bg1.png',
            width: 350,
            height: 200,
            block:
              'https://github.com/xingyuv/captcha-plus/blob/main/images/jigsaw/slidingBlock/1.png',
            blockWidth: 50,
            blockHeight: 50,
            y: 50,
            code: JSON.stringify(120),
          })
        default:
          return success({ type: '' })
      }
    },
  },
  {
    url: '/mock/captcha/verify',
    method: 'post',
    response({ body }) {
      switch (captchaType) {
        case 'pick': {
          let { points, code } = body
          let standard = JSON.parse(code)
          let tolerance = 20
          let ok = standard.every((item, i) => {
            return Math.hypot(item.x - points[i].x, item.y - points[i].y) < tolerance
          })
          return ok ? success() : error('验证失败')
        }
        case 'slide': {
          let { x, timestamp, code } = body
          let standard = JSON.parse(code)
          let tolerance = 10
          let ok = Math.abs(x - standard) < tolerance
          let overTime = timestamp - standard > 7000
          if (!ok) return error('验证失败')
          if (overTime) return error('验证超时')
          return success()
        }
        default: {
          return success()
        }
      }
    },
  },
]

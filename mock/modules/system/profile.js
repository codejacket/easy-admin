import { merge, omit } from 'lodash-es'
import { loginLogList } from '../../data'
import { getUser, toPage } from '../../utils/index'
import { error, success } from '../../utils/result'

export default [
  {
    // 获取基本信息
    url: '/mock/system/profile/baseInfo',
    method: 'get',
    response({ headers }) {
      let user = getUser(headers)
      return success(omit(user, ['password']))
    },
  },
  {
    // 修改基本信息
    url: '/mock/system/profile/baseInfo',
    method: 'post',
    response({ headers, body }) {
      let user = getUser(headers)
      merge(user, body)
      return success()
    },
  },
  {
    // 用户头像上传
    url: '/mock/system/profile/avatar',
    method: 'post',
    response({ headers }) {
      let user = getUser(headers)
      return success()
    },
  },
  {
    // 修改密码
    url: '/mock/system/profile/pwd',
    method: 'post',
    response({ headers, body }) {
      let { oldPassword, newPassword, confirmPassword } = body
      let user = getUser(headers)
      if (newPassword === confirmPassword) {
        if (newPassword !== '') {
          if (user.password === oldPassword) {
            user.password = newPassword
            return success()
          } else {
            return error('旧密码错误')
          }
        } else {
          return error('密码不能为空')
        }
      } else {
        return error('两次输入的密码不一致')
      }
    },
  },
  {
    url: '/mock/system/profile/loginLogs',
    method: 'get',
    response({ query }) {
      return success(toPage(loginLogList, query))
    },
  },
]

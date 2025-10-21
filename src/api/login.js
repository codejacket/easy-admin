import request from '@/api'

// 登录方法
export function login(username, password) {
  return request({
    url: '/login',
    method: 'post',
    headers: { isToken: false },
    data: { username, password },
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/logout',
    method: 'post',
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get',
  })
}

// 获取验证码
export function getCaptcha() {
  return request({
    url: '/captcha',
    method: 'get',
    headers: { isToken: false },
    timeout: 20000,
  })
}

// 校验验证码
export function verifyCaptcha(data) {
  return request({
    url: '/captcha/verify',
    method: 'post',
    data,
  })
}

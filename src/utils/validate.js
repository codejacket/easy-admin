// 判断是否为外部链接
export function isExternal(url) {
  return /^(http|https):\/\/[^"']+$/.test(url)
}

// 判断两个对象是否相等
export function isEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

// 判断是否为blob格式
export function isBlob(data) {
  if (data) {
    return data.type !== 'application/json'
  }
}

// 验证邮箱格式
export function validEmail(email) {
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

// 验证手机号格式
export function validPhoneNumber(str) {
  return /^1[3-9]\d{9}$/.test(str)
}

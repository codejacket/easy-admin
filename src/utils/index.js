// 参数处理
export function tansParams(params) {
  let result = ''
  for (const [propName, value] of Object.entries(params)) {
    let part = encodeURIComponent(propName) + '='
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== '' && typeof value[key] !== 'undefined') {
            result += `${encodeURIComponent(propName + '[' + key + ']')}=${encodeURIComponent(value[key])}&`
          }
        }
      } else {
        result += `${part}${encodeURIComponent(value)}&`
      }
    }
  }
  return result
}

// 日期格式化
export function parseTime(date, pattern = '{y}-{m}-{d} {h}:{i}:{s}') {
  if (date instanceof Date) {
    return pattern?.replace(/{(y|m|d|h|i|s|a)}/g, (_, key) => {
      return {
        y: date.getFullYear(),
        m: (date.getMonth() + 1).toString().padStart(2, '0'),
        d: date.getDate().toString().padStart(2, '0'),
        h: date.getHours().toString().padStart(2, '0'),
        i: date.getMinutes().toString().padStart(2, '0'),
        s: date.getSeconds().toString().padStart(2, '0'),
        a: date.getDay(),
      }[key]
    })
  } else if (typeof date === 'string' || typeof date === 'number') {
    return parseTime(new Date(date), pattern)
  }
}

export function formatCase(str, from = 'xX', to = 'x-x') {
  function titleCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  function getRule(str) {
    if (/[xX]{1}([xX]{1}|[\s-_]{1}[xX]{1})/.test(str)) {
      return {
        upperFirst: str[0] === 'X',
        separator: str.length === 2 ? '' : str[1],
        upperBehind: str[str.length - 1] === 'X',
      }
    }
  }

  let fromRule = getRule(from)
  let toRule = getRule(to)

  return str
    .split(fromRule.separator === '' ? /(?=[A-Z])/ : fromRule.separator)
    .map((word, i) => {
      return (toRule.upperFirst && i === 0) || (toRule.upperBehind && i !== 0)
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word.charAt(0).toLowerCase() + word.slice(1)
    })
    .join(toRule.separator)
}

// 数组去重
export function add(arr, items, equals = (a, b) => a === b) {
  for (const item of [].concat(items)) {
    if (!arr.some(a => equals(a, item))) {
      arr.push(item)
    }
  }
}

// 打印日志并返回值
export function log(obj) {
  console.log(obj)
  return obj
}

// 全局方法
export default {
  install(app) {
    app.config.globalProperties.$parseTime = parseTime
    app.config.globalProperties.$log = log
  },
}

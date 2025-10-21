import { dispatch } from './index'

function result(code, msg, data) {
  return {
    code,
    msg,
    data,
  }
}

export function success(...args) {
  return dispatch(args, [
    {
      types: [],
      method() {
        return {
          code: 200,
          msg: '操作成功',
        }
      },
    },
    {
      types: ['string'],
      method(msg) {
        return {
          code: 200,
          msg: msg,
        }
      },
    },
    {
      types: ['any'],
      method(data) {
        return {
          code: 200,
          msg: '操作成功',
          data,
        }
      },
    },
    {
      types: ['string', 'any'],
      method(msg, data) {
        return {
          code: 200,
          msg,
          data,
        }
      },
    },
  ])
}

export function error(...args) {
  return dispatch(args, [
    {
      types: [],
      method() {
        return {
          code: 500,
          msg: '操作失败',
        }
      },
    },
    {
      types: ['string'],
      method(msg) {
        return {
          code: 500,
          msg,
        }
      },
    },
    {
      types: ['number', 'string'],
      method(code, msg) {
        return {
          code,
          msg,
        }
      },
    },
    {
      types: ['string', 'any'],
      method(msg, data) {
        return {
          code: 500,
          msg,
          data,
        }
      },
    },
  ])
}

result.success = success
result.error = error
export default result

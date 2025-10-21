import { merge, remove } from 'lodash-es'
import qs from 'qs'
import { dictDataList, dictList } from '../../data'
import { eq, filterByQuery, getNextId, getUser, parseTime, toPage } from '../../utils/index'
import { error, success } from '../../utils/result'

export default [
  {
    url: '/mock/system/dict',
    method: 'get',
    response({ query }) {
      return success(
        toPage(dictList, query, {
          name: 'like',
          type: 'like',
          status: 'eq',
          locale: 'like',
        }),
      )
    },
  },
  {
    url: '/mock/system/dicts',
    method: 'get',
    response({ query }) {
      let { types: type, locales: locale } = qs.parse(query)
      let res = filterByQuery(
        dictList,
        {
          type,
          locale,
        },
        {
          type: 'in',
          locale: 'in',
        },
      ).reduce((acc, item) => {
        return merge(acc, {
          [item.locale]: {
            [item.type]: dictDataList
              .filter(dictData => {
                return dictData.dictId === item.id
              })
              .sort((a, b) => {
                return a.order - b.order
              })
              .map(({ value, label, status }) => {
                return { value, label, disabled: status === 1 }
              }),
          },
        })
      }, {})
      return success(res)
    },
  },
  {
    url: '/mock/system/dict/:id',
    method: 'get',
    response({ query }) {
      return success(dictList.find(item => eq(item.id, query.id)))
    },
  },
  {
    url: '/mock/system/dict',
    method: 'post',
    response({ body, headers }) {
      if (dictList.some(item => item.type === body.type && item.locale === body.locale)) {
        return error(`字典【 ${body.type} (${body.locale}) 】已存在`)
      } else {
        let dict = {
          status: 0,
        }
        let updateData = {
          id: getNextId(dictList),
          createBy: getUser(headers).username,
          createTime: parseTime(new Date()),
        }
        merge(dict, body, updateData)
        dictList.push(dict)
        return success()
      }
    },
  },
  {
    url: '/mock/system/dict',
    method: 'put',
    response({ body, headers }) {
      let dict = dictList.find(item => eq(item.id, body.id))
      let updateData = {
        updateBy: getUser(headers).username,
        updateTime: parseTime(new Date()),
      }
      if (
        dictList.some(item => {
          return !eq(item.id, body.id) && item.type === body.type && item.locale === body.locale
        })
      ) {
        return error('字典类型已存在')
      } else {
        merge(dict, body, updateData)
        return success()
      }
    },
  },
  {
    url: '/mock/system/dict',
    method: 'delete',
    response({ body }) {
      remove(dictList, item => body.includes(item.id))
      remove(dictDataList, item => body.includes(item.dictId))
      return success()
    },
  },
  {
    url: '/mock/system/dictData',
    method: 'get',
    response({ query }) {
      return success(
        toPage(dictDataList, query, {
          dictId: 'eq',
        }),
      )
    },
  },
  {
    url: '/mock/system/dictData/:id',
    method: 'get',
    response({ query }) {
      return success(dictDataList.find(item => eq(item.id, query.id)))
    },
  },
  {
    url: '/mock/system/dictData',
    method: 'post',
    response({ body, headers }) {
      if (body.dictId) {
        let dictData = {
          status: 0,
        }
        let updateData = {
          id: getNextId(dictDataList),
          createBy: getUser(headers).username,
          createTime: parseTime(new Date()),
        }
        merge(dictData, body, updateData)
        dictDataList.push(dictData)
        return success()
      } else {
        return error('请选择字典')
      }
    },
  },
  {
    url: '/mock/system/dictData',
    method: 'put',
    response({ body, headers }) {
      if (body.dictId) {
        let dictData = dictDataList.find(item => eq(item.id, body.id))
        let updateData = {
          updateBy: getUser(headers).username,
          updateTime: parseTime(new Date()),
        }
        merge(dictData, body, updateData)
        return success()
      } else {
        return error('请选择字典')
      }
    },
  },
  {
    url: '/mock/system/dictData',
    method: 'delete',
    response({ body }) {
      remove(dictDataList, item => body.includes(item.id))
      return success()
    },
  },
]

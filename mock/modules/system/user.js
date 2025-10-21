import { merge, omit, remove } from 'lodash-es'
import { userList } from '../../data'
import { eq, getNextId, getUser, parseTime, toPage } from '../../utils/index'
import { error, success } from '../../utils/result'

export default [
  {
    url: '/mock/system/user',
    method: 'get',
    response({ query }) {
      return success(
        toPage(userList, query, {
          username: 'like',
          nickname: 'like',
          gender: 'eq',
          email: 'like',
          phoneNumber: 'like',
          status: 'eq',
        }),
      )
    },
  },
  {
    url: '/mock/system/user/:id',
    method: 'get',
    response({ query }) {
      return success(
        omit(
          userList.find(item => `${item.id}` === query.id),
          ['password'],
        ),
      )
    },
  },
  {
    url: '/mock/system/user',
    method: 'post',
    response({ body, headers }) {
      let user = {
        status: '0',
      }
      let updateData = {
        id: getNextId(userList),
        passward: body.passward,
        createBy: getUser(headers).username,
        createTime: parseTime(new Date()),
      }
      merge(user, body, updateData)
      if (userList.some(item => item.username === body.username)) {
        return error(`用户【${body.username}】已存在`)
      } else {
        userList.push(user)
        return success()
      }
    },
  },
  {
    url: '/mock/system/user',
    method: 'put',
    response({ body, headers }) {
      let user = userList.find(item => eq(item.id, body.id))
      let updateData = {
        updateBy: getUser(headers).username,
        updateTime: parseTime(new Date()),
      }
      if (userList.some(item => !eq(item.id, body.id) && item.username === body.username)) {
        return error(`用户【${user.username}】已存在`)
      } else {
        merge(user, body, updateData)
        return success()
      }
    },
  },
  {
    url: '/mock/system/user',
    method: 'delete',
    response({ body }) {
      remove(userList, item => body.includes(item.id))
      return success()
    },
  },
]

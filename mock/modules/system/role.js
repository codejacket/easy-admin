import { roleList } from '../../data'
import { eq, toPage } from '../../utils/index'
import { success } from '../../utils/result'

export default [
  {
    url: '/mock/system/role',
    method: 'get',
    response({ query }) {
      return success(
        toPage(roleList, query, {
          name: 'like',
          status: 'eq',
          createTime: 'between',
        }),
      )
    },
  },
  {
    url: '/mock/system/role/:id',
    method: 'get',
    response({ query }) {
      return success(roleList.find(item => eq(item.id, query.id)))
    },
  },
  {
    url: '/mock/system/role',
    method: 'post',
    response({ body, headers }) {
      return success()
    },
  },
  {
    url: '/mock/system/role',
    method: 'put',
    response({ body, headers }) {
      return success()
    },
  },
  {
    url: '/mock/system/role',
    method: 'delete',
    response({ body }) {
      return success()
    },
  },
]

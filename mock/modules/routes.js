import { menuList, roleList } from '../data'
import { getUser } from '../utils/index'
import { success } from '../utils/result'

export default [
  {
    url: '/mock/routes',
    method: 'get',
    response({ headers }) {
      let user = getUser(headers)
      let menuIds = [
        ...new Set(
          roleList.filter(item => user.roles.includes(item.id)).flatMap(item => item.menus),
        ),
      ]
      return success(menuList.filter(item => menuIds.includes(item.id) && item.status === 0))
    },
  },
]

import request from '@/api'
import { crud } from '@/utils/crud'

export const { listMenu, getMenu, addMenu, updateMenu, delMenu } = crud('/system/menu', 'menu')

export function moveMenu(id, targetId, order) {
  return request({
    url: '/system/menu/move',
    method: 'get',
    params: { id, targetId, order },
  })
}

export const { listAuth, getAuth, addAuth, updateAuth, delAuth } = crud('/system/auth', 'auth')

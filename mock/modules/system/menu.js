import { merge, omit, remove } from 'lodash-es'
import { authList, menuList } from '../../data'
import { eq, getNextId, getUser, parseTime, toPage } from '../../utils/index'
import { error, success } from '../../utils/result'

export default [
  {
    url: '/mock/system/menu',
    method: 'get',
    response({ query }) {
      return success(
        toPage(menuList, query, {
          title: 'like',
          path: 'like',
        }),
      )
    },
  },
  {
    url: '/mock/system/menu/:id',
    method: 'get',
    response({ query }) {
      return success(menuList.find(item => eq(item.id, query.id)))
    },
  },
  {
    url: '/mock/system/menu',
    method: 'post',
    response({ body, headers }) {
      // 调整好的兄弟节点的顺序
      let brotherMenus = menuList
        .filter(item => eq(item.parentId, body.parentId))
        .sort((a, b) => a.order - b.order)
      let menu = {
        status: 1,
        order: brotherMenus.length + 1,
      }
      let updateData = {
        id: getNextId(menuList),
        createBy: getUser(headers).username,
        createTime: parseTime(new Date()),
      }
      merge(menu, body, updateData)
      brotherMenus.splice(Math.min(body.order - 1, brotherMenus.length), 0, menu)
      adjustOrder(brotherMenus)
      menuList.push(menu)
      updateBatch(brotherMenus)
      return success()
    },
  },
  {
    url: '/mock/system/menu',
    method: 'put',
    response({ body, headers }) {
      let menu = menuList.find(item => eq(item.id, body.id))
      let updateData = {
        updateBy: getUser(headers).username,
        updateTime: parseTime(new Date()),
      }
      merge(menu, omit(body, ['parentId']), updateData)
      if (menu.parentId !== body.parentId || menu.order !== body.order) {
        return move(body.id, body.parentId, body.order)
      }
      return success()
    },
  },
  {
    url: '/mock/system/menu',
    method: 'delete',
    response({ body }) {
      let parentIds = [
        ...new Set(
          menuList
            .filter(item => body.includes(item.id) && !body.includes(item.parentId))
            .map(item => item.parentId),
        ),
      ]
      let descendantIds = getDescendantIds(menuList, body)
      let deleteIds = [...new Set([...body, ...descendantIds])]
      remove(menuList, item => deleteIds.includes(item.id))
      parentIds.forEach(parentId => {
        let brotherMenus = menuList.filter(item => item.parentId === parentId)
        adjustOrder(brotherMenus)
        updateBatch(brotherMenus)
      })
      return success()
    },
  },
  {
    url: '/mock/system/menu/move',
    method: 'get',
    response({ query }) {
      let { id, targetId, order } = query
      return move(id, targetId, order)
    },
  },
  {
    url: '/mock/system/auth',
    method: 'get',
    response({ query }) {
      return success(
        toPage(authList, query, {
          menuId: 'eq',
        }),
      )
    },
  },
  {
    url: '/mock/system/auth/:id',
    method: 'get',
    response({ query }) {
      return success(authList.find(item => eq(item.id, query.id)))
    },
  },
  {
    url: '/mock/system/auth',
    method: 'post',
    response({ body, headers }) {
      if (body.menuId) {
        let auth = {
          status: 0,
        }
        let updateData = {
          id: getNextId(authList),
          createBy: getUser(headers).username,
          createTime: parseTime(new Date()),
        }
        merge(auth, body, updateData)
        authList.push(auth)
        return success()
      } else {
        return error('请选择菜单')
      }
    },
  },
  {
    url: '/mock/system/auth',
    method: 'put',
    response({ body, headers }) {
      if (body.menuId) {
        let auth = authList.find(item => eq(item.id, body.id))
        let updateData = {
          updateBy: getUser(headers).username,
          updateTime: parseTime(new Date()),
        }
        merge(auth, body, updateData)
        return success()
      } else {
        return error('请选择菜单')
      }
    },
  },
  {
    url: '/mock/system/auth',
    method: 'delete',
    response({ body }) {
      remove(authList, item => body.includes(item.id))
      return success()
    },
  },
]

function adjustOrder(list) {
  for (let i = 0; i < list.length; i++) {
    list[i].order = i + 1
  }
}

function updateBatch(list) {
  list.forEach(item => {
    menuList[menuList.findIndex(menu => menu.id === item.id)] = item
  })
}

function getDescendantIds(list, ids) {
  let res = []
  for (let i = 0; i < list.length; i++) {
    if (ids.includes(list[i].parentId)) {
      res.push(list[i].id)
      res.push(...getDescendantIds(list, [list[i].id]))
    }
  }
  return res
}

function move(id, targetId, order) {
  let menu = menuList.find(item => item.id === id)
  let descendantIds = getDescendantIds(menuList, [id]).concat(id)
  if (descendantIds.includes(targetId) || targetId === id) {
    return error('父级不能拖拽到自己的子级中')
  } else if (menu === null) {
    return error('菜单不存在')
  } else {
    // 需要更新的菜单
    let updateMenus = []
    // 获取新的兄弟菜单
    let newBrotherMenus = menuList
      .filter(item => item.parentId === targetId && item.id !== menu.id)
      .sort((a, b) => a.order > b.order)
    // 获取旧的兄弟菜单
    let oldBrotherMenus = menuList
      .filter(item => item.parentId === menu.parentId && item.id !== menu.id)
      .sort((a, b) => a.order > b.order)
    // 判断是否是同级拖拽
    if (menu.parentId === targetId) {
      newBrotherMenus.splice(Math.min(order - 1, newBrotherMenus.length), menu)
      adjustOrder(newBrotherMenus)
    } else {
      adjustOrder(oldBrotherMenus)
      menu.parentId = targetId
      newBrotherMenus.splice(Math.min(order - 1, newBrotherMenus.length), menu)
      adjustOrder(newBrotherMenus)
      updateMenus.push(...oldBrotherMenus)
    }
    updateMenus.push(...newBrotherMenus)
    updateBatch(updateMenus)
    return success()
  }
}

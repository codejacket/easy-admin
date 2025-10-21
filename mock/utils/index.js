import { find, isNil } from 'lodash-es'
import qs from 'qs'
import { userList } from '../data'
import { verifyToken } from './jwt'

export function dispatch(args, handlers) {
  for (let { types, method } of handlers) {
    types = types?.split?.(' ') || types
    if (
      types.length === args.length &&
      types.every((type, i) => {
        let t = Object.prototype.toString.call(args[i])
        return type === 'any' || t.slice(8, -1).toLowerCase() === type
      })
    ) {
      return method(...args)
    }
  }
}

export function treeToArray(tree) {
  let array = []
  let childrenKey = 'children'
  let idCounter = 1
  function traverse(node, parentNodes, order) {
    node.id = idCounter++
    let newNode = {
      ...node,
      parentId: parentNodes.at(-1)?.id || 0,
      order,
      hasChild: childrenKey in node,
    }
    delete newNode[childrenKey]
    array.push(newNode)
    node[childrenKey]?.forEach((child, index) => traverse(child, [...parentNodes, node], index + 1))
  }
  tree.forEach((node, index) => traverse(node, [], index + 1))
  return array
}

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

export function eq(val1, val2) {
  return `${val1}` === `${val2}`
}

export function getUser(headers) {
  let { username, nickname } = verifyToken(headers.authorization.replace('Bearer ', ''))
  return find(userList, { username, nickname })
}

export function getNextId(list) {
  return (list.length > 0 ? Math.max(...list.map(item => item.id)) : 0) + 1
}

export function filterByQuery(list, query, config) {
  if (query === undefined) return list
  return list.filter(item => {
    return Object.entries(config).every(([prop, type]) => {
      let iv = item?.[prop]
      let qv = query?.[prop]
      if (isNil(qv) || qv === '') return true
      switch (type) {
        case 'eq':
          return eq(iv, qv)
        case 'like':
          return iv.includes(qv)
        case 'between':
          return new Date(iv) >= new Date(qv[0]) && new Date(iv) <= new Date(qv[1])
        case 'in':
          return qv.includes(iv)
        default:
          if (typeof type === 'function') {
            return type(iv, qv)
          }
      }
    })
  })
}

export function toPage(list, options, config = {}) {
  let {
    currentPage = 1,
    pageSize = 10,
    isAsc = true,
    sortBy = 'createTime',
    query,
  } = qs.parse(options, { comma: true })
  let filterList = filterByQuery(list, query, config)
  return {
    total: filterList.length,
    list: filterList
      .sort((a, b) => {
        return (new Date(a[sortBy]) - new Date(b[sortBy])) * (isAsc ? 1 : -1)
      })
      .slice((currentPage - 1) * pageSize, currentPage * pageSize),
  }
}

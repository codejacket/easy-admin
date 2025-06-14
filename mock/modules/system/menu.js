const { menuList } = require(`${process.cwd()}/mock/data`)
const { getNextUniqueMin, pick } = require(`${process.cwd()}/mock/utils`)

module.exports = [{
    url: '/mock/system/menu',
    method: 'get',
    response(req) {
        let params = req.query
        let data = menuList.filter(item => {
            return Object.keys(params).every(key => {
                return item[key]?.includes(params[key])
            })
        })
        return {
            code: 200,
            msg: '操作成功',
            data: {
                list: data,
                total: data.length
            }
        }
    }
}, {
    url: '/mock/system/menu/:id',
    method: 'get',
    response(req) {
        let n = parseInt(req.params.id)
        return {
            code: 200,
            msg: '操作成功',
            data: menuList.find(item => item.id === n)
        }
    }
}, {
    url: '/mock/system/menu',
    method: 'post',
    response(req) {
        let minId = getNextUniqueMin(menuList.map(item => item.id))
        let form = { ...req.body, id: minId, createTime: new Date().getTime() }
        let keys = ['id', 'parentId', 'order', 'hasChild', 'path', 'query', 'component', 'icon', 'title', 'noCache', 'hidden', 'disabled', 'createTime']
        let item = pick(form, keys)
        menuList.push(item)
        return {
            code: 200,
            msg: '操作成功'
        }
    }
}, {
    url: '/mock/system/menu',
    method: 'delete',
    response(req) {
        let parentIds = []
        menuList.forEach((item, index) => {
            if (req.body.includes(item.id)) {
                parentIds.push(menuList.splice(index, 1)[0].parentId)
            }
        })
        // 去重
        parentIds = [...new Set(parentIds)]
        parentIds.forEach(id => {
            let childrenList = menuList.filter(item => item.parentId === id).sort((a, b) => a.order - b.order)
            childrenList.forEach((item, index) => {
                item.order = index + 1
            })
        })
        return {
            code: 200,
            msg: '操作成功'
        }
    }
}, {
    url: '/mock/system/menu',
    method: 'put',
    response(req) {
        for (let i = 0; i < menuList.length; i++) {
            if (menuList[i].id === req.body.id) {
                menuList[i] = { ...menuList[i], ...req.body }
                break
            }
        }
        return {
            code: 200,
            msg: '操作成功'
        }
    }
}, {
    url: '/mock/system/menu/move',
    method: 'get',
    response(req) {
        const { id, targetId, order } = req.params
        // 获取 id节点 的所有后代节点的id
        function getDescIds(menuList, parentId) {
            let descIds = []
            menuList.forEach(item => {
                if (item.parentId === parentId) {
                    descIds.push(item.id)
                    descIds = descIds.concat(getDescIds(menuList, item.id))
                }
            })
            return descIds
        }
        let descIds = getDescIds(menuList, id)
        if (descIds.concat(id).includes(targetId)) {
            return {
                code: 500,
                msg: '父级不能拖拽到自己的子级中'
            }
        } else {
            let item = menuList.splice(menuList.findIndex(item => item.id === id), 1)[0]
            // 找到 item 所有的兄弟节点，然后重新排序
            let itemBrothers = menuList.filter(item => item.parentId === item.parentId).sort((a, b) => a.order - b.order)
            itemBrothers.forEach((item, index) => item.order = index + 1)
            // 修改 item 的 上级菜单
            item.parentId = targetId
            // 找到 targetId 的所有子节点，并排序好，然后插入到它的子节点中
            let targetChildrenList = menuList.filter(item => item.parentId === targetId).sort((a, b) => a.order - b.order)
            targetChildrenList.splice(order - 1, 0, item)
            // 插入子节点后，重新排序
            targetChildrenList.forEach((item, index) => item.order = index + 1)
            // 最后插入到 menuList 中
            menuList.push(item)
            return {
                code: 200,
                msg: '操作成功'
            }
        }
    }
}]
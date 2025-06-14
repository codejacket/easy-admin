// 数组转树
export function arrayToTree(array, func, config) {
    let tree = []
    let map = {}
    const {
        idKey = 'id',
        parentIdKey = 'parentId',
        childrenKey = 'children',
        orderKey = 'order',
        hasChildKey = 'hasChild'
    } = config ?? {}

    // 1 创建所有节点的映射
    for (const item of array) {
        map[item[idKey]] = { ...item }
    }

    // 2 构建树结构
    for (const id in map) {
        const node = map[id]
        
        // 2.1 处理父节点
        if (node[parentIdKey] && map[node[parentIdKey]]) {
            const parent = map[node[parentIdKey]]
            parent[childrenKey] ||= []
            parent[childrenKey].push(node)
        } else {
            tree.push(node)
        }
    }

    // 3 排序和转换
    function processNode(node, parentNodes = []) {
        // 3.1 排序子节点
        if (node[childrenKey]) {
            node[childrenKey].sort((a, b) => (a[orderKey] || 0) - (b[orderKey] || 0))
            // 递归处理子节点
            node[childrenKey] = node[childrenKey].map(child => 
                processNode(child, [...parentNodes, node])
            )
        }
        
        // 3.2 处理hasChildKey
        if (hasChildKey && node[hasChildKey] && !node[childrenKey]) {
            node[childrenKey] = []
        }
        
        // 3.3 应用转换函数
        if (typeof func === 'function') {
            return func(node, parentNodes)
        }
        
        return node
    }

    tree = tree.map(node => processNode(node, []))
    tree.sort((a, b) => (a[orderKey] || 0) - (b[orderKey] || 0))

    return tree
}

// 树转数组
export function treeToArray(tree, func) {
    let array = []
    let childrenKey = 'children'
    function traverse(node, parentNodes) {
        let newNode = { ...node }
        delete newNode[childrenKey]
        let newNodeMap = func ? func?.(newNode, [...parentNodes]) : newNode
        array.push(newNodeMap)
        node[childrenKey]?.forEach(child => traverse(child, [...parentNodes, node]))
    }
    tree.forEach(node => traverse(node, []))
    return array
}

// 遍历树
export function traverseTree(tree, func) {
    tree.forEach(node => {
        func(node)
        if (node.children) {
            traverseTree(node.children, func)
        }
    })
}

// 映射树
export function mapTree(tree, func) {
    return tree.map(node => {
        let newNode = func(node)
        if (newNode.children && Array.isArray(newNode.children)) {
            newNode.children = mapTree(node.children, func)
        }
        return newNode
    })
}

// 过滤树
export function filterTree(tree, func) {
    return tree.filter(item => func(item) && (item.children = filterTree(item.children, func)))
}

// 遍历树并累积结果
export function reduceTree(tree, func, acc) {
    tree.forEach(node => {
        let res = func(acc, node)
        if (res !== false && Array.isArray(node.children)) {
            reduceTree(node.children, func, acc)
        }
    })
    return acc
}

// 查找第一个叶子节点
export function findFirstLeafNode(tree) {
    for (const node of tree) {
        if (node.children && node.children.length > 0) {
            const childLeaf = findFirstLeafNode(node.children)
            if (childLeaf) {
                return childLeaf
            }
        } else {
            return node
        }
    }
}
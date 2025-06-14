const { menuList } = require(`${process.cwd()}/mock/data`)

module.exports = [{
    url: '/mock/routes',
    method: 'get',
    response(req) {
        return {
            code: 200,
            msg: '操作成功',
            data: menuList.filter(item => !item.disabled)
        }
    }
}]
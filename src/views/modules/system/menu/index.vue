<template>
  <div class="app-card m20">
    <!-- 查询条件 -->
    <query-form v-model="query.form" :show="query.show" @search="getList">
      <el-form-item label="菜单类型" prop="type">
        <el-select v-model="query.form.type" placeholder="请选择菜单类型" clearable>
          <el-option label="目录" value="catalog" />
          <el-option label="菜单" value="menu" />
          <el-option label="内嵌" value="iframe" />
          <el-option label="外链" value="link" />
          <el-option label="按钮" value="button" />
        </el-select>
      </el-form-item>
      <el-form-item label="菜单名称" prop="title">
        <el-input v-model="query.form.title" placeholder="请输入菜单名称" clearable @keyup.enter="getList" />
      </el-form-item>
      <el-form-item label="路由名称" prop="path">
        <el-input v-model="query.form.path" placeholder="请输入路由名称" clearable @keyup.enter="getList" />
      </el-form-item>
    </query-form>

    <div class="flex-column g14 p14">
      <div class="flex">
        <easy-button type="primary" i="plus" t="common.add" size="small" plain @click="handleAdd()" />
        <easy-button type="danger" i="delete" t="common.delete" size="small" plain @click="handleDelete(table.selections)" />
        <easy-button type="info" i="sort" :t="table.expandRowKeys.length ? '折叠' : '展开'" size="small" plain @click="toggleExpandAll" />
        <table-toolbar v-model:show-search="query.show" v-model:columns="table.columns" @refresh="getList" />
      </div>
      <!-- 菜单表格 -->
      <easy-table v-loading="table.loading" :data="table.tree" :drag-options="table.dragOptions"
        row-key="id" v-model:expand-row-keys="table.expandRowKeys"
        v-model:columns="table.columns"
        @selection-change="handleSelect">
        <el-table-column type="selection" width="40" />
        <el-table-column prop="title" label="菜单标题" width="200" align="left">
          <template #default="{ row }">
            <svg-icon :icon="row.icon" style="margin-right: 8px" />
            <span :style="{ opacity: row.type === 'button' ? 0.6 : 1 }">{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="菜单类型" align="center" width="80">
          <template #default="{ row: { type } }">
            <el-tag v-if="type === 'catalog'" type="primary">目录</el-tag>
            <el-tag v-else-if="type === 'menu'" type="info">菜单</el-tag>
            <el-tag v-else-if="type === 'iframe'" type="success">内嵌</el-tag>
            <el-tag v-else-if="type === 'link'" type="warning">外链</el-tag>
            <el-tag v-else type="info" color="transparent">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="order" label="排序" width="80" hidden />
        <el-table-column prop="path" label="路由名称" width="160" />
        <el-table-column prop="component" label="组件路径" align="left" />
        <el-table-column prop="auth" label="权限标识" width="160" hidden />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row: { disabled } }">
            <el-tag :type="disabled ? 'danger' : 'success'">
              {{ disabled ? '停用' : '正常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建者" width="160" hidden />
        <el-table-column prop="createTime" label="创建时间" :formatter="row => $parseTime(row.createTime)" width="180" hidden />
        <el-table-column prop="updateBy" label="更新者" width="160" hidden />
        <el-table-column prop="updateTime" label="更新时间" :formatter="row => $parseTime(row.updateTime)" width="180" hidden />
        <el-table-column prop="remark" label="备注" hidden />
        <el-table-column :label="$t('common.operation')" width="240" fixed="right">
          <template #default="{ row }">
            <easy-button type="primary" i="drag" class="handle-drag" :title="$t('common.drag')" v-if="query.noParams" link />
            <easy-button type="primary" i="plus" t="common.add" link @click="handleAdd(row)" />
            <easy-button type="primary" i="edit" t="common.update" link @click="handleUpdate(row)" />
            <easy-button type="primary" i="delete" t="common.delete" link @click="handleDelete([row])" />
          </template>
        </el-table-column>
      </easy-table>
    </div>
    <!-- 添加或修改菜单对话框 -->
    <easy-dialog v-model="dialog.open" :loading="dialog.loading" :title="`${dialog.isEdit? '修改' : '添加'}菜单`" width="680px" 
      :confirm="submitForm" @closed="$refs['form']?.resetFields?.()">
      <easy-form ref="form" v-model="dialog.form" :rules="dialog.rules">
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="dialog.form.type">
            <el-radio-button value="catalog">目录</el-radio-button>
            <el-radio-button value="menu">菜单</el-radio-button>
            <el-radio-button value="iframe">内嵌</el-radio-button>
            <el-radio-button value="link">外链</el-radio-button>
            <el-radio-button value="button">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上级目录" prop="parentId">
          <el-tree-select v-model="dialog.form.parentId" :data="dialog.catalog" placeholder="选择上级目录"
            :props="{ value: 'id', label: 'title', class: () => 'el-tree-select-node' }"
            :filter-node-method="(val, node) => node.type !== 'button'" check-strictly filterable
            highlight-current>
            <template #default="{ data }">
              {{ data.title }}
              <span v-if="data.hasChild" style="opacity: 0.5">
                ({{ data.children?.length }})
              </span>
            </template>
          </el-tree-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="dialog.form.title" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <IconSelect v-model="dialog.form.icon" />
        </el-form-item>
        <el-form-item label="路由名称" prop="path" v-if="dialog.form.type !== 'button'">
          <el-input v-model="dialog.form.path" placeholder="请输入路由名称" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component" v-if="dialog.form.type !== 'button'">
          <el-input v-model="dialog.form.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="权限标识" prop="auth" v-if="dialog.form.type === 'button'">
          <el-input v-model="dialog.form.auth" placeholder="请输入权限标识" />
        </el-form-item>
        <div style="display:flex;flex-wrap:wrap">
          <el-form-item label="页面动画" prop="transition" style="width: 50%" v-if="['menu', 'iframe'].includes(dialog.form.type)">
            <el-select v-model="dialog.form.transition" placeholder="请选择页面动画" style="width:160px">
              <el-option v-for="(val, key) in $tm('settings.system.children.pageAnimateType.options')" :key="key" :label="val"
                :value="key" />
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="order" style="width: 50%">
            <el-input-number v-model="dialog.form.order" :min="1" />
          </el-form-item>
          <el-form-item prop="noCache" style="width: 50%" v-if="['menu', 'iframe'].includes(dialog.form.type)">
            <template #label>
              <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top" :show-after="300">
                是否缓存
              </el-tooltip>
            </template>
            <el-radio-group v-model="dialog.form.noCache" style="margin-left: 10px">
              <el-radio :value="true">缓存</el-radio>
              <el-radio :value="false">不缓存</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="hidden" style="width: 50%" v-if="dialog.form.type !== 'button'">
            <template #label>
              <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top" :show-after="300">
                是否隐藏
              </el-tooltip>
            </template>
            <el-radio-group v-model="dialog.form.hidden" style="margin-left: 10px">
              <el-radio :value="true">隐藏</el-radio>
              <el-radio :value="false">不隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="disabled" style="width: 50%">
            <template #label>
              <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top" :show-after="300">
                菜单状态
              </el-tooltip>
            </template>
            <el-radio-group v-model="dialog.form.disabled" style="margin-left: 10px">
              <el-radio :value="false">正常</el-radio>
              <el-radio :value="true">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </easy-form>
    </easy-dialog>
  </div>
</template>

<i18n locale="en" src="./locales/en.json"></i18n>
<i18n locale="zh" src="./locales/zh.json"></i18n>

<script>
import { list, get, add, del, update, move } from '@api/system/menu'
import { arrayToTree } from '@/utils/tree'

import IconSelect from '@/components/IconSelect'

export default {
  name: 'Menu',
  components: { IconSelect },
  data() {
    return {
      // 搜索栏
      query: {
        show: true,
        noParams: true,
        form: {
          title: '',
          path: '',
          type: ''
        }
      },
      // 表格
      table: {
        // 遮罩层
        loading: true,
        // 列设置
        columns: [],
        // 展开的行
        expandRowKeys: [],
        // 选中的数据
        selections: [],
        // 菜单树
        tree: [],
        // 拖拽选项
        dragOptions: {
          animation: 150,
          handle: '.handle-drag',
          disabled: false,
          onEnd: this.onEnd
        }
      },
      // 弹窗
      dialog: {
        // 是否显示弹出层
        open: false,
        // 是否弹窗加载中
        loading: false,
        // 是否为编辑
        isEdit: false,
        // 目录树
        catalog: [],
        // 表单参数
        form: {
          id: undefined,
          parentId: 0,
          hasChild: false,
          path: '',
          component: '',
          auth: '',
          transition: '',
          type: 'catalog',
          order: 0,
          query: null,
          icon: '',
          title: '',
          noCache: false,
          hidden: false,
          disabled: false
        },
        // 表单校验
        rules: {
          title: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
          path: [{ required: true, message: "路由地址不能为空", trigger: "blur" }]
        }
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询菜单树 */
    async getList() {
      this.table.loading = true
      const { data } = await list(this.query.form)
      // 搜索条件有值时，则 this.table.tree = res.data
      this.query.noParams = Object.values(this.query.form).every(val => val === '' || val === null || val === undefined)
      this.table.tree = this.query.noParams ? arrayToTree(data.list) : data.list
      this.table.loading = false
    },
    /** 拖拽按钮操作 */
    async onEnd({ oldIndex, newIndex }) {
      if (oldIndex === newIndex) return
      let oldNodeIndex, oldParentNode, oldNode
      let newNodeIndex, newParentNode
      this.traverse(this.table.tree, (node, index, parentNode) => {
        if (index === oldIndex) {
          oldNode = node
          oldParentNode = parentNode
          oldNodeIndex = this.getChildren(oldParentNode).findIndex(item => item.id === node.id)
        } else if (index === newIndex) {
          newParentNode = parentNode
          newNodeIndex = this.getChildren(newParentNode).findIndex(item => item.id === node.id)
        }
      })
      let oldNodeChildren = [oldNode.id]
      if (oldNode.children) this.traverse(oldNode, (node) => oldNodeChildren.push(node.id))
      if (oldNodeChildren.includes(newParentNode.id)) {
        this.$modal.message.error('父级不能拖拽到自己的子级中')
      } else if (oldNode.type === 'button' && newParentNode.type !== 'menu') {
        this.$modal.message.error('按钮只能放在菜单中')
      } else {
        oldNode = this.getChildren(oldParentNode).splice(oldNodeIndex, 1)[0]
        let index = newNodeIndex + Number(oldIndex < newIndex && oldParentNode.id !== newParentNode.id)
        this.getChildren(newParentNode).splice(index, 0, oldNode)
        let sameLevel = oldParentNode.id === newParentNode.id
        let target = sameLevel ? '同层级' : newParentNode.title ? `【${newParentNode.title}】子目录中` : '根目录中'
        try {
          await this.$modal.confirm.warning(`确定将【${oldNode.title}】移动到${target}的第 ${index + 1} 个位置吗？`)
          await move(oldNode.id, newParentNode.id, index + 1)
        } catch {
          this.getList()
        }
      }
    },
    traverse(tree, func) {
      let index = 0
      let traverse = (tree, func) => {
        for (let node of this.getChildren(tree) || []) {
          func(node, index++, tree)
          if (node.children) {
            traverse(node, func)
          }
        }
      }
      traverse(tree, func)
    },
    getChildren(parent) {
      return Array.isArray(parent) ? parent : parent.children
    },
    handleSelect(selections) {
      this.table.selections = selections
    },
    // 展开/折叠 按钮操作
    toggleExpandAll() {
      if (this.table.expandRowKeys.length) {
        // 折叠全部
        this.table.expandRowKeys = []
      } else {
        // 展开全部
        this.traverse(this.table.tree, (node) => {
          if (node.children) {
            this.table.expandRowKeys.push(`${node.id}`)
          }
        })
      }
    },
    // 新增按钮操作
    async handleAdd(row) {
      if (!row || row.type !== 'button') {
        this.dialog.loading = true
        this.dialog.isEdit = false
        this.dialog.open = true
        this.$refs['form']?.resetFields()
        const { data } = await list()
        this.dialog.catalog = [{ id: 0, title: '根目录', hasChild: true, children: arrayToTree(data.list) }]
        this.dialog.form.type = 'catalog'
        this.dialog.form.parentId = row ? row.id : 0
        this.dialog.loading = false
      } else {
        this.$modal.message.error('按钮不允许创建子菜单')
      }
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.dialog.loading = true
      this.dialog.isEdit = true
      this.dialog.open = true
      const res = await list()
      this.dialog.catalog = [{ id: 0, title: '根目录', hasChild: true, children: arrayToTree(res.data.list) }]
      const { data } = await get(row.id)
      this.dialog.form = data
      this.dialog.loading = false
    },
    /** 删除按钮操作 */
    async handleDelete(rows) {
      if (rows.length === 0) return
      try {
        await this.$modal.confirm.warning(`是否确认删除"${rows.map(({ title }) => title)}"?`)
        await del(rows.map(({ id }) => id))
        await this.getList()
        this.$modal.message.success(this.$t('message.deleteSuccess'))
      } catch {}
    },
    // 提交按钮
    submitForm() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          let action = this.dialog.isEdit ? 'update' : 'add'
          let method = this.dialog.isEdit? update : add
          await method(this.dialog.form)
          this.$modal.message.success(this.$t(`message.${action}Success`))
          this.getList()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
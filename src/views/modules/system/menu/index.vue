<script name="Menu" setup>
import IconPicker from '@/components/IconPicker'
import { arrayToTree, reduceTree } from '@/utils/tree'
import { isExternal } from '@/utils/validate'
import { addMenu, delMenu, getMenu, listMenu, moveMenu, updateMenu } from '@api/system/menu'
import dict from '@plugins/dict'
import modal from '@plugins/modal'
import { isNil } from 'lodash-es'
import { useI18n } from 'vue-i18n'
import AuthDialog from './components/AuthDialog'
import QueryEditer from './components/QueryEditer'

const { t } = useI18n()
const noParams = ref(true)
const options = dict.all(['status', 'menu_type'])
const catalog = ref([])
const tablePro = useTemplateRef('tablePro')
const formType = ref('catalog')
const menuTypeMap = {
  'menu': 'primary',
  'catalog': 'info',
  'link': 'warning',
  'iframe': 'success',
}

const config = reactive({
  api: {
    async list(params) {
      const { data } = await listMenu({ ...params, pageSize: 10000 })
      noParams.value = Object.values(params.query).every(val => isNil(val) || val === '')
      return {
        data: {
          list: noParams.value ? arrayToTree(data.list) : data.list,
          total: noParams.value ? 0 : data.total,
        },
      }
    },
    get: getMenu,
    add: addMenu,
    update: updateMenu,
    del: delMenu,
  },
  query: {
    data: {
      title: '',
      path: '',
    },
  },
  pagination: {
    hideOnSinglePage: true,
  },
  table: {
    // 展开的行
    expandRowKeys: [],
    // 拖拽选项
    dragOptions: {
      animation: 150,
      handle: '.handle-drag',
      disabled: false,
      onEnd,
    },
  },
  dialog: {
    height: [0, 600],
    closed() {
      formType.value = 'catalog'
    },
    async openedDialog(row) {
      const { data } = await listMenu({
        pageSize: 10000,
        currentPage: 1,
      })
      catalog.value = [
        {
          id: 0,
          title: '根目录',
          hasChild: true,
          children: arrayToTree(data.list),
        },
      ]
      tablePro.value.form.data.parentId = row ? row.id : 0
      formType.value = getType(row ?? {})
    },
  },
  form: {
    data: {
      id: undefined,
      parentId: 0,
      hasChild: false,
      path: '',
      component: '',
      transition: '',
      order: 0,
      query: null,
      icon: '',
      title: '',
      affixTab: false,
      noCache: false,
      hidden: false,
      status: false,
    },
    // 表单校验
    rules: {
      title: [{ required: true, message: t('rules.title'), trigger: 'blur' }],
      path: [{ required: true, message: t('rules.path'), trigger: 'blur' }],
      component: [{ required: true, message: t('rules.component'), trigger: 'blur' }],
    },
  },
})

const authDialog = reactive({
  open: false,
  data: {},
})

async function onEnd({ oldIndex, newIndex }) {
  if (oldIndex === newIndex) return
  let oldNode, oldRelativeIndex, oldNodeParent, newRelativeIndex, newNodeParent

  reduceTree(
    tablePro.value.table.data,
    (acc, node, index, parentNode) => {
      if (acc.index === oldIndex) {
        oldNode = node
        oldRelativeIndex = index
        oldNodeParent = parentNode
      } else if (acc.index === newIndex) {
        newRelativeIndex = index
        newNodeParent = parentNode
      }
      acc.index++
    },
    { index: 0 },
  )

  let oldNodeDescendants = [oldNode.id]
  if (oldNode.children) {
    reduceTree(oldNode.children, (acc, node) => oldNodeDescendants.push(node.id))
  }
  if (oldNodeDescendants.includes(newNodeParent.id)) {
    modal.message.error('父级不能拖拽到自己的子级中')
  } else {
    oldNode = oldNodeParent.splice(oldRelativeIndex, 1)[0]
    let index = newRelativeIndex
    if (oldIndex < newIndex && oldNodeParent.id !== newNodeParent.id) index++
    newNodeParent.splice(index, 0, oldNode)
    let target =
      oldNodeParent.id === newNodeParent.id
        ? '同层级'
        : newParentNode.title
          ? `【${newParentNode.title}】子目录中`
          : '根目录中'

    try {
      await modal.confirm.warning(
        `确定将【${oldNode.title}】移动到${target}的第 ${index + 1} 个位置吗？`,
      )
      await moveMenu(oldNode.id, newNodeParent.id, index + 1)
    } catch {
      tablePro.value.getList()
    }
  }
}

// 展开/折叠 按钮操作
function toggleExpandAll(table) {
  if (table.expandRowKeys.length) {
    // 折叠全部
    table.expandRowKeys = []
  } else {
    // 展开全部
    reduceTree(table.data, (acc, node) => {
      if (node.children) {
        table.expandRowKeys.push(`${node.id}`)
      }
    })
  }
}

function getType(menu) {
  if (menu.hasChild) {
    return 'catalog'
  } else if (isExternal(menu.path)) {
    return 'link'
  } else if (isExternal(menu.component)) {
    return 'iframe'
  } else {
    return 'menu'
  }
}

function includes(...types) {
  return types.includes(formType.value)
}

function openAuthDialog(row) {
  authDialog.open = true
  authDialog.data = row
}

watch(formType, val => {
  tablePro.value.form.data.hasChild = val === 'catalog'
})
</script>

<template>
  <div class="m20px app-card">
    <easy-table-pro :config="config" ref="tablePro">
      <template #query="{ query, getList }">
        <el-form-item label="菜单名称" prop="title">
          <el-input
            v-model="query.data.title"
            placeholder="请输入菜单名称"
            clearable
            @keyup.enter="getList"
          />
        </el-form-item>
        <el-form-item label="路由名称" prop="path">
          <el-input
            v-model="query.data.path"
            placeholder="请输入路由名称"
            clearable
            @keyup.enter="getList"
          />
        </el-form-item>
      </template>
      <template #toolbar="{ query, table, getList, openDialog, deleteItems }">
        <easy-button
          type="primary"
          i="plus"
          t="common.add"
          size="small"
          plain
          @click="openDialog"
        />
        <easy-button
          type="danger"
          i="delete"
          t="common.delete"
          size="small"
          plain
          @click="deleteItems(table.selections)"
        />
        <easy-button
          :t="table.expandRowKeys.length ? 'common.collapse' : 'common.expand'"
          type="info"
          i="sort"
          size="small"
          plain
          @click="toggleExpandAll(table)"
        />
        <table-toolbar
          v-model:show-search="query.show"
          v-model:columns="table.columns"
          :refresh="getList"
        />
      </template>
      <template #table="{ openDialog, deleteItems }">
        <el-table-column width="40" type="selection" />
        <el-table-column width="200" prop="title" label="菜单标题" align="left">
          <template #default="{ row }">
            <svg-icon class="mr8px" :icon="row.icon" />
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column width="80" label="菜单类型">
          <template #default="{ row }">
            <el-tag :type="menuTypeMap[getType(row)]">
              {{ options['menu_type'].find?.(item => item.value === getType(row))?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column width="80" hidden prop="order" label="排序" />
        <el-table-column width="160" prop="path" label="路由名称" />
        <el-table-column prop="component" label="组件路径" align="left" />
        <el-table-column width="100" label="权限">
          <template #default="{ row }">
            <easy-button v-if="getType(row) === 'menu'" size="small" @click="openAuthDialog(row)">
              查看权限
            </easy-button>
          </template>
        </el-table-column>
        <el-table-column width="100" prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="['success', 'danger'][row.status]">
              {{ options['status'].find?.(option => `${option.value}` === `${row.status}`)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column width="160" hidden prop="createBy" label="创建者" />
        <el-table-column
          width="180"
          hidden
          :formatter="row => $parseTime(row.createTime)"
          prop="createTime"
          label="创建时间"
        />
        <el-table-column width="160" hidden prop="updateBy" label="更新者" />
        <el-table-column
          width="180"
          hidden
          :formatter="row => $parseTime(row.updateTime)"
          prop="updateTime"
          label="更新时间"
        />
        <el-table-column hidden prop="remark" label="备注" />
        <el-table-column width="270" :label="$t('common.operation')" fixed="right">
          <template #default="{ row }">
            <easy-button
              class="handle-drag"
              v-if="noParams"
              :title="$t('common.drag')"
              type="primary"
              i="drag"
              link
            />
            <easy-button
              :disabled="!row.hasChild"
              type="primary"
              i="plus"
              t="common.add"
              link
              @click="openDialog()"
            />
            <easy-button type="primary" i="edit" t="common.update" link @click="openDialog(row)" />
            <easy-button
              type="primary"
              i="delete"
              t="common.delete"
              link
              @click="deleteItems(row)"
            />
          </template>
        </el-table-column>
      </template>
      <template #form="{ form }">
        <el-form-item label="菜单类型">
          <el-radio-group v-model="formType">
            <el-radio-button
              v-for="{ value, label } in options['menu_type']"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上级目录" prop="parentId">
          <el-tree-select
            v-model="form.data.parentId"
            :data="catalog"
            :props="{ value: 'id', label: 'title', class: () => 'el-tree-select-node' }"
            placeholder="选择上级目录"
            check-strictly
            filterable
            highlight-current
          >
            <template #default="{ data }">
              {{ data.title }}
              <span class="opacity-50" v-if="data.hasChild"> ({{ data.children?.length }}) </span>
            </template>
          </el-tree-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="form.data.title" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <IconPicker v-model="form.data.icon" />
        </el-form-item>
        <el-form-item label="路由名称" prop="path">
          <el-input v-model="form.data.path" placeholder="请输入路由名称" />
        </el-form-item>
        <el-form-item label="路由参数" prop="query">
          <QueryEditer v-model="form.data.query" />
        </el-form-item>
        <el-form-item v-if="includes('menu', 'iframe')" label="组件路径" prop="component">
          <el-input v-model="form.data.component" placeholder="请输入组件路径" />
        </el-form-item>
        <div class="flex flex-wrap">
          <el-form-item class="w-50%" label="页面动画" prop="transition">
            <el-select class="w-160px" v-model="form.data.transition" placeholder="请选择页面动画">
              <el-option
                v-for="(val, key) in $tm('settings.system.children.pageAnimateType.options')"
                :key="key"
                :label="val"
                :value="key"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="w-50%" label="排序" prop="order">
            <el-input-number v-model="form.data.order" :min="1" />
          </el-form-item>
          <el-form-item class="w-50%" v-if="includes('menu', 'iframe')" prop="affixTab">
            <template #label>固定标签</template>
            <el-radio-group v-model="form.data.affixTab">
              <el-radio :value="true">固定</el-radio>
              <el-radio :value="false">不固定</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="w-50%" v-if="includes('menu', 'iframe')" prop="noCache">
            <template #label>
              <el-tooltip
                :show-after="300"
                content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
                placement="top"
              >
                缓存路由
              </el-tooltip>
            </template>
            <el-radio-group v-model="form.data.noCache">
              <el-radio :value="true">缓存</el-radio>
              <el-radio :value="false">不缓存</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="w-50%" prop="hidden">
            <template #label>
              <el-tooltip
                :show-after="300"
                content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                placement="top"
              >
                是否隐藏
              </el-tooltip>
            </template>
            <el-radio-group v-model="form.data.hidden">
              <el-radio :value="true">隐藏</el-radio>
              <el-radio :value="false">不隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="w-50%" prop="status">
            <template #label>
              <el-tooltip
                :show-after="300"
                content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                placement="top"
              >
                菜单状态
              </el-tooltip>
            </template>
            <el-radio-group v-model="form.data.status">
              <el-radio :value="false">正常</el-radio>
              <el-radio :value="true">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </template>
    </easy-table-pro>
    <AuthDialog v-model="authDialog.open" :data="authDialog.data" />
  </div>
</template>

<i18n src="./locales/en.json" locale="en" />
<i18n src="./locales/zh-CN.json" locale="zh-CN" />

<style lang="scss" scoped></style>

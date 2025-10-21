<script name="TableToolbar" setup>
import { VueDraggable } from 'vue-draggable-plus'

const showSearch = defineModel('showSearch', { type: Boolean, default: undefined })
const columns = defineModel('columns', { type: Array })
const props = defineProps({
  type: {
    type: String,
    default: '',
  },
  plain: {
    type: Boolean,
    default: false,
  },
  round: {
    type: Boolean,
    default: true,
  },
  print: {
    type: Function,
  },
  refresh: {
    type: Function,
  },
})

const buttonRef = useTemplateRef('buttonRef')
</script>

<template>
  <el-button-group class="table-toolbar">
    <!-- 搜索 -->
    <el-tooltip
      :hide-after="0"
      v-if="showSearch !== undefined"
      :content="$t(showSearch ? 'common.hiddenSearchBar' : 'common.showSearchBar')"
      placement="top"
      effect="light"
    >
      <easy-button
        :i="`zoom-${showSearch ? 'out' : 'in'}`"
        :type="type"
        :plain="plain"
        :round="round"
        @click="showSearch = !showSearch"
      />
    </el-tooltip>
    <!-- 打印 -->
    <el-tooltip v-if="print" :content="$t('common.print')" placement="top" effect="light">
      <easy-button :type="type" :plain="plain" :round="round" i="printer" @click="print" />
    </el-tooltip>
    <!-- 列设置 -->
    <el-tooltip
      v-if="columns !== undefined"
      :content="$t('common.columnSetting')"
      placement="top"
      effect="light"
    >
      <easy-button :type="type" :plain="plain" :round="round" ref="buttonRef" i="filter">
        <el-popover
          :hide-after="0"
          :popper-style="{ padding: '8px' }"
          :virtual-ref="buttonRef"
          ref="popoverRef"
          trigger="click"
          virtual-triggering
        >
          <el-scrollbar max-height="320px">
            <VueDraggable
              ghostClass="ghost"
              v-model="columns"
              :animation="150"
              handle=".handle-drag"
            >
              <template v-for="column in columns">
                <el-checkbox
                  v-show="column.label"
                  :modelValue="!column.hidden && column.hidden !== ''"
                  @change="column.hidden = !column.hidden && column.hidden !== ''"
                >
                  <svg-icon class="handle-drag" icon="drag" />
                  <span class="text-ellipsis">{{ column.label }}</span>
                </el-checkbox>
              </template>
            </VueDraggable>
          </el-scrollbar>
        </el-popover>
      </easy-button>
    </el-tooltip>
    <!-- 刷新 -->
    <el-tooltip v-if="refresh" :content="$t('common.refresh')" placement="top" effect="light">
      <easy-button
        v-click-rotate
        v-prevent-reclick="500"
        :type="type"
        :plain="plain"
        :round="round"
        i="refresh"
        @click="refresh"
      />
    </el-tooltip>
  </el-button-group>
</template>

<style lang="scss" scoped>
.table-toolbar {
  margin-left: auto;

  .el-button {
    width: 36px;
    height: 24px;
  }
}

.el-checkbox {
  box-sizing: border-box;
  width: 100%;
  padding-left: 10px;
  margin-right: 0;
  overflow: hidden;
  border-radius: 2px;

  :deep(.el-checkbox__label) {
    display: flex;
    gap: 6px;
    overflow: hidden;

    svg {
      flex-shrink: 0;
    }
  }

  &:hover {
    background: var(--el-color-info-light-9);
  }

  &.is-checked:hover {
    background: var(--el-color-primary-light-9);
  }
}
</style>

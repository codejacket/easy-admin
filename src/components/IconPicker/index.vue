<script name="IconPicker" setup>
import { listIcons } from '@iconify/vue'
import axios from 'axios'
import { chunk } from 'lodash-es'
import { useRequest, useVirtualList } from 'vue-hooks-plus'

// 接口地址：https://api.iconify.design
const iconifyApi = axios.create({
  baseURL: 'https://api.iconify.design',
  timeout: 10000,
})

const modelValue = defineModel()
const props = defineProps({
  wrapOptions: {
    type: Object,
    default: () => ({
      width: 440,
      height: 268,
      gap: 8,
      cols: 10,
    }),
  },
})

const query = reactive({
  prefix: 'icons',
  search: '',
})

// prettier-ignore
const prefixOptions = [{
  value: 'icons',
  label: 'Icons',
}, {
  value: 'ep',
  label: 'Element Plus',
}, {
  value: 'ant-design',
  label: 'Ant Design',
}, {
  value: 'icon-park-outline',
  label: 'Icon Park Outline',
}, {
  value: 'uil',
  label: 'UnoCSS',
}, {
  value: 'line-md',
  label: 'Material Line Icons',
}]

const { data, loading } = useRequest(() => getIconList(query.prefix), { refreshDeps: true })

const scrollRef = useTemplateRef('scrollRef')

const list = computed(() => {
  scrollRef.value?.setScrollTop(0)
  if (data.value) {
    return chunk(
      [...new Set(data.value.filter?.(item => item.includes(query.search)))],
      props.wrapOptions.cols,
    )
  } else {
    return []
  }
})

const popperStyle = computed(() => {
  return {
    width: `${props.wrapOptions.width + 40}px`,
    height: `${props.wrapOptions.height + 72}px`,
  }
})

const iconSize = computed(() => {
  // prettier-ignore
  return (props.wrapOptions.width + props.wrapOptions.gap) / props.wrapOptions.cols - props.wrapOptions.gap
})

const rowStyle = computed(() => {
  return {
    height: `${iconSize.value + props.wrapOptions.gap}px`,
    gap: `${props.wrapOptions.gap}px`,
  }
})

const [virtualList, wrapRef] = useVirtualList(list, {
  wrapperTarget: () => scrollRef.value?.wrapRef?.querySelector?.('.el-scrollbar__view'),
  itemHeight: iconSize.value + props.wrapOptions.gap,
  overscan: 10,
})

watch(() => scrollRef.value?.wrapRef, wrapRef.ref)

async function getIconList(prefix) {
  if (prefix === 'icons' || !prefix) {
    return listIcons().filter(item => item.startsWith('icons:'))
  }
  const {
    data: { categories, uncategorized },
  } = await iconifyApi({
    url: '/collection',
    params: { prefix },
  })
  if (categories) {
    return Object.values(categories)
      .flat()
      .map(item => `${prefix}:${item}`)
  } else if (uncategorized) {
    return uncategorized.map(item => `${prefix}:${item}`)
  }
}

function pickIcon(icon) {
  modelValue.value = icon
}

function reset() {
  query.search = ''
  query.prefix = 'icons'
}
</script>

<template>
  <el-popover
    :hide-after="0"
    popper-class="icon-picker-popover"
    :popper-style="popperStyle"
    trigger="click"
    @show="reset"
  >
    <template #reference>
      <el-input v-bind="$attrs" :modelValue="modelValue" placeholder="Please Select Icon" readonly>
        <template v-if="modelValue" #prefix>
          <svg-icon :icon="modelValue" color="var(--el-text-color-regular)" />
        </template>
      </el-input>
    </template>
    <div class="w-full h-full box-border flex flex-col">
      <el-input v-model="query.search" placeholder="请输入图标名称" clearable>
        <template #suffix>
          <svg-icon icon="search" />
        </template>
        <template #append>
          <el-select
            class="w-120px"
            v-model="query.prefix"
            :teleported="false"
            placeholder="请选择图标集合"
          >
            <el-option
              v-for="option in prefixOptions"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            />
          </el-select>
        </template>
      </el-input>
      <el-scrollbar
        v-loading="loading"
        ref="scrollRef"
        @scroll="wrapRef.onScroll({ preventDefault() {} })"
      >
        <div
          class="flex overflow-hidden"
          v-for="item in virtualList"
          :style="rowStyle"
          :key="item.index"
        >
          <div
            :class="['icon-item', { 'active': modelValue === icon }]"
            v-for="icon in item.data"
            :style="{ width: `${iconSize}px`, height: `${iconSize}px` }"
            :title="icon"
            @click="pickIcon(icon)"
          >
            <svg-icon :icon="icon" />
          </div>
        </div>
      </el-scrollbar>
    </div>
  </el-popover>
</template>

<style lang="scss">
.icon-picker-popover {
  padding: 10px !important;

  .el-input {
    padding: 10px;

    .el-input__wrapper {
      background: transparent;
    }

    svg {
      color: var(--el-border-color-hover);
    }
  }

  .icon-item {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    border: 1px solid var(--el-border-color);
    border-radius: 2px;
    transition: var(--el-transition-box-shadow);

    svg {
      width: 75%;
      height: 75%;
    }

    &:hover {
      background: var(--el-color-primary-light-9);
      border-color: var(--el-color-primary);
      box-shadow: 0 0 3px var(--el-color-primary-light-5);

      svg {
        color: var(--el-color-primary);
      }
    }

    &.active {
      background: var(--el-color-primary-light-9);
      border-color: var(--el-color-primary);

      svg {
        color: var(--el-color-primary);
      }
    }
  }

  .el-scrollbar {
    padding: 0 10px;

    .el-scrollbar__bar.is-vertical {
      width: 4px;

      .el-scrollbar__thumb {
        opacity: 0.3;
      }
    }
  }
}
</style>

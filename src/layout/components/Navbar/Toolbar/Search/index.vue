<script name="Search" setup>
import { isExternal } from '@/utils/validate'
import { useRouteStore } from '@store/route'
import { useRouter } from 'vue-router'

const routeStore = useRouteStore()
const router = useRouter()
const show = ref(false)
const search = ref('')
const options = ref([])
const searchSelectRef = useTemplateRef('searchSelectRef')

function handleClick() {
  show.value = !show.value
  if (show.value) {
    nextTick(() => {
      searchSelectRef.value.focus()
    })
  }
}

function querySearch(query) {
  options.value = routeStore
    .searchRoutes(query)
    .map(({ item }) => ({ label: item.title, value: item }))
}

function change({ path, query }) {
  search.value = ''
  options.value = []
  if (isExternal(path)) {
    window.open(path)
  } else {
    router.push({ path, query })
  }
}
</script>

<template>
  <div :class="['search', { 'hover-expand': !show }]">
    <svg-icon icon="search" @click.stop="handleClick" />
    <el-select
      :class="['search-select', { show }]"
      v-model="search"
      :remote-method="querySearch"
      :placeholder="`${$t('common.search')}...`"
      ref="searchSelectRef"
      filterable
      default-first-option
      remote
      @change="change"
    >
      <el-option
        v-for="option in options"
        :key="option"
        :label="option.label"
        :value="option.value"
      />
    </el-select>
  </div>
</template>

<style lang="scss" scoped>
.search {
  display: flex;
  align-items: center;

  .search-select {
    display: inline-block;
    width: 0;
    overflow: hidden;
    font-size: 18px;
    background: transparent;
    border-radius: 0;
    transition: width 0.2s;

    --el-border-color: var(--el-color-info-light-3);

    &.show {
      width: 210px;
      margin-left: 10px;
    }

    :deep(input) {
      width: 11px;
      padding-right: 0;
      padding-left: 0;
      vertical-align: middle;
      border: 0;
      border-bottom: 1px solid #d9d9d9;
      border-radius: 0;
      box-shadow: none !important;
    }

    :deep(.el-select__wrapper) {
      background-color: transparent;
    }
  }
}
</style>

<script name="MobileSearch" setup>
import { isExternal } from '@/utils/validate'
import { useRouteStore } from '@store/route'
import { useRouter } from 'vue-router'

const routeStore = useRouteStore()
const router = useRouter()
const show = ref(false)
const search = ref('')
const options = ref([])

watch(show, val => {
  if (!val) {
    search.value = ''
    options.value = []
  }
})

function handleInput(query) {
  options.value = routeStore.searchRoutes(query).map(({ item }) => item)
}

function handleClick({ path, query }) {
  show.value = false
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
  <div>
    <svg-icon icon="search" @click="show = true" />
    <teleport to="body">
      <div class="search-page" v-if="show">
        <el-input
          v-model="search"
          :placeholder="`${$t('common.search')}...`"
          clearable
          @input="handleInput"
        >
          <template #prefix>
            <svg-icon icon="search" />
          </template>
          <template #append>
            <el-button @click="show = false">取消</el-button>
          </template>
        </el-input>
        <el-scrollbar>
          <div class="flex flex-col gap-8px" v-if="options.length">
            <div
              class="search-result-item"
              v-for="item in options"
              :key="item"
              @click="handleClick(item)"
            >
              <div>
                <svg-icon :icon="item.icon" />
                <span class="ml-6px">{{ item.title }}</span>
              </div>
            </div>
          </div>
          <el-empty v-else />
        </el-scrollbar>
      </div>
    </teleport>
  </div>
</template>

<style lang="scss" scoped>
.search-page {
  position: fixed;
  inset: 0;
  z-index: 9;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: var(--base-bg);

  .search-result-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
    color: var(--el-text-color-regular);
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color-light);
    border-radius: 4px;
  }
}
</style>

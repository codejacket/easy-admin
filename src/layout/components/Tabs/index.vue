<script name="Tabs" setup>
import { useSettingsStore } from '@store/settings'
import { useTabsStore } from '@store/tabs'
import { useDraggable } from 'vue-draggable-plus'
import { useRoute, useRouter } from 'vue-router'
import ContextMenu from './ContextMenu'
import TabLink from './TabLink'
import TabsToolbar from './TabsToolbar'

const settingsStore = useSettingsStore()
const tabsStore = useTabsStore()
const { tabs } = storeToRefs(tabsStore)
const route = useRoute()
const router = useRouter()

const tabsRef = useTemplateRef('tabsRef')
const tabRefs = useTemplateRef('tab')
const scrollbarRef = useTemplateRef('scrollbarRef')
const contextMenuRef = useTemplateRef('contextMenuRef')

const selectedTab = ref(null)
// prettier-ignore
const selectedIndex = computed(() => tabs.value.findIndex(t => t.path === selectedTab.value.path))
const currentIndex = computed(() => tabs.value.findIndex(t => t.path === route.path))

let draggableInstance = null

onMounted(() => {
  draggableInstance = useDraggable(scrollbarRef.value.wrapRef.firstChild, tabs.value, {
    animation: 150,
    disabled: !settingsStore.tabs.draggable,
    ghostClass: 'ghost',
  })
  draggableInstance.start()
  document.body.addEventListener('click', closeMenu)
})

onUnmounted(() => {
  document.body.removeEventListener('click', closeMenu)
})

watch(route, route => {
  if (route.path !== '/') {
    tabsStore.addTab(route)
    moveToCurrentTab()
  }
})

watch(
  () => settingsStore.tabs.draggable,
  val => {
    draggableInstance?.option?.('disabled', !val)
  },
)

function show(condition) {
  return tabs.value.some((t, i) => condition(i) && !t.meta.affixTab)
}

function toLastTab() {
  if (tabs.value.length) {
    let lastTab = tabs.value.at(-1)
    router.push(lastTab.fullPath ?? lastTab.path)
  } else {
    router.push('/')
  }
}

function moveToCurrentTab() {
  nextTick(() => {
    let wrapRef = scrollbarRef.value.wrapRef
    let currentTab = tabRefs.value[currentIndex.value]?.$el
    let tabSpace = 4
    let scrollbarWidth = scrollbarRef.value.$el.offsetWidth
    let paddingLeft = tabRefs.value[currentIndex.value - 1]?.$el?.offsetWidth + 2 * tabSpace
    let paddingRight = tabRefs.value[currentIndex.value + 1]?.$el?.offsetWidth + 2 * tabSpace
    let left = currentTab.offsetLeft - wrapRef.scrollLeft
    let offsetLeft = left - paddingLeft
    let offsetRight = left + currentTab.offsetWidth - scrollbarWidth + paddingRight
    if (currentIndex.value === 0) {
      wrapRef.scrollLeft = 0
    } else if (currentIndex.value === tabs.value.length - 1) {
      wrapRef.scrollLeft = wrapRef.scrollWidth - scrollbarWidth
    } else if (offsetLeft < 0) {
      wrapRef.scrollLeft += offsetLeft
    } else if (offsetRight > 0) {
      wrapRef.scrollLeft += offsetRight
    }
  })
}

function openMenu(tab, e) {
  if (tabs.value.length === 1) return
  let left = tabsRef.value.getBoundingClientRect().left
  let x = Math.min(e.clientX - left, tabsRef.value.offsetWidth - 105)
  let y = e.clientY - 50
  contextMenuRef.value.openMenu(x, y)
  selectedTab.value = tab
}

function closeMenu() {
  contextMenuRef.value.closeMenu()
}

function closeTab(tab) {
  let tabIndex = tabs.value.findIndex(t => t.path === tab.path)
  let flag = currentIndex.value === tabIndex
  tabsStore.delTabs((tab, i) => i === tabIndex)
  if (flag) toLastTab()
}

function closeTabs(condition) {
  let flag = condition(currentIndex.value, selectedIndex.value)
  tabsStore.delTabs((tab, i) => condition(i))
  if (flag) toLastTab()
}
</script>

<template>
  <div
    :class="['tabs-container', settingsStore.tabs.style]"
    :style="{ height: `${settingsStore.tabs.height}px` }"
    ref="tabsRef"
  >
    <el-scrollbar class="tabs-scrollbar" ref="scrollbarRef">
      <TabLink
        v-for="tab in tabs"
        :key="tab"
        :route="tab"
        :draggable="settingsStore.tabs.draggable"
        :show-icon="settingsStore.tabs.showIcon"
        ref="tab"
        @contextmenu.prevent="openMenu(tab, $event)"
        @close="closeTab(tab)"
      />
    </el-scrollbar>
    <TabsToolbar />
    <ContextMenu ref="contextMenuRef">
      <li v-if="show(i => i === selectedIndex)" @click="closeTab(selectedTab)">
        <svg-icon icon="wrong" />
        {{ $t('common.closeCurrent') }}
      </li>
      <li v-if="show(i => i !== selectedIndex)" @click="closeTabs(i => i !== selectedIndex)">
        <svg-icon icon="wrong" />
        {{ $t('common.closeOthers') }}
      </li>
      <li v-if="show(i => i < selectedIndex)" @click="closeTabs(i => i < selectedIndex)">
        <svg-icon icon="arrow-L" />
        {{ $t('common.closeLeft') }}
      </li>
      <li v-if="show(i => i > selectedIndex)" @click="closeTabs(i => i > selectedIndex)">
        <svg-icon icon="arrow-R" />
        {{ $t('common.closeRight') }}
      </li>
      <li v-if="show(i => true)" @click="closeTabs(i => true)">
        <svg-icon icon="circle-wrong" />
        {{ $t('common.closeAll') }}
      </li>
    </ContextMenu>
  </div>
</template>

<style lang="scss" scoped>
.tabs-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 34px;
  background: var(--tabs-bg);

  .tabs-scrollbar {
    height: inherit;
    white-space: nowrap;

    :deep(.el-scrollbar__bar) {
      bottom: 0;
    }

    :deep(.el-scrollbar__wrap) {
      height: inherit;

      .el-scrollbar__view {
        display: flex;
        gap: 4px;
        align-items: end;
        height: inherit;
      }
    }
  }

  li {
    padding: 7px 16px;
    margin: 0;
    color: var(--el-text-color-regular);
    border-radius: 3px;

    svg {
      margin-right: 5px;
      color: var(--el-text-color-regular);
    }

    &:hover {
      color: var(--el-color-primary);
      background: var(--el-color-primary-light-9);

      svg {
        color: var(--el-color-primary);
      }
    }
  }
}
</style>

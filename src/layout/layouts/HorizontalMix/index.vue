<script name="HorizontalMix" setup>
import SystemLogo from '@/components/SystemLogo'
import Hamburger from '@/layout/components/Hamburger'
import Menu from '@/layout/components/Menu'
import Navbar from '@/layout/components/Navbar'
import Sidebar from '@/layout/components/Sidebar'
import Tabs from '@/layout/components/Tabs'
import { findNode } from '@/utils/tree'
import { isExternal } from '@/utils/validate'
import { useAppStore } from '@store/app'
import { useRouteStore } from '@store/route'
import { useSettingsStore } from '@store/settings'
import { useRoute, useRouter } from 'vue-router'

const { collapse, tabFullscreen } = storeToRefs(useAppStore())
const { sidebarRoutes } = storeToRefs(useRouteStore())
const { header, tabs } = storeToRefs(useSettingsStore())

const subMenu = ref(null)
const route = useRoute()
const router = useRouter()

const sidebarWidth = computed(() => {
  if (tabFullscreen.value) {
    return 0
  } else if (collapse.value) {
    return 54
  } else {
    return 90
  }
})

watch(
  route,
  route => {
    subMenu.value = sidebarRoutes.value.find(item => item.path === route.matched[1]?.path)
  },
  { immediate: true },
)

function handleClick(route) {
  let { path, query } = Array.isArray(route.children)
    ? findNode(route.children, node => !Array.isArray(node.children))
    : route
  if (isExternal(path)) {
    subMenu.value = route
    window.open(path)
  } else {
    router.push({ path, query })
  }
}
</script>

<template>
  <el-container>
    <el-header>
      <Navbar :height="tabFullscreen ? 0 : header.height">
        <SystemLogo class="logo-container" />
        <Menu :data="subMenu?.children" :collapse="false" mode="horizontal">
          <template #default="{ meta }">
            <svg-icon class="mr-6px" :icon="meta.icon" />
            <span class="text-ellipsis">{{ meta.title }}</span>
          </template>
        </Menu>
      </Navbar>
    </el-header>
    <el-container>
      <el-aside>
        <Sidebar :width="sidebarWidth">
          <el-menu class="sidebar-menu" :default-active="$route.matched[1]?.path">
            <el-menu-item
              v-for="item in sidebarRoutes"
              :key="item.path"
              :index="item.path"
              @click="handleClick(item)"
            >
              <svg-icon :icon="item.meta.icon" />
              <span v-if="!collapse">{{ item.meta.title }}</span>
            </el-menu-item>
          </el-menu>
          <template #footer>
            <div class="sidebar-footer">
              <Hamburger color="var(--sidebar-text-color)" />
            </div>
          </template>
        </Sidebar>
      </el-aside>
      <el-main class="flex flex-col">
        <Tabs v-if="tabs.show && header.fixed" />
        <el-scrollbar class="main-scrollbar">
          <Tabs v-if="tabs.show && !header.fixed" />
          <AppMain />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
  width: 100vw;
  height: 100vh;
  background: var(--base-bg);

  .el-header {
    z-index: 9;
    height: auto;
    box-shadow: 0 1px 6px rgb(0 0 0 / 10%);

    .logo-container {
      flex-shrink: 0;
      height: 100%;
      margin: 0 30px;
    }

    .el-menu {
      width: 100%;
      height: 100%;
      border-bottom: none;

      .el-menu-item,
      .el-sub-menu {
        &:hover svg {
          color: var(--el-color-primary);
        }
      }

      .is-active {
        &.el-menu-item {
          svg {
            color: var(--el-color-primary);
          }
        }

        &.el-sub-menu > .el-sub-menu__title {
          color: var(--el-color-primary);

          svg {
            color: var(--el-color-primary);
          }
        }
      }
    }
  }

  .el-aside {
    z-index: 8;
    width: auto;
    box-shadow: 1px 0 6px rgb(0 0 0 / 10%);

    .sidebar-menu {
      .el-menu-item {
        flex-direction: column;
        gap: 4px;
        align-items: center;
        justify-content: center;
        margin-bottom: 6px;

        span {
          font-size: smaller;
          line-height: normal;
        }
      }
    }

    .sidebar-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 50px;
      border-top: 1px solid #333;
    }
  }
}
</style>

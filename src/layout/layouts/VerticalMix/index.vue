<script name="VerticalMix" setup>
import SystemLogo from '@/components/SystemLogo'
import AppMain from '@/layout/components/AppMain'
import Breadcrumb from '@/layout/components/Breadcrumb'
import Hamburger from '@/layout/components/Hamburger'
import Menu from '@/layout/components/Menu'
import Navbar from '@/layout/components/Navbar'
import Sidebar from '@/layout/components/Sidebar'
import Tabs from '@/layout/components/Tabs'
import { useAppStore } from '@store/app'
import { useRouteStore } from '@store/route'
import { useSettingsStore } from '@store/settings'
import { useRouter } from 'vue-router'

const { collapse, tabFullscreen } = storeToRefs(useAppStore())
const { sidebarRoutes } = storeToRefs(useRouteStore())
const { header, tabs } = storeToRefs(useSettingsStore())

const router = useRouter()
const subMenu = ref(null)
const fixSubMenu = ref(false)

const sidebarWidth = computed(() => {
  if (tabFullscreen.value) {
    return 0
  } else if (collapse.value) {
    return 54
  } else {
    return 90
  }
})

function handleClick(route) {
  subMenu.value = route
  if (!Array.isArray(route.children)) {
    if (isExternal(route.path)) {
      window.open(route.path)
    } else {
      router.push({
        path: route.path,
        query: route.query,
      })
    }
  }
}

function handleMouseleave(e) {
  if (e.layerX > 0 && !fixSubMenu.value) {
    subMenu.value = null
  }
}
</script>

<template>
  <el-container>
    <el-aside class="sidebar">
      <Sidebar :width="sidebarWidth">
        <template #header>
          <SystemLogo class="w-full h-50px" collapse />
        </template>
        <el-menu class="sidebar-menu" :default-active="`/${$route.path.split('/')[1]}`">
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
    <el-container>
      <el-aside :style="{ position: fixSubMenu ? 'relative' : 'absolute' }">
        <Sidebar
          :width="subMenu?.children && !tabFullscreen ? 215 : 0"
          class="sidebar-submenu"
          @mouseleave="handleMouseleave"
        >
          <template #header>
            <div class="sidebar-submenu-title">
              <h2 class="primary-text">{{ $t('system.title') }}</h2>
              <svg-icon
                :class="{ 'primary-text': fixSubMenu }"
                :icon="fixSubMenu ? 'pin-fixed' : 'pin'"
                :style="{ color: fixSubMenu ? 'var(--el-color-primary)' : '#808080' }"
                @click="fixSubMenu = !fixSubMenu"
              />
            </div>
          </template>
          <Menu :data="subMenu?.children" :collapse="false">
            <template #default="{ meta }">
              <div>
                <svg-icon class="mr-6px" :icon="meta.icon" />
              </div>
              <span>{{ meta.title }}</span>
            </template>
          </Menu>
        </Sidebar>
      </el-aside>
      <el-container>
        <el-header>
          <div v-if="header.fixed">
            <Navbar :height="tabFullscreen ? 0 : header.height">
              <Hamburger class="mx-15px" />
              <Breadcrumb v-if="header.showBreadcrumb" />
            </Navbar>
            <Tabs v-if="tabs.show" />
          </div>
        </el-header>
        <el-main>
          <el-scrollbar class="main-scrollbar">
            <div v-if="!header.fixed">
              <Navbar :height="tabFullscreen ? 0 : header.height">
                <Hamburger class="mx-15px" />
                <Breadcrumb v-if="header.showBreadcrumb" />
              </Navbar>
              <Tabs v-if="tabs.show" />
            </div>
            <AppMain />
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
  width: 100vw;
  height: 100vh;
  background: var(--base-bg);

  .sidebar {
    z-index: 2002;
    display: flex;
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
      border-top: 1px solid rgb(128 128 128 / 50%);
    }
  }

  .el-container {
    .el-aside {
      z-index: 2001;
      width: auto;
      height: 100%;
      box-shadow: 1px 0 6px rgb(0 0 0 / 10%);

      .sidebar-submenu {
        flex-shrink: 0;
        box-shadow: 1px 0 6px rgb(0 0 0 / 10%);
        transition: 0.28s;

        .sidebar-submenu-title {
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          height: 50px;
          padding: 0 10px;

          h2 {
            overflow: hidden;
            font-size: 16px;
            font-weight: 700;
            white-space: nowrap;
            cursor: pointer;
          }

          svg {
            cursor: pointer;

            &:hover {
              background: rgb(128 128 128 / 12.2%);
              box-shadow: 0 0 0 4px rgb(128 128 128 / 12.2%);
            }
          }
        }
      }
    }

    .el-header {
      height: auto;
    }
  }
}
</style>

<script name="Settings" setup>
import { $t, $tm } from '@/locales'
import modal from '@plugins/modal'
import { useSettingsStore } from '@store/settings'
import { VueDraggable } from 'vue-draggable-plus'
import LayoutSelect from './LayoutSelect'
import SettingItem from './SettingItem'

const settingsStore = useSettingsStore()
const { system, header, tabs, sidebar, theme, navToolbar } = storeToRefs(settingsStore)

const settings = computed(() => $tm('settings'))

const iconMap = {
  light: 'light',
  dark: 'dark',
  auto: 'mode-auto',
}

function save() {
  modal.loading.open($t('message.saving'))
  settingsStore.saveSettings()
  setTimeout(modal.loading.close, 800)
}

function reset() {
  modal.loading.open($t('message.reseting'))
  settingsStore.resetSettings()
  setTimeout(modal.loading.close, 800)
}
</script>

<template>
  <el-drawer class="settings-drawer" :title="$t('common.configuration')" size="320" append-to-body>
    <el-scrollbar>
      <el-collapse>
        <!-- 系统 -->
        <el-collapse-item :title="$t('settings.system.title')">
          <layout-select
            v-model="system.layout"
            :options="Object.keys(settings.system.children.layout.options)"
          />
          <br />
          <setting-item
            v-model="system.mode"
            :options="Object.keys(settings.system.children.mode.options)"
            is="el-segmented"
            title="system.children.mode"
          >
            <template #default="{ item }">
              <svg-icon :icon="iconMap[item]" />
            </template>
          </setting-item>
          <setting-item
            v-model="system.language"
            :placeholder="settings.system.children.language.placeholder"
            is="el-select"
            title="system.children.language"
          >
            <template #prefix>
              <svg-icon icon="global" />
            </template>
            <el-option
              v-for="(val, key) in settings.system.children.language.options"
              :key="key"
              :label="val"
              :value="key"
            />
          </setting-item>
          <setting-item
            v-model="system.pageAnimateType"
            :placeholder="settings.system.children.pageAnimateType.placeholder"
            is="el-select"
            title="system.children.pageAnimateType"
          >
            <template #prefix>
              <svg-icon icon="ppt" />
            </template>
            <el-option
              v-for="(val, key) in settings.system.children.pageAnimateType.options"
              :key="key"
              :label="val"
              :value="key"
            />
          </setting-item>
          <setting-item
            v-model="system.dynamicTitle"
            is="el-switch"
            title="system.children.dynamicTitle"
          />
          <setting-item
            v-model="system.watermark"
            is="el-switch"
            title="system.children.watermark"
          />
          <setting-item v-model="system.grey" is="el-switch" title="system.children.grey" />
          <setting-item
            v-model="system.colorWeak"
            is="el-switch"
            title="system.children.colorWeak"
          />
        </el-collapse-item>
        <!-- 主题 -->
        <el-collapse-item :title="$t('settings.theme.title')">
          <setting-item
            v-model="theme.primary"
            is="easy-color-picker"
            title="theme.children.primary"
          />
          <setting-item
            v-model="theme.success"
            is="easy-color-picker"
            title="theme.children.success"
          />
          <setting-item v-model="theme.info" is="easy-color-picker" title="theme.children.info" />
          <setting-item
            v-model="theme.warning"
            is="easy-color-picker"
            title="theme.children.warning"
          />
          <setting-item
            v-model="theme.danger"
            is="easy-color-picker"
            title="theme.children.danger"
          />
        </el-collapse-item>
        <!-- 头部 -->
        <el-collapse-item :title="$t('settings.header.title')">
          <setting-item
            v-model="header.height"
            :min="40"
            :max="80"
            :step="5"
            is="el-input-number"
            title="header.children.height"
          />
          <setting-item v-model="header.fixed" is="el-switch" title="header.children.fixed" tip />
          <setting-item
            v-model="header.showBreadcrumb"
            is="el-switch"
            title="header.children.showBreadcrumb"
          />
          <setting-item
            v-model="header.showBreadcrumbIcon"
            is="el-switch"
            title="header.children.showBreadcrumbIcon"
          />
        </el-collapse-item>
        <!-- 工具栏 -->
        <el-collapse-item :title="$t('settings.navToolbar.title')">
          <VueDraggable ghostClass="ghost" v-model="navToolbar" :animation="150" handle=".handle">
            <div
              :class="['nav-toolbar-item', { 'disabled': !item.show }]"
              v-for="item in navToolbar"
              :key="item.is"
            >
              <div>
                <svg-icon class="handle" :icon="item.icon" />
                <span>{{ settings.navToolbar.options[item.is] }}</span>
              </div>
              <el-switch v-model="item.show" size="small" />
            </div>
          </VueDraggable>
        </el-collapse-item>
        <!-- 标签栏 -->
        <el-collapse-item :title="$t('settings.tabs.title')">
          <setting-item v-model="tabs.show" is="el-switch" title="tabs.children.show" />
          <setting-item v-model="tabs.showIcon" is="el-switch" title="tabs.children.showIcon" />
          <setting-item
            v-model="tabs.height"
            :min="30"
            :max="60"
            :step="2"
            is="el-input-number"
            title="tabs.children.height"
          />
          <setting-item
            v-model="tabs.style"
            :placeholder="settings.tabs.children.style.placeholder"
            is="el-select"
            title="tabs.children.style"
          >
            <template #prefix>
              <svg-icon icon="tag" />
            </template>
            <el-option
              v-for="(val, key) in settings.tabs.children.style.options"
              :key="key"
              :label="val"
              :value="key"
            />
          </setting-item>
          <setting-item v-model="tabs.draggable" is="el-switch" title="tabs.children.draggable" />
        </el-collapse-item>
        <!-- 侧边栏 -->
        <el-collapse-item :title="$t('settings.sidebar.title')">
          <setting-item
            v-model="sidebar.width"
            :min="180"
            :max="360"
            :step="5"
            is="el-input-number"
            title="sidebar.children.width"
          />
          <setting-item
            v-model="sidebar.itemHeight"
            :min="40"
            :max="60"
            :step="2"
            is="el-input-number"
            title="sidebar.children.itemHeight"
          />
          <setting-item
            v-model="sidebar.style"
            :placeholder="settings.sidebar.children.style.placeholder"
            is="el-select"
            title="sidebar.children.style"
          >
            <template #prefix>
              <svg-icon icon="tag" />
            </template>
            <el-option
              v-for="(val, key) in settings.sidebar.children.style.options"
              :key="key"
              :label="val"
              :value="key"
            />
          </setting-item>
          <setting-item v-model="sidebar.dark" is="el-switch" title="sidebar.children.dark" tip />
          <setting-item
            v-model="sidebar.showToolbar"
            is="el-switch"
            title="sidebar.children.showToolbar"
          />
          <setting-item
            v-model="sidebar.uniqueOpened"
            is="el-switch"
            title="sidebar.children.uniqueOpened"
            tip
          />
        </el-collapse-item>
      </el-collapse>
    </el-scrollbar>
    <template #footer>
      <easy-button v-click-rotate t="common.save" type="primary" i="save" plain @click="save" />
      <easy-button v-click-rotate t="common.resetDefault" i="refresh" plain @click="reset" />
    </template>
  </el-drawer>
</template>

<style lang="scss">
.settings-drawer {
  .el-drawer__header {
    padding: 16px;
    margin: 0;
  }

  .el-drawer__body {
    padding: 0 20px;
  }

  .el-scrollbar {
    overflow: visible;

    .el-scrollbar__bar {
      right: -20px;
      width: 4px;
    }
  }

  .el-collapse {
    .el-collapse-item__header {
      padding-right: 0;
      font-size: 14px;
      letter-spacing: 1px;
    }

    .el-collapse-item__wrap {
      .el-collapse-item__content {
        padding-bottom: 16px;

        .nav-toolbar-item {
          display: flex;
          justify-content: space-between;
          padding: 4px 8px;
          margin-bottom: 5px;
          color: var(--el-text-color-regular);
          background: var(--el-color-info-light-9);
          border-radius: 4px;

          &:last-child {
            margin-bottom: 0;
          }

          div {
            display: flex;
            gap: 8px;
            align-items: center;

            svg {
              cursor: move;
            }

            span {
              cursor: pointer;
            }
          }
        }

        .disabled {
          color: var(--el-text-color-placeholder);
        }

        .ghost {
          opacity: 0;
        }
      }
    }
  }

  .el-drawer__footer {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding: 16px;
    border-top: 1px solid var(--el-border-color);
  }
}
</style>

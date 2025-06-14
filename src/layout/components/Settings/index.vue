<template>
  <el-drawer class="drawer-container" size="320" :title="$t('common.configuration')" append-to-body>
    <el-scrollbar style="height:calc(100% - 52.8px)">
      <el-collapse>
        <!-- 系统 -->
        <el-collapse-item :title="$t('settings.system.title')">
          <layout-select v-model="system.layout" :options="Object.keys(settings.system.children.layout.options)" />
          <br>
          <setting-item type="el-segmented" title="system.children.mode" v-model="system.mode" 
            :options="Object.keys(settings.system.children.mode.options)">
            <template #default="{ item }">
              <svg-icon :icon="`${{ light: 'light', dark: 'dark', auto: 'mode-auto' }[item]}`" />
            </template>
          </setting-item>
          <setting-item type="el-select" title="system.children.language" v-model="system.language"
            :placeholder="settings.system.children.language.placeholder">
            <template #prefix>
              <svg-icon icon="global" />
            </template>
            <el-option v-for="val, key in settings.system.children.language.options" :key="key" :label="val" :value="key" />
          </setting-item>
          <setting-item type="el-select" title="system.children.pageAnimateType" v-model="system.pageAnimateType"
            :placeholder="settings.system.children.pageAnimateType.placeholder">
            <template #prefix>
              <svg-icon icon="ppt" />
            </template>
            <el-option v-for="val, key in settings.system.children.pageAnimateType.options" :key="key" :label="val" :value="key" />
          </setting-item>
          <setting-item type="el-switch" title="system.children.dynamicTitle" v-model="system.dynamicTitle" />
          <setting-item type="el-switch" title="system.children.watermark" v-model="system.watermark" />
          <setting-item type="el-switch" title="system.children.grey" v-model="system.grey" />
          <setting-item type="el-switch" title="system.children.colorWeak" v-model="system.colorWeak" />
        </el-collapse-item>
        <!-- 主题 -->
        <el-collapse-item :title="$t('settings.theme.title')">
          <setting-item type="easy-color-picker" title="theme.children.primary" v-model="theme.primary" />
          <setting-item type="easy-color-picker" title="theme.children.success" v-model="theme.success" />
          <setting-item type="easy-color-picker" title="theme.children.info" v-model="theme.info" />
          <setting-item type="easy-color-picker" title="theme.children.warning" v-model="theme.warning" />
          <setting-item type="easy-color-picker" title="theme.children.danger" v-model="theme.danger" />
        </el-collapse-item>
        <!-- 头部 -->
        <el-collapse-item :title="$t('settings.header.title')">
          <setting-item type="el-input-number" title="header.children.height" v-model="header.height" :min="40" :max="80" :step="5" />
          <setting-item type="el-switch" title="header.children.fixed" v-model="header.fixed" tip />
          <setting-item type="el-switch" title="header.children.showBreadcrumb" v-model="header.showBreadcrumb" />
          <setting-item type="el-switch" title="header.children.showBreadcrumbIcon" v-model="header.showBreadcrumbIcon" />
        </el-collapse-item>
        <!-- 工具栏 -->
        <el-collapse-item :title="$t('settings.navToolbar.title')">
          <VueDraggable v-model="navToolbar" :animation="150" handle=".handle" ghostClass="ghost">
            <div :class="['nav-toolbar-item', { 'disabled': !item.show }]" v-for="item in navToolbar" :key="item.is">
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
          <setting-item type="el-switch" title="tabs.children.show" v-model="tabs.show" />
          <setting-item type="el-switch" title="tabs.children.showIcon" v-model="tabs.showIcon" />
          <setting-item type="el-input-number" title="tabs.children.height" v-model="tabs.height" :min="30" :max="60" :step="2" />
          <setting-item type="el-select" title="tabs.children.style" v-model="tabs.style"
            :placeholder="settings.tabs.children.style.placeholder">
            <template #prefix>
              <svg-icon icon="tag" />
            </template>
            <el-option v-for="val, key in settings.tabs.children.style.options" :key="key" :label="val" :value="key" />
          </setting-item>
          <setting-item type="el-switch" title="tabs.children.draggable" v-model="tabs.draggable" />
        </el-collapse-item>
        <!-- 侧边栏 -->
        <el-collapse-item :title="$t('settings.sidebar.title')">
          <setting-item type="el-input-number" title="sidebar.children.width" v-model="sidebar.width" :min="180" :max="360" :step="5" />
          <setting-item type="el-input-number" title="sidebar.children.itemHeight" v-model="sidebar.itemHeight" :min="40" :max="60" :step="2" />
          <setting-item type="el-select" title="sidebar.children.style" v-model="sidebar.style" :placeholder="settings.sidebar.children.style.placeholder">
            <template #prefix>
              <svg-icon icon="tag" />
            </template>
            <el-option v-for="val, key in settings.sidebar.children.style.options" :key="key" :label="val" :value="key" />
          </setting-item>
          <setting-item type="el-switch" title="sidebar.children.dark" v-model="sidebar.dark" tip />
          <setting-item type="el-switch" title="sidebar.children.uniqueOpened" v-model="sidebar.uniqueOpened" tip />
        </el-collapse-item>
        <!-- 版权 -->
        <el-collapse-item :title="$t('settings.copyright.title')">
          <setting-item type="el-switch" title="copyright.children.show" v-model="copyright.show" />
          <setting-item type="el-input" title="copyright.children.company" v-model="copyright.company" 
            :placeholder="settings.copyright.children.company.placeholder" />
          <setting-item type="el-input" title="copyright.children.date" v-model="copyright.date" 
            :placeholder="settings.copyright.children.company.date" />
          <setting-item type="el-input" title="copyright.children.icp" v-model="copyright.icp" 
            :placeholder="settings.copyright.children.company.icp" />
        </el-collapse-item>
      </el-collapse>
    </el-scrollbar>
    <div class="footer">
      <easy-button type="primary" i="save" t="operation.save" plain v-on-click-rotate @click="save" />
      <easy-button i="refresh" t="operation.reset" plain v-on-click-rotate @click="reset" />
    </div>
  </el-drawer>
</template>

<script>
import settings from "@/settings.js"
import { useSettingsStore } from '@store/settings'
import { mapWritableState } from 'pinia'

import SettingItem from './SettingItem'
import LayoutSelect from './LayoutSelect'
import { VueDraggable } from 'vue-draggable-plus'

export default {
  name: "Settings",
  components: { SettingItem, LayoutSelect, VueDraggable },
  computed: {
    ...mapWritableState(useSettingsStore, Object.keys(settings)),
    settings() {
      return this.$tm('settings')
    }
  },
  methods: {
    save() {
      this.$modal.loading.open(this.$t('message.saving'))
      useSettingsStore().saveSettings()
      setTimeout(this.$modal.loading.close, 800)
    },
    reset() {
      this.$modal.loading.open(this.$t('message.reseting'))
      useSettingsStore().resetSettings()
      setTimeout(this.$modal.loading.close, 800)
    }
  }
}
</script>

<style lang="scss">
.drawer-container {
  .el-drawer__header {
    margin-bottom: 5px;
  }

  .el-scrollbar {
    overflow: visible;

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
            margin-bottom: 5px;
            padding: 4px 8px;
            border-radius: 4px;
            background: var(--el-color-info-light-9);
            color: var(--el-text-color-regular);
            display: flex;
            justify-content: space-between;

            &:last-child {
              margin-bottom: 0;
            }

            div {
              display: flex;
              align-items: center;
              gap: 8px;

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

    .el-scrollbar__bar {
      width: 4px;
      right: -20px;
    }
  }

  .footer {
    width: 100%;
    padding-top: 20px;
    border-top: 1px solid var(--el-border-color);
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
}
</style>

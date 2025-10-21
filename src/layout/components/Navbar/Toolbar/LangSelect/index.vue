<script name="LangSelect" setup>
import { useSettingsStore } from '@store/settings'
const { system } = storeToRefs(useSettingsStore())
</script>

<template>
  <el-dropdown class="lang-select hover-move-up" trigger="click">
    <svg-icon icon="translate" />
    <template #dropdown>
      <el-dropdown-menu>
        <template v-for="(val, key) in $tm('settings.system.children.language.options')" :key="key">
          <el-dropdown-item
            :class="['justify-between', { 'primary-text': system.language === key }]"
            @click="system.language = key"
          >
            {{ val }}
            <svg-icon class="ml-5px" v-if="system.language === key" icon="right" />
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.lang-select {
  font-size: inherit;
  color: inherit;
}
</style>

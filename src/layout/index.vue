<template>
  <el-watermark :font="watermarkStyle" :content="system.watermark ? $t('system.watermark') : null" :zIndex="9999">
    <component :is="component" />
  </el-watermark>
  <Settings v-model="showSettings" />
</template>

<script>
import { useAppStore } from '@store/app'
import { useSettingsStore } from '@store/settings'
import { mapState, mapWritableState } from 'pinia'
import { dashToCamel } from '@/utils'

import Settings from "@/layout/components/Settings"

export default {
  name: "Layout",
  components: { Settings },
  computed: {
    ...mapState(useSettingsStore, ["system", "light"]),
    ...mapWritableState(useAppStore, ["showSettings"]),
    component() {
      return require(`@/layout/layouts/${dashToCamel(this.system.layout)}`).default
    },
    watermarkStyle() {
      return {
        color: this.light ? '#00000026' : '#ffffff26'
      }
    }
  }
}
</script>

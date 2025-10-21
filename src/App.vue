<script name="App" setup>
import { $tm } from '@/locales'
import { useAppStore } from '@store/app'
import { useSettingsStore } from '@store/settings'
import { useHead } from '@unhead/vue'

const { title } = storeToRefs(useAppStore())
const { system } = storeToRefs(useSettingsStore())

watchEffect(() => {
  let content = $tm('system').title || import.meta.env.VITE_APP_TITLE
  let isDynamic = system.value.dynamicTitle && title.value
  useHead({
    title: isDynamic ? `${title.value} - ${content}` : content,
  })
})
</script>

<template>
  <el-config-provider :locale="$tm('')">
    <router-view />
  </el-config-provider>
</template>

<style scoped></style>

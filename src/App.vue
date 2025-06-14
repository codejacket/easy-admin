<template>
  <el-config-provider :locale="$tm('')">
    <metainfo>
      <template #title>
        {{ metaTitle }}
      </template>
    </metainfo>
    <router-view />
  </el-config-provider>
</template>

<script>
import { useAppStore } from '@store/app'
import { useSettingsStore } from '@store/settings'
import { mapState } from 'pinia'
import { useMeta } from 'vue-meta'

export default {
  name: 'App',
  computed: {
    ...mapState(useAppStore, ['title']),
    ...mapState(useSettingsStore, ['system']),
    metaTitle() {
      let content = this.$tm('system').title || process.env.VUE_APP_TITLE
      if (this.system.dynamicTitle && this.title) {
        return `${this.title} - ${content}`
      } else {
        return content
      }
    }
  },
  mounted() {
    useMeta({ title: this.$tm('system').title || process.env.VUE_APP_TITLE })
  }
}
</script>

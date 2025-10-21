<script name="Menu" setup>
import { useAppStore } from '@store/app'
import { useSettingsStore } from '@store/settings'
import MenuItem from './MenuItem'

const props = defineProps({
  data: {
    type: Array,
    default: [],
  },
})

const { collapse } = storeToRefs(useAppStore())
const { sidebar } = storeToRefs(useSettingsStore())
</script>

<template>
  <el-menu
    :default-active="$route.path"
    :collapse="collapse"
    :unique-opened="sidebar.uniqueOpened"
    :collapse-transition="false"
  >
    <template v-for="route in data" :key="route.path">
      <MenuItem v-if="route.meta && !route.meta.hidden" :item="route">
        <template #default="{ meta }">
          <slot :meta="meta">
            <div>
              <svg-icon class="mr-6px" :icon="meta.icon" />
            </div>
            <span>{{ meta.title }}</span>
          </slot>
        </template>
      </MenuItem>
    </template>
  </el-menu>
</template>

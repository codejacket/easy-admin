<script name="MenuItem" setup>
import { isExternal } from '@/utils/validate'
import { useRouter } from 'vue-router'
import MenuItem from './index.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const router = useRouter()

function handleClick() {
  if (isExternal(props.item.path)) {
    window.open(props.item.path)
  } else {
    router.push({
      path: props.item.path,
      query: props.item.query,
    })
  }
}
</script>

<template>
  <el-sub-menu v-if="'children' in item" :index="item.path">
    <template #title>
      <slot :meta="item.meta" />
    </template>
    <template v-for="item in item.children" :key="item.path">
      <MenuItem v-if="item.meta && !item.meta.hidden" :item="item">
        <template #default="{ meta }">
          <slot :meta="meta" />
        </template>
      </MenuItem>
    </template>
  </el-sub-menu>
  <el-menu-item v-else :index="item.path" @click="handleClick">
    <slot :meta="item.meta" />
  </el-menu-item>
</template>

<style lang="scss" scoped></style>

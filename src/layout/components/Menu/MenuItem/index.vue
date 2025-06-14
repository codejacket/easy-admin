<template>
  <el-sub-menu v-if="item.hasOwnProperty('children')" :index="item.path">
    <template #title>
      <slot :meta="item.meta" />
    </template>
    <template v-for="item in item.children" :key="item.path">
      <MenuItem :item="item" v-if="item.meta && !item.meta.hidden">
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

<script>
import { isExternal } from '@/utils/validate'

export default {
  name: "MenuItem",
  props: {
    item: {
      type: Object,
      required: true,
    }
  },
  methods: {
    handleClick() {
      if (isExternal(this.item.path)) {
        window.open(this.item.path)
      } else {
        this.$router.push({
          path: this.item.path,
          query: this.item.query
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
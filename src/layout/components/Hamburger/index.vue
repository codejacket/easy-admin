<script name="Hamburger" setup>
import { useAppStore } from '@store/app'
const { collapse } = storeToRefs(useAppStore())
</script>

<template>
  <svg-icon
    class="hamburger"
    :style="{ transform: `rotate(${collapse ? 180 : 0}deg)` }"
    icon="indent"
    @click="collapse = !collapse"
  />
</template>

<style lang="scss" scoped>
.hamburger {
  font-size: 20px;
  color: var(--tabs-tag-text-color);
  cursor: pointer;
  border-radius: 1px;
  transition: all 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:hover {
    background: rgb(128 128 128 / 12.2%);
    box-shadow: 0 0 0 6px rgb(128 128 128 / 12.2%);
  }
}
</style>

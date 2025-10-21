<script name="ContextMenu" setup>
defineExpose({ openMenu, closeMenu })

const left = ref(0)
const top = ref(0)
const visible = ref(false)

function handleBeforeEnter(el) {
  el.style.height = '0'
}

function handleAfterEnter(el) {
  el.style.transition = 'none'
}

function handleEnter(el) {
  el.style.height = 'auto'
  let h = el.clientHeight
  el.style.height = '0'
  requestAnimationFrame(() => {
    el.style.height = h + 'px'
    el.style.transition = 'height 0.3s'
  })
}

function openMenu(x, y) {
  visible.value = false
  left.value = x
  top.value = y
  requestAnimationFrame(() => {
    visible.value = true
  })
}

function closeMenu() {
  visible.value = false
}
</script>

<template>
  <Transition
    @before-enter="handleBeforeEnter"
    @after-enter="handleAfterEnter"
    @enter="handleEnter"
  >
    <ul class="context-menu" v-if="visible" :style="{ left: left + 'px', top: top + 'px' }">
      <slot />
    </ul>
  </Transition>
</template>

<style lang="scss" scoped>
.context-menu {
  position: absolute;
  z-index: 3000;
  box-sizing: border-box;
  padding: 5px;
  overflow: hidden;
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  list-style-type: none;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-light);
}
</style>

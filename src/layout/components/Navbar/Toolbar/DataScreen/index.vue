<script name="DataScreen" setup>
function handleClick() {
  window.open('localhost:8088')
}
</script>

<template>
  <svg-icon class="hover-shrink" icon="screen" @click="handleClick" />
</template>

<style lang="scss" scoped></style>

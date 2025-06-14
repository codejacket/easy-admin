<template>
    <svg-icon icon="indent" className="hamburger" :style="{ transform: `rotate(${collapse ? 180 : 0}deg)` }"
        @click="collapse = !collapse" />
</template>

<script>
import { useAppStore } from '@store/app'
import { mapWritableState } from 'pinia'

export default {
    name: 'Hamburger',
    computed: { ...mapWritableState(useAppStore, ["collapse"]) }
}
</script>

<style lang="scss" scoped>
    .hamburger {
        width: 20px;
        height: 20px;
        border-radius: 1px;
        color: var(--navbar-icon-fill-color);
        transition: all 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
        cursor: pointer;

        &:hover {
            background: rgba(128, 128, 128, 0.122);
            box-shadow: 0 0 0 6px rgba(128, 128, 128, 0.122);
        }
    }
</style>

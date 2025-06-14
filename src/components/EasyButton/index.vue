<template>
    <el-button>
        <svg-icon :icon="i" v-if="i" />
        <span v-text="text" v-if="t" />
        <slot v-else />
    </el-button>
</template>

<script>
export default {
    name: 'EasyButton',
    props: {
        i: {
            type: String
        },
        t: {
            type: String
        }
    },
    computed: {
        text() {
            let parent = this.$parent
            while (true) {
                if (parent && parent.$t && parent._?.components) {
                    return parent.$t(this.t || '') || this.t
                } else {
                    if (parent.$parent) {
                        parent = parent.$parent
                    } else {
                        return this.$t(this.t) || this.t
                    }
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.el-button {
    &.is-disabled {
        cursor: pointer;
    }

    svg:first-child:not(:last-child) {
        margin-right: 5px;
    }
}
</style>
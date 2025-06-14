<template>
    <el-input class="captcha-image" v-model="code" :placeholder="$t('placeholder.captcha')"
        @keyup.enter.native="open">
        <template #prefix>
            <svg-icon icon="valid-code" />
        </template>
        <template #append>
            <img :src="captchaData.img" class="captcha-img" alt="captcha" draggable="false" 
                v-prevent-reclick="500" @click="refresh"/>
        </template>
    </el-input>
</template>

<script>
import { getCaptcha, checkCaptcha } from "@/api/login"

export default {
    name: 'Image',
    expose: ['open', 'refresh'],
    props: {
        autoRefresh: {
            type: Boolean,
            default: true
        }
    },
    emits: ['success', 'failure'],
    data() {
        return {
            loading: true,
            // 验证结果 { undefined: 未验证，true: 验证通过，false: 验证失败 }
            result: undefined,
            code: '',
            captchaData: {
                img: '',
                code: '',
            }
        }
    },
    created() {
        this.getCaptcha()
    },
    methods: {
        open() {
            if (this.result === undefined) {
                this.checking = true
                checkCaptcha({
                    code: this.code,
                    code: this.captchaData.code
                }).then(() => {
                    this.checking = false
                    this.result = true
                    this.$emit('success')
                }).catch(() => {
                    this.checking = false
                    this.result = false
                    this.$emit('failure')
                    if (this.autoRefresh) {
                        // 自动刷新验证码
                        this.refresh()
                    }
                })
            }
        },
        getCaptcha() {
            this.loading = true
            getCaptcha({
                captchaType: 'image'
            }).then((res) => {
                if (res.data) {
                    this.captchaData.img = res.data.img
                    this.captchaData.code = res.data.code
                    this.loading = false
                    this.result = undefined
                    this.code = ''
                }
            })
        },
        refresh() {
            if (!this.checking && !this.result) {
                this.getCaptcha()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.captcha-image {
    height: 36px;

    :deep(.el-input-group__append) {
        height: 100%;
        padding: 0 2px;
        overflow: hidden;

        img {
            width: 100px;
            height: 32px;
            border-radius: 3px;
            cursor: pointer;
        }
    }
}
</style>
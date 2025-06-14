<template>
    <teleport to="body" :disabled="!appendToBody">
        <div :class="{ 'el-overlay': appendToBody }" v-if="visible" @click="clickOverlay">
            <div class="captcha-pick">
                <h3 class="captcha-header">
                    {{ $t('common.validate') }}
                    <div class="flex">
                        <el-button link v-on-click-rotate v-prevent-reclick="500" :title="$t('common.refresh')">
                            <svg-icon icon="refresh" @click="refresh" />
                        </el-button>
                        <easy-button type="primary" t="common.confirm" size="small" @click="validate" />
                    </div>
                </h3>
                <div class="loading" v-if="loading">{{ $t('message.loading') }}</div>
                <div v-else class="captcha-img-container">
                    <img class="captcha-img"
                        :src="captchaData.img"
                        alt="captcha"
                        @click.prevent="onRecord($event)" />
                    <span class="point"
                        v-for="(point, index) in points"
                        @click="onCancelRecord(index)"
                        :style="{
                            'left': `${point.x - 10}px`,
                            'top': `${point.y - 10}px`
                        }">
                        {{ index + 1 }}
                    </span>
                </div>
                <div class="captcha-prompt" v-if="result !== undefined">
                    {{ result ? $t('message.validateSuccess') : $t('message.validateFailed') }}
                </div>
                <div class="captcha-prompt" v-else>
                    {{ $t('message.captchaPickTip') + ' ' }}
                    <span v-for="option in captchaData.options" :key="option">
                        {{ option }}
                    </span>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script>
import { getCaptcha, checkCaptcha } from "@/api/login"

export default {
    name: 'Pick',
    expose: ['open', 'refresh'],
    props: {
        appendToBody: {
            type: Boolean,
            default: true
        },
        autoClose: {
            type: Boolean,
            default: true
        },
        autoRefresh: {
            type: Boolean,
            default: true
        }
    },
    emits: ['success', 'failure'],
    data() {
        return {
            visible: false,
            loading: true,
            // 正在验证
            checking: false,
            // 验证结果 { undefined: 未验证，true: 验证通过，false: 验证失败 }
            result: undefined,
            points: [],
            captchaData: {
                img: '',
                code: '',
                options: [],
            }
        }
    },
    computed: {
        clickable() {
            return !this.checking && this.result === undefined
        }
    },
    methods: {
        open() {
            this.visible = true
        },
        reset() {
            this.loading = true
            this.checking = false
            this.result = undefined
            this.points = []
            this.captchaData = {
                img: '',
                code: '',
                options: [],
            }
        },
        getCaptcha() {
            this.loading = true
            getCaptcha({
                captchaType: 'pick'
            }).then(({ data }) => {
                if (data) {
                    this.captchaData.img = data.img
                    this.captchaData.code = data.code
                    this.captchaData.options = data.options
                    this.loading = false
                    this.result = undefined
                    this.points = []
                }
            })
        },
        onRecord(event) {
            if (this.points.length < this.captchaData.options.length && this.clickable) {
                this.points.push({
                    x: event.offsetX,
                    y: event.offsetY,
                    t: Date.now()
                })
            }
        },
        onCancelRecord(index) {
            if (this.clickable) {
                this.points.splice(index, 1)
            }
        },
        clickOverlay(e) {
            if (e.target.className === 'el-overlay') {
                this.visible = false
            }
        },
        refresh() {
            if (!this.checking && !this.result) {
                this.getCaptcha()
            }
        },
        validate() {
            if (this.result === undefined) {
                this.checking = true
                checkCaptcha({
                    info: this.points,
                    code: this.captchaData.code
                }).then(() => {
                    this.checking = false
                    this.result = true
                    this.$emit('success')
                    if (this.autoClose) {
                        // 自动关闭验证码
                        setTimeout(() => {
                            this.visible = false
                        }, 1000)
                    }
                }).catch(() => {
                    this.checking = false
                    this.result = false
                    this.$emit('failure')
                    if (this.autoRefresh) {
                        // 自动刷新验证码
                        setTimeout(() => {
                            this.refresh()
                        }, 1000)
                    }
                })
            }
        }
    },
    watch: {
        visible(newVal) {
            this.reset()
            if (newVal) {
                this.getCaptcha()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.el-overlay {
    display: flex;
    justify-content: center;
    align-items: center;
}

.captcha-pick {
    width: 350px;
    padding: 12px;
    border: 1px solid var(--el-border-color-extra-light);
    border-radius: 10px;
    background: var(--el-bg-color);
    box-shadow: var(--el-box-shadow-lighter);

    .captcha-header {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        cursor: default;

        .flex {
            align-items: center;
        }
    }

    .loading {
        width: 350px;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--el-color-info);
    }

    .captcha-img-container {
        position: relative;

        .captcha-img {
            width: 350px;
            height: 200px;
            border: none;
            cursor: pointer;
        }
        .point {
            width: 20px;
            height: 20px;
            border: 1px solid #f2f6fc;
            border-radius: 30px;
            box-sizing: border-box;
            background-color: var(--el-color-primary);
            box-shadow: 0 0 10px var(--el-color-white);
            text-align: center;
            line-height: 19px;
            font-size: var(--el-font-size-small);
            font-weight: bold;
            color: var(--el-color-white);
            position: absolute;
            user-select: none;
            cursor: pointer;
        }
    }

    .captcha-prompt {
        height: 40px;
        line-height: 40px;
        font-size: var(--el-font-size-base);
        text-align: center;
        color: var(--el-color-info);
        span {
            margin-left: 10px;
            font-size: var(--el-font-size-medium);
            font-weight: bold;
            color: var(--el-color-error);
        }
    }
}
</style>
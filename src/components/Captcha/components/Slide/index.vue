<template>
    <teleport to="body" :disabled="!appendToBody">
        <div :class="{ 'el-overlay': appendToBody }" v-if="visible" @click="clickOverlay">
            <div class="captcha-slide" onselectstart="return false">
                <h3 class="captcha-header">
                    {{ $t('common.validate') }}
                    <div class="flex">
                        <easy-button i="refresh" link v-on-click-rotate v-prevent-reclick="500" 
                            :title="$t('common.refresh')" @click="refresh" />
                    </div>
                </h3>
                <div class="loading" v-if="loading">{{ $t('message.loading') }}</div>
                <div v-else class="captcha-img-container">
                    <img class="captcha-img" :src="captchaData.img" alt="captcha" draggable="false" />
                    <img class="captcha-pieces" :src="captchaData.pieces" alt="pieces" draggable="false"
                        @mousedown.left="handleMousedown"
                        :style="{
                            transform: `translate(${x}px, ${captchaData.y}px)`,
                            transition: isMouseDown ? '' : 'transform .2s'
                        }" />
                    <div class="captcha-overlay" v-if="result !== undefined">
                        <div class="captcha-result">
                            <svg-icon :icon="result ? 'check' : 'circle-close'" />
                            <span>{{ result ? $t('message.validateSuccess') : $t('message.validateFailed') }}</span>
                        </div>
                    </div>
                </div>
                <div class="captcha-slider">
                    <div class="captcha-slider-track" :style="{
                            width: `${x + 64 * 0.5}px`,
                            background: trackBgColor,
                            transition: isMouseDown ? '' : 'width .2s'
                        }">
                    </div>
                    <div class="captcha-slider-tips shine-text">{{ $t('message.captchaSliderTip') }}</div>
                    <div class="captcha-slider-block"
                        @mousedown.left="handleMousedown" :style="{
                            transform: `translateX(${x}px)`,
                            transition: isMouseDown ? '' : 'transform .2s'
                        }">
                        <svg-icon icon="arrow-right-double" />
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script>
import { getCaptcha, checkCaptcha } from "@/api/login"

export default {
    name: 'Slide',
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
            checking: false,
            isMouseDown: false,
            result: undefined,
            originX: 0,
            originY: 0,
            x: 0,
            timestamp: 0,
            captchaData: {
                img: '',
                pieces: '',
                y: 0,
                code: ''
            }
        }
    },
    computed: {
        clickable() {
            return !this.checking && this.result === undefined
        },
        trackBgColor() {
            if (this.result === undefined) {
                return this.isMouseDown ? 'var(--el-color-success-light-7)' : ''
            } else if (this.result === false) {
                return 'var(--el-color-danger-light-7)'
            } else {
                return 'var(--el-color-success-light-7)'
            }
        }
    },
    mounted() {
        document.addEventListener('mousemove', this.handleMousemove)
        document.addEventListener('mouseup', this.handleMouseup)
    },
    methods: {
        open() {
            this.visible = true
        },
        close() {
            this.visible = false
        },
        reset() {
            this.loading = true
            this.checking = false
            this.result = undefined
            this.originX = 0
            this.originY = 0
            this.x = 0
            this.timestamp = 0
            this.captchaData = {
                img: '',
                pieces: '',
                y: 0,
                code: '',
            }
        },
        getCaptcha() {
            this.loading = true
            getCaptcha({
                captchaType: 'slide'
            }).then((res) => {
                if (res.data) {
                    this.captchaData.img = res.data.img
                    this.captchaData.pieces = res.data.pieces
                    this.captchaData.y = res.data.y
                    this.captchaData.code = res.data.code
                    this.loading = false
                    this.result = undefined
                    this.originX = 0
                    this.originY = 0
                    this.x = 0
                    this.timestamp = 0
                }
            })
        },
        handleMousedown(e) {
            if (this.clickable) {
                this.isMouseDown = true
                this.originX = e.clientX
                this.originY = e.clientY
                this.timestamp = Date.now()
            }
        },
        handleMousemove(e) {
            if (!this.isMouseDown) return false
            let moveX = e.clientX - this.originX
            if (moveX < 0 || (moveX + 34 * 2 > 350)) {
                return false
            } else {
                this.x = moveX
            }
        },
        handleMouseup(e) {
            if (!this.isMouseDown || !this.clickable) return false
            this.isMouseDown = false
            if (e.clientX === this.originX) return false
            this.timestamp = Date.now() - this.timestamp
            this.validate()
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
                    code: this.captchaData.code,
                    x: this.x,
                    timestamp: this.timestamp
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
    unmounted() {
        document.removeEventListener("mousemove", this.handleMousemove)
        document.removeEventListener("mouseup", this.handleMouseup)
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

.captcha-slide {
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
            vertical-align: bottom;
            user-select: none;
            cursor: default;
        }

        .captcha-pieces {
            width: 68px;
            height: 64px;
            position: absolute;
            left: 0;
            user-select: none;
            cursor: pointer;
        }

        .captcha-overlay  {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            left: 0;
            top: 0;

            .captcha-result {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;

                svg {
                    width: 30px;
                    height: 30px;
                    color: #eee
                }

                span {
                    color: #eee;
                }
            }
        }
    }

    .captcha-slider {
        height: 40px;
        margin-top: 5px;
        background: rgba(128, 128, 128, 0.1);
        position: relative;

        .captcha-slider-track {
            width: 0;
            height: 100%;
            border-radius: 4px;
            box-sizing: border-box;
            position: absolute;
            left: 0;
            top: 0;
        }

        .captcha-slider-tips {
            width: 100%;
            height: 100%;
            padding-bottom: 4px;
            box-sizing: border-box;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            font-size: 0.12em;
            color: var(--el-color-info);
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            cursor: default;
            user-select: none;

            &.shine-text {
                -webkit-background-clip: text !important;
                background-clip: text !important;
                color: transparent;
                animation: 2s linear 0s infinite normal none running shine;
                background: radial-gradient(circle at center, var(--el-color-info-light-7), transparent) -200% 50% /
                    200% 100% no-repeat, var(--el-color-info);

                @keyframes shine {
                    0% {
                        background-position: 200% 0;
                    }
                    100% {
                        background-position: -200% 0;
                    }
                }
            }
        }

        .captcha-slider-block {
            width: 64px;
            height: 34px;
            margin: 3px;
            border-radius: 4px;
            box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.2);
            background: var(--el-bg-color);
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            cursor: pointer;

            svg {
                color: var(--el-text-color-regular);
            }
        }
    }
}
</style>
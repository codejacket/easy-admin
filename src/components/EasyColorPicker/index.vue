<template>
    <el-tooltip effect="light" trigger="click" popper-class="el-color-picker-dropdown" transition="el-zoom-in-top"
        :fallback-placements="['bottom', 'top', 'right', 'left']" :teleported="teleported" :offset="8" :hide-after="0"
        :gpu-acceleration="false" :stop-popper-mouse-event="false" persistent>
        <template #default>
            <slot>
                <div ref="triggerRef" v-bind="$attrs" role="button" class="easy-color-picker"
                    :aria-description="$t('el.colorpicker.description', { color: modelValue || '' })">
                    <div class="el-color-picker__trigger">
                        <span class="el-color-picker__color">
                            <span class="el-color-picker__color-inner" :style="{ backgroundColor: modelValue }">
                                <span :style="{ color: textColor }">
                                    {{ color.toHex().toUpperCase() }}
                                </span>
                            </span>
                        </span>
                    </div>
                </div>
            </slot>
        </template>
        <template #content>
            <div class="color-picker-dropdown">
                <div class="el-color-picker-panel" ref="panelRef"
                    :style="{ backgroundColor: `hsl(${color.toHsl().h},100%,50%)` }" tabindex="1"
                    @mousedown="handleMousedownPanel" @keydown="handleKeyDownPanel">
                    <div class="el-color-picker-pointer"
                        :style="{ background: modelValue, left: `${panel.x}px`, top: `${panel.y}px` }" />
                </div>
                <div class="el-color-picker-controls" :style="{ padding: `${showAlpha ? '10px 0' : '5px 0'}` }">
                    <svg-icon tabindex="0" aria-hidden="false" class="color-absorber" icon="pin" @click="absorbColor" />
                    <div class="sliders">
                        <input class="hue-slider" type="range" :value="color.toHsl().h" min="0" max="360"
                            @input="changeHue" />
                        <input class="alpha-slider" type="range" :value="color.alpha() * 100" v-if="showAlpha" min="0"
                            max="100" @input="changeAlpha" />
                    </div>
                </div>
                <div class="el-color-picker-input">
                    <div class="input-group">
                        <span @click="colorFormatIndex = (colorFormatIndex + 1) % colorFormatMap.length">
                            {{ colorFormatMap[colorFormatIndex] }}
                        </span>
                        <template v-if="colorFormatMap[colorFormatIndex] === 'hex'">
                            <el-input v-model="input.hex" size="small" @keyup.enter="handleEnterInput('hex')"
                                @blur="handleEnterInput('hex')" />
                        </template>
                        <template v-else-if="colorFormatMap[colorFormatIndex] === 'rgb'">
                            <el-input v-model="input.rgb.r" size="small" @keyup.enter="handleEnterInput('rgb')"
                                @blur="handleEnterInput('rgb')" />
                            <el-input v-model="input.rgb.g" size="small" @keyup.enter="handleEnterInput('rgb')"
                                @blur="handleEnterInput('rgb')" />
                            <el-input v-model="input.rgb.b" size="small" @keyup.enter="handleEnterInput('rgb')"
                                @blur="handleEnterInput('rgb')" />
                            <el-input v-model="input.rgb.a" size="small" v-if="showAlpha"
                                @keyup.enter="handleEnterInput('rgb')" @blur="handleEnterInput('rgb')" />
                        </template>
                        <template v-else-if="colorFormatMap[colorFormatIndex] === 'hsl'">
                            <el-input v-model="input.hsl.h" size="small" @keyup.enter="handleEnterInput('hsl')"
                                @blur="handleEnterInput('hsl')" />
                            <el-input v-model="input.hsl.s" size="small" @keyup.enter="handleEnterInput('hsl')"
                                @blur="handleEnterInput('hsl')" />
                            <el-input v-model="input.hsl.l" size="small" @keyup.enter="handleEnterInput('hsl')"
                                @blur="handleEnterInput('hsl')" />
                            <el-input v-model="input.rgb.a" size="small" v-if="showAlpha"
                                @keyup.enter="handleEnterInput('hsl')" @blur="handleEnterInput('hsl')" />
                        </template>
                    </div>
                </div>
                <div class="el-color-picker-predefine" v-if="predefine?.length">
                    <div class="predefine-item" tabindex="0" v-for="item in predefine" :style="{ background: item }"
                        @click="$emit('update:modelValue', item)" />
                </div>
            </div>
        </template>
    </el-tooltip>
</template>

<script>
import { colord } from 'colord'

export default {
    name: 'EasyColorPicker',
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        showAlpha: {
            type: Boolean,
            default: false
        },
        predefine: {
            type: Array,
            default: []
        },
        teleported: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            colorFormatMap: ['hex', 'rgb', 'hsl'],
            colorFormatIndex: 0,
            panel: {
                x: 0,
                y: 0,
                isMouseDown: false
            },
            input: {
                hex: '',
                rgb: { r: '', g: '', b: '', a: 1 },
                hsl: { h: '', s: '', l: '', a: 1 },
            }
        }
    },
    computed: {
        color() {
            return colord(this.modelValue)
        },
        textColor() {
            const { h, l } = this.color.toHsl()
            return `hsl(${h}, 100%, ${l < 50 ? 95 : 5}%)`
        }
    },
    mounted() {
        document.addEventListener('mousemove', this.handleMousemovePanel)
        document.addEventListener('mouseup', this.handleMouseupPanel)
    },
    unmounted() {
        document.removeEventListener("mousemove", this.handleMousemovePanel)
        document.removeEventListener("mouseup", this.handleMouseupPanel)
    },
    methods: {
        changePanel(x, y) {
            const { h, a } = this.color.toHsl()
            const { r, g, b } = colord(`hsl(${h}, 100%, 50%)`).toRgb()
            const { s, l } = colord({
                r: 255 * (1 - y) * (1 - x) + (1 - y) * x * r,
                g: 255 * (1 - y) * (1 - x) + (1 - y) * x * g,
                b: 255 * (1 - y) * (1 - x) + (1 - y) * x * b,
            }).toHsl()
            this.$emit('update:modelValue', colord({ h: this.color.toHsl().h, s, l, a }).toHex())
        },
        changeHue(e) {
            const { s, l, a } = this.color.toHsl()
            this.flag = true
            this.$emit('update:modelValue', colord({ h: e.target.value, s, l, a }).toHex())
        },
        changeAlpha(e) {
            const { r, g, b } = this.color.toRgb()
            this.flag = true
            this.$emit('update:modelValue', colord({ r, g, b, a: e.target.value / 100 }).toHex())
        },
        updatePanel() {
            const c = this.color.toRgb()
            const panel = this.$refs.panelRef || { clientWidth: 225, clientHeight: 225 }
            const { h } = this.color.toHsl()
            const { r, g, b } = colord(`hsl(${h}, 100%, 50%)`).toRgb()
            this.setPanel(
                panel?.clientWidth * 255 * (c.r - c.g) / (c.b * (r - g) + (255 - b) * (c.r - c.g)),
                panel?.clientHeight / 255 * ((255 - c.b) * (r - g) - (255 - b) * (c.r - c.g)) / (r - g)
            )
        },
        updateInput() {
            this.input.hex = this.color.toHex()
            this.input.rgb = this.color.toRgb()
            this.input.hsl = this.color.toHsl()
        },
        handleKeyDownPanel(e) {
            let panelWidth = e.target.clientWidth
            let panelHeight = e.target.clientHeight
            let keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
            if (keys.includes(e.key)) {
                if (e.key === 'ArrowUp') {
                    if (this.panel.y > 0) this.panel.y--
                } else if (e.key === 'ArrowDown') {
                    if (this.panel.y < panelHeight) this.panel.y++
                } else if (e.key === 'ArrowLeft') {
                    if (this.panel.x > 0) this.panel.x--
                } else if (e.key === 'ArrowRight') {
                    if (this.panel.x < panelWidth) this.panel.x++
                }
                this.flag = true
                this.changePanel(this.panel.x / panelWidth, this.panel.y / panelHeight)
            }
        },
        handleMousedownPanel(e) {
            this.flag = true
            this.panel.isMouseDown = true
            let panel = this.$refs.panelRef
            let { x, y } = panel.getBoundingClientRect()
            this.setPanel(e.clientX - x, e.clientY - y)
            this.changePanel(this.panel.x / panel.clientWidth, this.panel.y / panel.clientHeight)
        },
        handleMousemovePanel(e) {
            if (this.panel.isMouseDown) {
                this.handleMousedownPanel(e)
            }
        },
        handleMouseupPanel() {
            this.panel.isMouseDown = false
        },
        handleEnterInput(type) {
            let newColor = colord(this.input[type])
            if (newColor.isValid()) {
                this.$emit('update:modelValue', newColor.toHex())
            }
        },
        async absorbColor() {
            const res = await new EyeDropper().open()
            this.$emit('update:modelValue', res.sRGBHex)
        },
        setPanel(x, y) {
            const panel = this.$refs.panelRef || { clientWidth: 225, clientHeight: 225 }
            this.panel.x = Math.max(Math.min(x, panel.clientWidth), 0)
            this.panel.y = Math.max(Math.min(y, panel.clientHeight), 0)
        }
    },
    watch: {
        colorFormatIndex: {
            immediate: true,
            handler() {
                this.updateInput()
            }
        },
        color: {
            immediate: true,
            handler() {
                this.updateInput()
                if (!this.flag) {
                    this.updatePanel()
                } else {
                    this.flag = false
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.easy-color-picker {
    height: 24px;
    outline: none;
    position: relative;

    .el-color-picker__trigger {
        width: auto;
        padding: 2px;
        min-width: 32px;

        .el-color-picker__color-inner span {
            width: 64px;
            padding: 2px;
            font-size: 12px;
        }
    }
}

.color-picker-dropdown {
    width: 225px;
    padding: 7px 1px;

    .el-color-picker-panel {
        width: 225px;
        height: 225px;
        background: linear-gradient(0deg, #000, #0000), linear-gradient(90deg, #fff, #0000);
        outline: none;
        position: relative;

        .el-color-picker-pointer {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0, 0, 0, .3), 0 0 1px 2px rgba(0, 0, 0, .4);
            position: absolute;
            transform: translate(-50%, -50%);
            cursor: pointer;
        }
    }

    .el-color-picker-controls {
        padding: 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .color-absorber {
            width: 20px;
            height: 20px;
            padding: 4px;
            margin-left: 2px;
            border-radius: 50%;
            color: var(--el-text-color-regular);
            cursor: pointer;

            &:hover,
            &:focus {
                background: rgba(128, 128, 128, 0.15);
            }
        }

        .sliders {
            display: flex;
            flex-direction: column;
            gap: 10px;

            input[type="range"] {
                width: 180px;
                height: 12px;
                margin: 0 6px;
                appearance: none;
                outline: none;
                position: relative;

                &::-webkit-slider-thumb {
                    width: 4px;
                    height: 15px;
                    border: 1px solid var(--el-border-color-lighter);
                    border-radius: 1px;
                    appearance: none;
                    box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
                    background: #fff;
                    position: relative;
                    cursor: pointer;
                }
            }

            input[type="range"].hue-slider {
                background: linear-gradient(to right,
                        rgb(255, 0, 0) 0%,
                        rgb(255, 255, 0) 17%,
                        rgb(0, 255, 0) 33%,
                        rgb(0, 255, 255) 50%,
                        rgb(0, 0, 255) 67%,
                        rgb(255, 0, 255) 83%,
                        rgb(255, 0, 0) 100%);
            }

            input[type="range"].alpha-slider {
                background-size: 12px 12px;
                background-position: 0 0, 6px 0, 6px -6px, 0 6px;
                background-image: linear-gradient(45deg, var(--el-color-picker-alpha-bg-a) 25%, var(--el-color-picker-alpha-bg-b) 25%),
                    linear-gradient(135deg, var(--el-color-picker-alpha-bg-a) 25%, var(--el-color-picker-alpha-bg-b) 25%),
                    linear-gradient(45deg, var(--el-color-picker-alpha-bg-b) 75%, var(--el-color-picker-alpha-bg-a) 75%),
                    linear-gradient(135deg, var(--el-color-picker-alpha-bg-b) 75%, var(--el-color-picker-alpha-bg-a) 75%);
                --el-color-picker-alpha-bg-a: rgba(128, 128, 128, 0.4);
                --el-color-picker-alpha-bg-b: transparent;

                &::before {
                    content: '';
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(to right, rgba(255, 69, 0, 0) 0%, gray 100%);
                    position: absolute;
                    left: 0;
                    top: 0;
                }
            }
        }
    }

    .el-color-picker-input {
        .input-group {
            display: flex;
            gap: 6px;

            span {
                padding: 0 6px;
                border-radius: 3px;
                line-height: 23px;
                color: var(--el-text-color-regular);
                user-select: none;
                cursor: pointer;

                &:hover {
                    background: rgba(128, 128, 128, 0.122);
                }
            }

            .el-input {
                padding: 0;
                letter-spacing: 0.5px;
            }
        }
    }

    .el-color-picker-predefine {
        margin-top: 12px;
        padding: 12px 0 0;
        border-top: 1px solid var(--el-border-color-lighter);
        display: grid;
        grid-gap: 9px;
        grid-template-columns: repeat(auto-fill, 18px);
        justify-content: center;
        position: relative;

        .predefine-item {
            width: 18px;
            height: 18px;
            border-radius: 3px;
            box-shadow: rgba(128, 128, 128, .3) 0px 0px 0px 1px inset;
            cursor: pointer;

            &:focus {
                filter: drop-shadow(rgb(128, 128, 128) 0 0 2px);
                transform: scale(1.1);
            }
        }
    }
}
</style>
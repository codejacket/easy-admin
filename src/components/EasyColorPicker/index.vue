<script name="EasyColorPicker" setup>
import { colord } from 'colord'

const modelValue = defineModel()
const props = defineProps({
  showAlpha: {
    type: Boolean,
    default: false,
  },
  predefine: {
    type: Array,
    default: [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const colorFormatMap = ['hex', 'rgb', 'hsl']
const colorFormatIndex = ref(0)

const panel = reactive({
  x: 0,
  y: 0,
  isMouseDown: false,
})

const input = reactive({
  hex: '',
  rgb: { r: '', g: '', b: '', a: 1 },
  hsl: { h: '', s: '', l: '', a: 1 },
})

const color = computed(() => colord(modelValue.value))
const rgb = computed(() => color.value.toRgb())
const hsl = computed(() => color.value.toHsl())
const hex = computed(() => color.value.toHex())

const panelRef = useTemplateRef('panelRef')

const eyeDropper = new EyeDropper()
let flag = false

onMounted(() => {
  document.addEventListener('mousemove', handleMousemovePanel)
  document.addEventListener('mouseup', handleMouseupPanel)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMousemovePanel)
  document.removeEventListener('mouseup', handleMouseupPanel)
})

watch(
  colorFormatIndex,
  () => {
    updateInput()
  },
  { immediate: true },
)

watch(
  color,
  () => {
    updateInput()
    if (!flag) {
      updatePanel()
    } else {
      flag = false
    }
  },
  { immediate: true },
)

function handleMousedownPanel(e) {
  flag = true
  panel.isMouseDown = true
  let panelEle = panelRef.value
  let { x, y } = panelEle.getBoundingClientRect()
  setPanel(e.clientX - x, e.clientY - y)
  changePanel(panel.x / panelEle.clientWidth, panel.y / panelEle.clientHeight)
}

function handleKeyDownPanel(e) {
  let panelWidth = e.target.clientWidth
  let panelHeight = e.target.clientHeight
  let keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
  if (keys.includes(e.key)) {
    if (e.key === 'ArrowUp') {
      if (panel.y > 0) panel.y--
    } else if (e.key === 'ArrowDown') {
      if (panel.y < panelHeight) panel.y++
    } else if (e.key === 'ArrowLeft') {
      if (panel.x > 0) panel.x--
    } else if (e.key === 'ArrowRight') {
      if (panel.x < panelWidth) panel.x++
    }
    flag = true
    changePanel(panel.x / panelWidth, panel.y / panelHeight)
  }
}

function handleEnterInput(type) {
  let newColor = colord(input[type])
  if (newColor.isValid()) {
    modelValue.value = newColor.toHex()
  }
}

function handleMousemovePanel(e) {
  if (panel.isMouseDown) {
    handleMousedownPanel(e)
  }
}

function handleMouseupPanel() {
  panel.isMouseDown = false
}

async function absorbColor() {
  const res = await eyeDropper.open()
  modelValue.value = res.sRGBHex
}

function setPanel(x, y) {
  const panelEle = panelRef.value || { clientWidth: 225, clientHeight: 225 }
  panel.x = Math.max(Math.min(x, panelEle.clientWidth), 0)
  panel.y = Math.max(Math.min(y, panelEle.clientHeight), 0)
}

function updatePanel() {
  const panelEle = panelRef.value || { clientWidth: 225, clientHeight: 225 }
  const c = rgb.value
  const { h } = hsl.value
  const { r, g, b } = colord(`hsl(${h}, 100%, 50%)`).toRgb()
  setPanel(
    (panelEle?.clientWidth * 255 * (c.r - c.g)) / (c.b * (r - g) + (255 - b) * (c.r - c.g)),
    ((panelEle?.clientHeight / 255) * ((255 - c.b) * (r - g) - (255 - b) * (c.r - c.g))) / (r - g),
  )
}

function updateInput() {
  input.hex = hex.value
  input.rgb = rgb.value
  input.hsl = hsl.value
}

function changePanel(x, y) {
  const { h, a } = hsl.value
  const { r, g, b } = colord(`hsl(${h}, 100%, 50%)`).toRgb()
  const { s, l } = colord({
    r: 255 * (1 - y) * (1 - x) + (1 - y) * x * r,
    g: 255 * (1 - y) * (1 - x) + (1 - y) * x * g,
    b: 255 * (1 - y) * (1 - x) + (1 - y) * x * b,
  }).toHsl()
  modelValue.value = colord({ h, s, l, a }).toHex()
}

function changeHue(e) {
  const { s, l, a } = hsl.value
  flag = true
  modelValue.value = colord({ h: e.target.value, s, l, a }).toHex()
}

function changeAlpha(e) {
  const { r, g, b } = rgb.value
  flag = true
  modelValue.value = colord({ r, g, b, a: e.target.value / 100 }).toHex()
}
</script>

<template>
  <el-tooltip
    :hide-after="0"
    popper-class="el-color-picker-dropdown"
    :fallback-placements="['bottom', 'top', 'right', 'left']"
    :offset="8"
    :gpu-acceleration="false"
    effect="light"
    trigger="click"
    transition="el-zoom-in-top"
    persistent
  >
    <template #default>
      <slot :currentColor="modelValue">
        <div
          :class="['easy-color-picker', { 'is-disabled': disabled }]"
          v-bind="$attrs"
          :aria-description="$t('el.colorpicker.description', { color: modelValue || '' })"
          role="button"
        >
          <div class="el-color-picker__trigger">
            <span class="el-color-picker__color">
              <span class="el-color-picker__color-inner" :style="{ backgroundColor: modelValue }">
                <span :style="{ color: `hsl(${hsl.h}, 100%, ${hsl.l < 50 ? 95 : 5}%)` }">
                  {{ hex.toUpperCase() }}
                </span>
              </span>
            </span>
          </div>
        </div>
      </slot>
    </template>
    <template #content>
      <div class="color-picker-dropdown">
        <div
          class="el-color-picker-panel"
          :style="{ backgroundColor: `hsl(${hsl.h},100%,50%)` }"
          ref="panelRef"
          tabindex="1"
          @mousedown="handleMousedownPanel"
          @keydown="handleKeyDownPanel"
        >
          <div
            class="el-color-picker-pointer"
            :style="{ background: modelValue, left: `${panel.x}px`, top: `${panel.y}px` }"
          />
        </div>
        <div
          class="el-color-picker-controls"
          :style="{ padding: `${showAlpha ? '10px 0' : '5px 0'}` }"
        >
          <svg-icon
            aria-hidden="false"
            class="color-picker-absorber"
            tabindex="0"
            icon="dropper"
            @click="absorbColor"
          />
          <div class="sliders">
            <input
              class="hue-slider"
              :value="hsl.h"
              type="range"
              min="0"
              max="360"
              @input="changeHue"
            />
            <input
              class="alpha-slider"
              v-if="showAlpha"
              :value="color.alpha() * 100"
              type="range"
              min="0"
              max="100"
              @input="changeAlpha"
            />
          </div>
        </div>
        <div class="el-color-picker-input">
          <div class="el-color-picker-input-group">
            <span @click="colorFormatIndex = (colorFormatIndex + 1) % colorFormatMap.length">
              {{ colorFormatMap[colorFormatIndex] }}
            </span>
            <template v-if="colorFormatMap[colorFormatIndex] === 'hex'">
              <el-input
                v-model="input.hex"
                size="small"
                @keyup.enter="handleEnterInput('hex')"
                @blur="handleEnterInput('hex')"
              />
            </template>
            <template v-else-if="colorFormatMap[colorFormatIndex] === 'rgb'">
              <el-input
                v-model="input.rgb.r"
                size="small"
                @keyup.enter="handleEnterInput('rgb')"
                @blur="handleEnterInput('rgb')"
              />
              <el-input
                v-model="input.rgb.g"
                size="small"
                @keyup.enter="handleEnterInput('rgb')"
                @blur="handleEnterInput('rgb')"
              />
              <el-input
                v-model="input.rgb.b"
                size="small"
                @keyup.enter="handleEnterInput('rgb')"
                @blur="handleEnterInput('rgb')"
              />
              <el-input
                v-if="showAlpha"
                v-model="input.rgb.a"
                size="small"
                @keyup.enter="handleEnterInput('rgb')"
                @blur="handleEnterInput('rgb')"
              />
            </template>
            <template v-else-if="colorFormatMap[colorFormatIndex] === 'hsl'">
              <el-input
                v-model="input.hsl.h"
                size="small"
                @keyup.enter="handleEnterInput('hsl')"
                @blur="handleEnterInput('hsl')"
              />
              <el-input
                v-model="input.hsl.s"
                size="small"
                @keyup.enter="handleEnterInput('hsl')"
                @blur="handleEnterInput('hsl')"
              />
              <el-input
                v-model="input.hsl.l"
                size="small"
                @keyup.enter="handleEnterInput('hsl')"
                @blur="handleEnterInput('hsl')"
              />
              <el-input
                v-if="showAlpha"
                v-model="input.rgb.a"
                size="small"
                @keyup.enter="handleEnterInput('hsl')"
                @blur="handleEnterInput('hsl')"
              />
            </template>
          </div>
        </div>
        <div class="el-color-picker-predefine" v-if="predefine?.length">
          <div
            class="predefine-item"
            v-for="colorItem in predefine"
            :style="{ background: colorItem }"
            tabindex="0"
            @click="modelValue = colorItem"
          />
        </div>
      </div>
    </template>
  </el-tooltip>
</template>

<style lang="scss" scoped>
.easy-color-picker {
  position: relative;
  height: 24px;
  outline: none;

  .el-color-picker__trigger {
    width: auto;
    min-width: 32px;
    padding: 2px;

    .el-color-picker__color-inner span {
      width: 64px;
      padding: 2px;
      font-size: 12px;
    }
  }

  &.is-disabled .el-color-picker__trigger {
    cursor: not-allowed;
    background-color: var(--el-fill-color-light);

    .el-color-picker__color {
      opacity: 0.3;
    }
  }
}

.color-picker-dropdown {
  width: 225px;
  padding: 6px 0;
}

.el-color-picker-panel {
  position: relative;
  width: 225px;
  height: 225px;
  padding: 0;
  outline: none;
  background: linear-gradient(0deg, #000, #0000), linear-gradient(90deg, #fff, #0000);

  .el-color-picker-pointer {
    position: absolute;
    width: 6px;
    height: 6px;
    cursor: pointer;
    border-radius: 50%;
    box-shadow:
      0 0 0 1.5px #fff,
      inset 0 0 1px 1px rgb(0 0 0 / 30%),
      0 0 1px 2px rgb(0 0 0 / 40%);
    transform: translate(-50%, -50%);
  }
}

.el-color-picker-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;

  .color-picker-absorber {
    width: 20px;
    height: 20px;
    padding: 3px;
    margin-left: 3px;
    color: var(--el-text-color-regular);
    cursor: pointer;
    border-radius: 3px;

    &:hover,
    &:focus {
      background: rgb(128 128 128 / 15%);
    }
  }

  .sliders {
    display: flex;
    flex-direction: column;
    gap: 10px;

    input[type='range'] {
      position: relative;
      width: 180px;
      height: 12px;
      margin: 0 6px;
      appearance: none;
      outline: none;
      border-radius: 2px;

      &::-webkit-slider-thumb {
        position: relative;
        width: 4px;
        height: 15px;
        appearance: none;
        cursor: pointer;
        background: #fff;
        border: 1px solid var(--el-border-color-lighter);
        border-radius: 1px;
        box-shadow: 0 0 2px rgb(0 0 0 / 60%);
      }
    }

    input[type='range'].hue-slider {
      background: linear-gradient(
        to right,
        rgb(255 0 0) 0%,
        rgb(255 255 0) 17%,
        rgb(0 255 0) 33%,
        rgb(0 255 255) 50%,
        rgb(0 0 255) 67%,
        rgb(255 0 255) 83%,
        rgb(255 0 0) 100%
      );
    }

    input[type='range'].alpha-slider {
      background-image:
        linear-gradient(
          45deg,
          var(--el-color-picker-alpha-bg-a) 25%,
          var(--el-color-picker-alpha-bg-b) 25%
        ),
        linear-gradient(
          135deg,
          var(--el-color-picker-alpha-bg-a) 25%,
          var(--el-color-picker-alpha-bg-b) 25%
        ),
        linear-gradient(
          45deg,
          var(--el-color-picker-alpha-bg-b) 75%,
          var(--el-color-picker-alpha-bg-a) 75%
        ),
        linear-gradient(
          135deg,
          var(--el-color-picker-alpha-bg-b) 75%,
          var(--el-color-picker-alpha-bg-a) 75%
        );
      background-position:
        0 0,
        6px 0,
        6px -6px,
        0 6px;
      background-size: 12px 12px;

      --el-color-picker-alpha-bg-a: rgb(128 128 128 / 40%);
      --el-color-picker-alpha-bg-b: transparent;

      &::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        content: '';
        background: linear-gradient(to right, rgb(255 69 0 / 0%) 0%, gray 100%);
      }
    }
  }
}

.el-color-picker-input {
  .el-color-picker-input-group {
    display: flex;
    gap: 6px;

    /* stylelint-disable no-descending-specificity */
    span {
      padding: 0 6px;
      line-height: 23px;
      color: var(--el-text-color-regular);
      cursor: pointer;
      user-select: none;
      border-radius: 3px;

      &:hover {
        background: rgb(128 128 128 / 15%);
      }
    }

    .el-input {
      padding: 0;
      letter-spacing: 0.5px;
    }
  }
}

.el-color-picker-predefine {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, 18px);
  grid-gap: 9px;
  justify-content: center;
  padding: 12px 0 0;
  margin-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);

  .predefine-item {
    width: 18px;
    height: 18px;
    cursor: pointer;
    border-radius: 3px;
    box-shadow: rgb(128 128 128 / 30%) 0 0 0 1px inset;

    &:focus {
      filter: drop-shadow(rgb(128 128 128) 0 0 2px);
      transform: scale(1.1);
    }
  }
}
</style>

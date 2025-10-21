<script name="Slide" setup>
import { useI18n } from 'vue-i18n'

const props = defineProps({
  getData: {
    type: Function,
  },
  verify: {
    type: Function,
  },
  appendToBody: {
    type: Boolean,
    default: true,
  },
  autoClose: {
    type: Boolean,
    default: true,
  },
  autoRefresh: {
    type: Boolean,
    default: true,
  },
})

const emits = defineEmits(['success', 'error'])
const { t } = useI18n()

const visible = ref(false)
const loading = ref(true)
// 正在验证
const verifying = ref(false)
// 验证结果 { undefined: 未验证，true: 验证通过，false: 验证失败 }
const result = ref(undefined)
const isMouseDown = ref(false)
const originX = ref(0)
const originY = ref(0)
const x = ref(0)
const timestamp = ref(0)
const data = ref({
  img: '',
  width: 350,
  height: 200,
  block: '',
  blockWidth: 50,
  blockHeight: 50,
  y: 0,
  code: '',
})
const clickable = computed(() => !verifying.value && result.value === undefined)
const imgStyle = computed(() => ({
  width: `${data.value.width}px`,
  height: `${data.value.height}px`,
}))
const blockStyle = computed(() => {
  return {
    width: `${data.value.blockWidth}px`,
    height: `${data.value.blockHeight}px`,
    transform: `translate(${x.value}px, ${data.value.y}px)`,
    transition: isMouseDown.value ? '' : 'transform .2s',
  }
})
const trackColor = computed(() => {})

onMounted(() => {
  document.addEventListener('mousemove', handleMousemove)
  document.addEventListener('mouseup', handleMouseup)
})
onUnmounted(() => {
  document.removeEventListener('mousemove', handleMousemove)
  document.removeEventListener('mouseup', handleMouseup)
})

watch(visible, newVal => {
  reset()
  if (newVal) {
    getCaptcha()
  }
})

defineExpose({ refresh, test })

async function getCaptcha() {
  loading.value = true
  data.value = await props.getData()
  loading.value = false
  result.value = undefined
  originX.value = 0
  originY.value = 0
  x.value = 0
  timestamp.value = 0
}

async function validate() {
  if (result.value === undefined) {
    verifying.value = true
    try {
      await props.verify({
        code: data.value.code,
        x: x.value,
        timestamp: timestamp.value,
      })
      verifying.value = false
      result.value = true
      emits('success')
      if (props.autoClose) {
        // 自动关闭验证码
        setTimeout(() => {
          visible.value = false
        }, 1000)
      }
    } catch {
      verifying.value = false
      result.value = false
      emits('error')
      if (props.autoRefresh) {
        // 自动刷新验证码
        setTimeout(() => {
          refresh()
        }, 1000)
      }
    }
  }
}

function reset() {
  loading.value = true
  verifying.value = false
  result.value = undefined
  originX.value = 0
  originY.value = 0
  x.value = 0
  timestamp.value = 0
  data.value = {
    img: '',
    width: 350,
    height: 200,
    block: '',
    blockWidth: 50,
    blockHeight: 50,
    y: 0,
    code: '',
  }
}

function refresh() {
  if (!verifying.value && !result.value) {
    getCaptcha()
  }
}

function clickOverlay(e) {
  if (e.target.className === 'el-overlay') {
    visible.value = false
  }
}

function handleMousedown(e) {
  if (clickable.value) {
    isMouseDown.value = true
    originX.value = e.clientX
    originY.value = e.clientY
    timestamp.value = Date.now()
  }
}

function handleMousemove(e) {
  if (!isMouseDown.value) return false
  let moveX = e.clientX - originX.value
  if (moveX < 0 || moveX + 34 * 2 > 350) {
    return false
  } else {
    x.value = moveX
  }
}

function handleMouseup(e) {
  if (!isMouseDown.value || !clickable.value) return false
  isMouseDown.value = false
  if (e.clientX === originX.value) return false
  timestamp.value = Date.now() - timestamp.value
  validate()
}

function test() {
  visible.value = true
}
</script>

<template>
  <teleport :disabled="!appendToBody" to="body">
    <div :class="{ 'el-overlay': appendToBody }" v-if="visible" @click="clickOverlay">
      <div class="captcha-slide" onselectstart="return false">
        <h3 class="captcha-header">
          {{ t('captchaTitle') }}
          <div class="flex">
            <easy-button
              v-on-click-rotate
              v-prevent-reclick="500"
              :title="$t('common.refresh')"
              i="refresh"
              link
              @click="refresh"
            />
          </div>
        </h3>
        <div class="loading" v-if="loading" :style="imgStyle">{{ $t('message.loading') }}</div>
        <div class="relative" v-else>
          <img
            class="captcha-img"
            :src="data.img"
            :style="imgStyle"
            alt="captcha"
            draggable="false"
          />
          <img
            class="captcha-block"
            :src="data.block"
            :style="blockStyle"
            alt="block"
            draggable="false"
            @mousedown.left="handleMousedown"
          />
          <div class="captcha-overlay" v-if="result !== undefined">
            <div class="captcha-result">
              <svg-icon :icon="result ? 'check' : 'circle-close'" />
              <span>
                {{ result ? t('validateSuccess') : t('validateFailed') }}
              </span>
            </div>
          </div>
        </div>
        <div class="captcha-slider">
          <div
            class="captcha-slider-track"
            :style="{
              width: `${x + 64 * 0.5}px`,
              background: trackColor,
              transition: isMouseDown ? '' : 'width .2s',
            }"
          />
          <div class="captcha-slider-tips shine-text">{{ t('captchaSliderTip') }}</div>
          <div
            class="captcha-slider-block"
            :style="{
              transform: `translateX(${x}px)`,
              transition: isMouseDown ? '' : 'transform .2s',
            }"
            @mousedown.left="handleMousedown"
          >
            <svg-icon icon="arrow-right-double" />
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.el-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
}

.captcha-slide {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-extra-light);
  border-radius: 10px;
  box-shadow: var(--el-box-shadow-lighter);

  .captcha-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    cursor: default;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--el-color-info);
  }

  .captcha-img {
    display: block;
    cursor: default;
    user-select: none;
    border: none;
  }

  .captcha-block {
    position: absolute;
    top: 0;
    left: 0;
    width: 68px;
    height: 64px;
    cursor: pointer;
    user-select: none;
  }

  .captcha-overlay {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: rgb(0 0 0 / 70%);

    .captcha-result {
      display: flex;
      flex-direction: column;
      gap: 5px;
      align-items: center;

      svg {
        width: 30px;
        height: 30px;
        color: #eee;
      }

      span {
        color: #eee;
      }
    }
  }

  .captcha-slider {
    position: relative;
    height: 40px;
    margin-top: 5px;
    background: rgb(128 128 128 / 10%);

    .captcha-slider-track {
      position: absolute;
      top: 0;
      left: 0;
      box-sizing: border-box;
      width: 0;
      height: 100%;
      border-radius: 4px;
    }

    .captcha-slider-tips {
      position: absolute;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding-bottom: 4px;
      font-size: 0.12em;
      color: var(--el-color-info);
      cursor: default;
      user-select: none;
      background-clip: text !important;

      &.shine-text {
        color: transparent;

        /* prettier-ignore */
        background:
          radial-gradient(circle at center, var(--el-color-info-light-7), transparent) -200% 50% / 200% 100% no-repeat,
          var(--el-color-info);
        background-clip: text !important;
        animation: 2s linear 0s infinite normal none running shine;

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
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 34px;
      margin: 3px;
      cursor: pointer;
      background: var(--el-bg-color);
      border-radius: 4px;
      box-shadow: 0 0 2px 0 rgb(0 0 0 / 20%);

      svg {
        color: var(--el-text-color-regular);
      }
    }
  }
}
</style>

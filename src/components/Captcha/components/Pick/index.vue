<script name="Pick" setup>
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
const data = ref({
  width: 350,
  height: 200,
  img: '',
  options: [],
  code: '',
})
const pointSize = 20
const points = ref([])
const clickable = computed(() => !verifying.value && result.value === undefined)
const imgStyle = computed(() => ({
  width: `${data.value.width}px`,
  height: `${data.value.height}px`,
}))

watch(visible, newVal => {
  reset()
  if (newVal) {
    getCaptcha()
  }
})

defineExpose({ refresh, test })

function clickOverlay(e) {
  if (e.target.className === 'el-overlay') {
    visible.value = false
  }
}

async function getCaptcha() {
  loading.value = true
  data.value = await props.getData()
  loading.value = false
  result.value = undefined
  points.value = []
}

function reset() {
  loading.value = true
  verifying.value = false
  result.value = undefined
  points.value = []
  data.value = {
    width: 350,
    height: 200,
    img: '',
    options: [],
    code: '',
  }
}

function onRecord(e) {
  if (points.value.length < data.value.options?.length && clickable.value) {
    points.value.push({
      x: e.offsetX,
      y: e.offsetY,
      t: Date.now(),
    })
  }
}

function onCancelRecord(index) {
  if (clickable.value) {
    points.value.splice(index, 1)
  }
}

function refresh() {
  if (!verifying.value && !result.value) {
    getCaptcha()
  }
}

async function validate() {
  if (result.value === undefined) {
    verifying.value = true
    try {
      await props.verify({
        points: points.value,
        code: data.value.code,
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

function test() {
  visible.value = true
}
</script>

<template>
  <teleport :disabled="!appendToBody" to="body">
    <div :class="{ 'el-overlay': appendToBody }" v-if="visible" @click="clickOverlay">
      <div class="captcha-pick">
        <h3 class="captcha-header">
          {{ t('captchaTitle') }}
          <div class="flex items-center">
            <el-button v-click-rotate v-prevent-reclick="500" :title="$t('common.refresh')" link>
              <svg-icon icon="refresh" @click="refresh" />
            </el-button>
            <easy-button type="primary" t="common.confirm" size="small" @click="validate" />
          </div>
        </h3>
        <div class="loading" v-if="loading" :style="imgStyle">{{ $t('message.loading') }}</div>
        <div class="relative" v-else>
          <img
            class="captcha-img"
            :style="imgStyle"
            :src="data.img"
            alt="captcha"
            @click.prevent="onRecord($event)"
          />
          <span
            class="point"
            v-for="(point, index) in points"
            :style="{
              width: `${pointSize}px`,
              height: `${pointSize}px`,
              left: `${point.x - pointSize / 2}px`,
              top: `${point.y - pointSize / 2}px`,
            }"
            @click="onCancelRecord(index)"
          >
            {{ index + 1 }}
          </span>
        </div>
        <div class="captcha-prompt">
          <template v-if="result !== undefined">
            {{ result ? t('validateSuccess') : t('validateFailed') }}
          </template>
          <template v-else>
            <span class="mr-4px">{{ t('successTip') }}</span>
            <span class="option" v-for="option in data.options" :key="option">
              {{ option }}
            </span>
          </template>
        </div>
      </div>
    </div>
  </teleport>
</template>

<i18n src="./locales/en.json" locale="en" />
<i18n src="./locales/zh-CN.json" locale="zh-CN" />

<style lang="scss" scoped>
.el-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
}

.captcha-pick {
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
    cursor: pointer;
    border: none;
  }

  .point {
    position: absolute;
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    font-size: var(--el-font-size-small);
    font-weight: bold;
    line-height: 19px;
    color: var(--el-color-white);
    text-align: center;
    cursor: pointer;
    user-select: none;
    background-color: var(--el-color-primary);
    border: 1px solid #f2f6fc;
    border-radius: 50%;
    box-shadow: 0 0 10px var(--el-color-white);
  }

  .captcha-prompt {
    font-size: var(--el-font-size-base);
    color: var(--el-color-info);
    text-align: center;

    .option {
      margin-left: 10px;
      font-size: var(--el-font-size-medium);
      font-weight: bold;
      color: var(--el-color-error);
    }
  }
}
</style>

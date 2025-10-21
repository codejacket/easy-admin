<script name="AvatarUpload" setup>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'
import { debounce } from 'lodash-es'
import modal from '@plugins/modal'
import { $t } from '@/locales'

const imgUrl = defineModel('imgUrl', { type: String, default: '' })

const img = ref('')

const previewImg = ref('')

// 是否显示弹出层
const open = ref(false)

const imgRef = useTemplateRef('imgRef')

const cropperRef = ref()

const getPreviewImg = debounce(() => {
  previewImg.value = unref(cropperRef)?.getCroppedCanvas()?.toDataURL() ?? ''
}, 80)

function openDialog() {
  open.value = true
  img.value = unref(imgUrl)
}

function openedDialog() {
  const imgEl = unref(imgRef)
  if (imgEl) {
    cropperRef.value = new Cropper(imgEl, {
      aspectRatio: 1,
      viewMode: 1,
      dragMode: 'move',
      // cropBoxResizable: false,
      // cropBoxMovable: false,
      toggleDragModeOnDblclick: false,
      checkCrossOrigin: false,
      ready() {},
      cropmove() {
        getPreviewImg()
      },
      zoom() {
        getPreviewImg()
      },
      crop() {
        getPreviewImg()
      },
    })
  }
}

function closeDialog() {
  open.value = false
}

function closedDialog() {
  unref(cropperRef)?.destroy()
}

function confirm() {
  imgUrl.value = previewImg.value
}

function zoom(num) {
  unref(cropperRef)?.zoom(num)
}

const scaleX = ref(1)
const scaleY = ref(1)
function scale(type) {
  if (type === 'scaleX') {
    scaleX.value = scaleX.value === 1 ? -1 : 1
    unref(cropperRef)?.[type](unref(scaleX))
  } else {
    scaleY.value = scaleY.value === 1 ? -1 : 1
    unref(cropperRef)?.[type](unref(scaleY))
  }
}

function rotate(deg) {
  unref(cropperRef)?.rotate(deg)
}

function reset() {
  unref(cropperRef)?.reset()
}

function httpRequest() {}

// 上传预处理
function beforeUpload(file) {
  if (file.type.includes('image/')) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      unref(cropperRef)?.replace((img.value = reader.result))
    }
  } else {
    modal.message.error($t('message.fileFormatError'))
  }
}
</script>

<template>
  <div class="avatar-upload" :title="$t('common.clickUploadAvatar')" @click="openDialog">
    <el-avatar class="avatar" :src="imgUrl" alt="avatar">
      <img src="@/assets/img/default-avatar.png" />
    </el-avatar>
    <easy-dialog
      width="800px"
      v-model="open"
      :confirm="confirm"
      :showFullscreen="false"
      title="更换头像"
      append-to-body
      @opened="openedDialog"
      @close="closeDialog"
      @closed="closedDialog"
    >
      <div class="img-container">
        <div class="max-w-60% h100% overflow-hidden">
          <img :src="img" ref="imgRef" crossorigin="anonymous" alt="" srcset="" />
        </div>
        <img class="rounded-full w200px h200px" :src="previewImg" />
      </div>
      <div class="flex justify-center items-center gap12px">
        <el-upload
          :http-request="httpRequest"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <easy-button class="upload-btn" i="upload" t="upload" />
        </el-upload>
        <el-tooltip :content="$t('zoomIn')" :show-after="300" placement="top">
          <easy-button i="zoom-in" @click="zoom(0.1)" />
        </el-tooltip>
        <el-tooltip :content="$t('zoomOut')" :show-after="300" placement="top">
          <easy-button i="zoom-out" @click="zoom(-0.1)" />
        </el-tooltip>
        <el-tooltip :content="$t('flipY')" :show-after="300" placement="top">
          <easy-button i="resize-horizontal" @click="scale('scaleX')" />
        </el-tooltip>
        <el-tooltip :content="$t('flipX')" :show-after="300" placement="top">
          <easy-button i="resize-vertical" @click="scale('scaleY')" />
        </el-tooltip>
        <el-tooltip :content="$t('rotateLeft')" :show-after="300" placement="top">
          <easy-button i="refresh-left" @click="rotate(-90)" />
        </el-tooltip>
        <el-tooltip :content="$t('rotateRight')" :show-after="300" placement="top">
          <easy-button i="refresh-right" @click="rotate(90)" />
        </el-tooltip>
        <el-tooltip :content="$t('reset')" :show-after="300" placement="top">
          <easy-button i="refresh" @click="reset" />
        </el-tooltip>
      </div>
    </easy-dialog>
  </div>
</template>

<style lang="scss" scoped>
.avatar-upload {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;

  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: var(--el-box-shadow-lighter);
  }

  &:hover::after {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 25px;
    font-style: normal;
    color: hsl(0deg 0% 93%);
    cursor: pointer;
    content: '+';
    background: rgb(0 0 0 / 30%);
    border-radius: 50%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

.img-container {
  display: flex;
  gap: 30px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 360px;
  padding-top: 6px;
  margin-bottom: 24px;
}
</style>

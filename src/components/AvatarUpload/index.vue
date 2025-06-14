<template>
    <div class="avatar-upload" :title="$t('clickUploadAvatar')" @click="openDialog">
        <el-avatar class="avatar" :src="img" alt="avatar">
            <img src="@/assets/img/default-avatar.png" />
        </el-avatar>
        <el-dialog class="avatar-upload-dialog" :title="$t('changeAvatar')" v-model="open" width="400px" append-to-body
            @opened="openDialog" @close="closeDialog">
            <div class="cropper-container">
                <vue-cropper
                    ref="cropperRef"
                    v-if="visible" 
                    :img="options.img" 
                    :autoCrop="options.autoCrop"
                    :autoCropWidth="options.autoCropWidth" 
                    :autoCropHeight="options.autoCropHeight"
                    :fixedBox="options.fixedBox"
                    :outputType="options.outputType"
                    @realTime="realTime" />
            </div>
            <div class="btn-group">
                <el-upload :http-request="httpRequest" :show-file-list="false" :before-upload="beforeUpload">
                    <easy-button class="upload-btn" i="upload" t="upload" />
                </el-upload>
                <el-tooltip :content="$t('zoomIn')" placement="top" :show-after="300">
                    <easy-button i="zoom-in" @click="changeScale(1)" />
                </el-tooltip>
                <el-tooltip :content="$t('zoomOut')" placement="top" :show-after="300">
                    <easy-button i="zoom-out" @click="changeScale(-1)" />
                </el-tooltip>
                <el-tooltip :content="$t('rotateLeft')" placement="top" :show-after="300">
                    <easy-button i="refresh-left" @click="rotateLeft" />
                </el-tooltip>
                <el-tooltip :content="$t('rotateRight')" placement="top" :show-after="300">
                    <easy-button i="refresh-right" @click="rotateRight" />
                </el-tooltip>
            </div>
            <template #footer>
                <easy-button t="common.cancel" auto-insert-space @click="closeDialog" />
                <easy-button type="primary" t="common.confirm" auto-insert-space @click="confirm" />
            </template>
        </el-dialog>
    </div>
</template>

<i18n locale="en" src="./locales/en.json"></i18n>
<i18n locale="zh" src="./locales/zh.json"></i18n>

<script>
import { VueCropper } from "vue-cropper"
import 'vue-cropper/dist/index.css'

export default {
    name: 'AvatarUpload',
    components: { VueCropper },
    props: {
        img: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            // 是否显示弹出层
            open: false,
            // 是否显示cropper
            visible: false,
            // VueCropper 配置
            options: {
                // 裁剪图片的地址
                img: '',
                // 是否默认生成截图框
                autoCrop: true,
                // 默认生成截图框宽度
                autoCropWidth: 200,
                // 默认生成截图框高度
                autoCropHeight: 200,
                // 固定截图框大小 不允许改变
                fixedBox: true,
                // 默认生成截图为PNG格式
                outputType: "png",
            },
            // 预览图片
            previews: {}
        }
    },
    methods: {
        // 打开弹出层
        openDialog() {
            this.open = true
            this.visible = true
            this.options.img = this.img
        },
        // 关闭弹出层
        closeDialog() {
            this.visible = false
            this.open = false
            this.options.img = ''
        },
        // 刷新组件
        refresh() {
            this.$refs['cropperRef'].refresh()
        },
        // 覆盖默认的上传行为
        httpRequest() { },
        // 上传预处理
        beforeUpload(file) {
            if (file.type.includes('image/')) {
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = () => {
                    this.options.img = reader.result
                }
            } else {
                this.$modal.message.error(this.$t('message.fileFormatError'))
            }
        },
        // 图片缩放
        changeScale(num) {
            num ||= 1
            this.$refs['cropperRef'].changeScale(num)
        },
        // 向左旋转
        rotateLeft() {
            this.$refs['cropperRef'].rotateLeft()
        },
        // 向右旋转
        rotateRight() {
            this.$refs['cropperRef'].rotateRight()
        },
        // 实时预览
        realTime(data) {
            this.previews = data
        },
        // 确定按钮
        confirm() {
            this.$refs['cropperRef'].getCropData(data => {
                this.$emit('update:img', data)
            })
            this.closeDialog()
        }
    }
}
</script>

<style lang="scss">
.dark .vue-cropper {
    filter: brightness(0.8);
}

.avatar-upload {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    position: relative;

    .avatar {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        box-shadow: var(--el-box-shadow-lighter);
    }

    &:hover::after {
        content: "+";
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.3);
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        color: hsl(0, 0%, 93%);
        font-size: 25px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        cursor: pointer;
    }
}

.avatar-upload-dialog {
    .cropper-container {
        height: 350px;
    }

    .btn-group {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        gap: 12px;

        .el-button {
            margin: 0;
        }
    }
}
</style>
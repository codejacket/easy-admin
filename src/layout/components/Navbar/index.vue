<script name="Navbar" setup>
import { useSettingsStore } from '@store/settings'
import Avatar from './Avatar'

const tools = import.meta.glob('./Toolbar/*/index.vue')
const navTools = Object.keys(tools).reduce((acc, path) => {
  let key = path.split('/').at(-2)
  acc[key] = defineAsyncComponent(tools[path])
  return acc
}, {})

const { navToolbar } = storeToRefs(useSettingsStore())
const props = defineProps({
  height: {
    type: Number,
    default: 50,
  },
})
</script>

<template>
  <div class="navbar-container" :style="{ height: `${height}px` }">
    <div class="left-side">
      <slot />
    </div>
    <div class="right-side">
      <template v-for="item in navToolbar" :key="item">
        <component class="nav-tool" v-if="item.show" :is="navTools[item.is]" />
      </template>
      <el-divider direction="vertical" />
      <Avatar>
        <template #default="{ src, username }">
          <div class="avatar-wrapper">
            <el-avatar :size="28" :src="src" alt="avatar">
              <img src="@/assets/img/default-avatar.png" />
            </el-avatar>
            <span>{{ username }}</span>
            <svg-icon icon="R" />
          </div>
        </template>
      </Avatar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar-container {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  overflow: hidden;
  background: var(--navbar-bg);
  box-shadow: var(--el-box-shadow-lighter);
  transition: height 0.28s;

  .left-side {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .right-side {
    display: flex;
    flex-shrink: 0;
    gap: 16px;
    align-items: center;
    height: 100%;
    padding-right: 12px;
    margin-left: 16px;

    .nav-tool {
      font-size: 18px;
      color: var(--navbar-text-color);
      cursor: pointer;
    }

    .hover-shake:hover {
      animation: shake 0.5s ease-in-out;
    }

    .hover-expand:hover {
      animation: expand 0.5s forwards;
    }

    .hover-shrink:hover {
      animation: shrink 0.5s forwards;
    }

    .hover-move-up:hover {
      animation: move-up 0.5s;
    }

    .el-divider {
      height: 22px;
      margin-right: -6px;
      margin-left: -2px;
      border-color: var(--navbar-text-color);
      border-left-width: 1px;
      opacity: 0.4;
    }

    @keyframes shake {
      0%,
      100% {
        transform: rotate(0);
      }

      25% {
        transform: rotate(-10deg);
      }

      75% {
        transform: rotate(10deg);
      }
    }

    @keyframes expand {
      0% {
        transform: scale(1);
      }

      50% {
        transform: scale(1.1);
      }

      100% {
        transform: scale(1);
      }
    }

    @keyframes shrink {
      0% {
        transform: scale(1);
      }

      50% {
        transform: scale(0.9);
      }

      100% {
        transform: scale(1);
      }
    }

    @keyframes move-up {
      0% {
        transform: translateY(0);
      }

      50% {
        transform: translateY(-2px);
      }

      100% {
        transform: translateY(0);
      }
    }

    .avatar-wrapper {
      display: flex;
      align-items: center;
      color: var(--navbar-text-color);
      cursor: pointer;

      .el-avatar {
        box-sizing: border-box;
        width: 28px;
        height: 28px;
        margin-right: 5px;
        border-radius: 50%;
        transition: all 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
      }

      span {
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      svg {
        color: var(--navbar-text-color);
        transition: var(--el-transition-duration);
      }

      &:hover {
        .el-avatar {
          box-shadow: 0 0 0 3px rgb(168 168 168 / 18%);
        }

        span {
          color: var(--el-color-primary);
        }

        svg {
          color: var(--el-color-primary);
        }
      }

      &[aria-expanded='true'] {
        svg {
          transform: rotate(90deg);
        }
      }
    }
  }
}
</style>

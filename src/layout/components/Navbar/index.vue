<template>
  <div class="navbar-container" :style="{ height: `${header.height}px` }">
    <div class="left-side">
      <slot />
    </div>
    <div class="right-side">
      <template v-for="item in navToolbar" :key="item">
        <component :is="require(`@/components/${item.is}`).default" v-if="item.show" />
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

<script>
import { useSettingsStore } from '@store/settings'
import { mapState } from 'pinia'

import Avatar from "./Avatar"

export default {
  name: "Navbar",
  components: { Avatar },
  computed: {
    ...mapState(useSettingsStore, ["header", "navToolbar"])
  }
}
</script>

<style lang="scss" scoped>
  .navbar-container {
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    background: var(--navbar-bg);
    box-shadow: var(--el-box-shadow-lighter);
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    position: relative;
    z-index: 1;

    .left-side {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      overflow: hidden;
    }

    .right-side {
      height: 100%;
      margin-left: 16px;
      padding-right: 12px;
      line-height: 50px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 16px;

      .el-divider {
        height: 22px;
        margin-left: -2px;
        margin-right: -6px;
        opacity: 0.4;
        border-left-width: 1px;
        border-color: var(--navbar-icon-fill-color);
      }

      .avatar-wrapper {
        display: flex;
        align-items: center;
        color: var(--navbar-icon-fill-color);
        cursor: pointer;

        .el-avatar {
          width: 28px;
          height: 28px;
          margin-right: 5px;
          border-radius: 50%;
          box-sizing: border-box;
          transition: all 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        span {
          max-width: 100px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        svg {
          color: var(--navbar-icon-fill-color);
          transition: var(--el-transition-duration);
        }

        &:hover {
          .el-avatar {
            box-shadow: 0 0 0 3px rgba(168, 168, 168, 0.18);
          }

          span {
            color: var(--el-color-primary);
          }

          svg {
            color: var(--el-color-primary);
          }
        }

        &[aria-expanded="true"] {
          svg {
            transform: rotate(90deg);
          }
        }
      }
    }
  }
</style>

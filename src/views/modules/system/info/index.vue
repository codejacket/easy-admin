<script name="Info" setup>
import { getInfo } from '@api/system/info'

const data = ref({
  info: {},
  cpu: {},
  memory: {},
  jvm: {},
  dir: [],
})

created()

async function created() {
  const res = await getInfo()
  data.value = res.data
}

function round(num) {
  return Math.round(num * 100) / 100 || 0
}

function getProgressColor(n) {
  return n < 90 ? 'var(--el-color-primary)' : 'var(--el-color-danger)'
}
</script>

<template>
  <div class="m20px">
    <el-row>
      <el-col class="app-card p12px" :span="24">
        <div class="card-title">
          <svg-icon icon="screen" />
          系统信息
        </div>
        <div class="el-table el-table--enable-row-hover">
          <table class="w-100%" cellspacing="0">
            <tbody>
              <tr>
                <td class="el-table__cell is-leaf">
                  <div class="cell">服务器名称</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">{{ data.info.serviceName }}</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">操作系统</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">{{ data.info.os }}</div>
                </td>
              </tr>
              <tr>
                <td class="el-table__cell is-leaf">
                  <div class="cell">服务器IP</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">{{ data.info.serviceIp }}</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">系统架构</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">{{ data.info.arch }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-col>
    </el-row>
    <br />
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="app-card p12px">
          <div class="card-title">
            <svg-icon icon="cpu" />
            CPU信息
          </div>
          <div class="flex p16px justify-center">
            <el-progress
              :percentage="data.cpu.userUsage"
              :color="getProgressColor(data.cpu.userUsage)"
              type="circle"
            />
          </div>
          <div class="el-table el-table--enable-row-hover">
            <table class="w-100%" cellspacing="0">
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">核心数</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ data.cpu.cores }}</div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">用户使用率</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ data.cpu.userUsage }}%</div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">系统使用率</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ data.cpu.sysUsage }}%</div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">当前空闲率</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ data.cpu.freeUsage }}%</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="app-card p12px">
          <div class="card-title">
            <svg-icon icon="notes" />
            内存信息
          </div>
          <div class="flex p16px justify-center">
            <el-progress
              :percentage="round((100 * data.memory.used) / data.memory.total)"
              :color="getProgressColor(round((100 * data.memory.used) / data.memory.total))"
              type="circle"
            />
          </div>
          <div class="el-table el-table--enable-row-hover">
            <table class="w-100%" cellspacing="0">
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">总内存</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ data.memory.total }}GB</div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">已用内存</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ data.memory.used }}GB</div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">剩余内存</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ data.memory.free }}GB</div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">使用率</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ data.memory.usage }}%</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="app-card p12px">
          <div class="card-title">JVM信息</div>
          <div class="flex p16px justify-center">
            <el-progress
              :percentage="round((100 * data.jvm.used) / data.jvm.total)"
              :color="getProgressColor(round((100 * data.jvm.used) / data.jvm.total))"
              type="circle"
            />
          </div>
          <div class="el-table el-table--enable-row-hover">
            <table class="w-100%" cellspacing="0">
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">jdk版本</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ data.jvm.version }}</div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">总内存</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ data.jvm.total }}MB</div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">已用内存</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ data.jvm.used }}MB</div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">剩余内存</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ data.jvm.free }}MB</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </el-col>
    </el-row>
    <br />
    <div class="app-card p12px">
      <div class="card-title">
        <svg-icon icon="cloud-storage" />
        磁盘状态
      </div>
      <el-table :data="data.dir">
        <el-table-column prop="dirPath" label="盘符路径" />
        <el-table-column prop="sysType" label="文件系统" />
        <el-table-column prop="dirType" label="盘符类型" />
        <el-table-column prop="total" label="总大小" />
        <el-table-column prop="used" label="已用大小" />
        <el-table-column prop="free" label="可用大小" />
        <el-table-column prop="usage" label="已用百分比" />
      </el-table>
    </div>
  </div>
</template>

<i18n src="./locales/en.json" locale="en" />
<i18n src="./locales/zh-CN.json" locale="zh-CN" />

<style lang="scss" scoped>
.card-title {
  padding: 0 8px 8px;
  color: var(--el-text-color-regular);
  border-bottom: 1px solid var(--el-border-color-lighter);
}
</style>

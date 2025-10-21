<script name="QueryEditer" setup>
import { isPlainObject, debounce } from 'lodash-es'

const modelValue = defineModel()
const query = ref([])

watch(
  modelValue,
  val => {
    try {
      let v = JSON.parse(val)
      if (isPlainObject(v)) {
        query.value = Object.entries(v).reduce((acc, [key, value]) => {
          acc.push({ key, value })
          return acc
        }, [])
      } else {
        query.value = []
      }
    } catch {
      query.value = []
    }
  },
  { immediate: true },
)

const handleInput = debounce(val => {
  modelValue.value = JSON.stringify(
    query.value
      .filter(item => item.key)
      .reduce((acc, { key, value }) => {
        acc[key] = value
        return acc
      }, {}),
  )
}, 300)

function addQuery(index = 0) {
  query.value.splice(index, 0, { key: '', value: '' })
}

function removeQuery(index) {
  query.value.splice(index, 1)
}
</script>

<template>
  <easy-button
    class="w-full border-dashed"
    v-if="!query?.length"
    t="common.add"
    i="plus"
    @click="addQuery"
  />
  <div class="flex flex-col gap-6px" v-else>
    <div class="flex gap-6px" v-for="(item, index) in query">
      <el-input v-model="item.key" placeholder="请输入路由参数Key" @input="handleInput" />
      <el-input v-model="item.value" placeholder="请输入路由参数Value" @input="handleInput" />
      <easy-button i="plus" @click="addQuery(index + 1)" />
      <easy-button style="margin-left: 0" i="minus" @click="removeQuery(index)" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

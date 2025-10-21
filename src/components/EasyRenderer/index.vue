<script name="EasyRenderer" lang="jsx" setup>
import { isVNode } from 'vue'
import EasyRenderer from './index.vue'

const props = defineProps({
  items: {
    type: null,
    default: [],
  },
  itemProps: {
    type: Object,
  },
})

function render(item) {
  if (isVNode(item)) {
    return item
  } else {
    return <easy-renderer items={item} />
  }
}
</script>

<template>
  <template v-if="typeof items === 'function'" v-for="item in [].concat(items(itemProps))">
    <component :is="render(item)" />
  </template>
  <template v-for="item in [].concat(items)" v-else-if="typeof items === 'object'">
    <component v-bind="item.props" :is="item.name">
      <template v-for="(_item, name) in item.children" #[name]="slotProps">
        <easy-renderer :item="_item" :item-props="slotProps" />
      </template>
    </component>
  </template>
  <template v-else>
    {{ items }}
  </template>
</template>

<script name="HighlightCode" setup>
import { useSettingsStore } from '@store/settings'
import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/atom-one-light.css'

// 注册语言
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'

hljs.registerLanguage('java', java)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('vue', xml)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('sql', sql)

const props = defineProps({
  code: {
    type: String,
  },
  lang: {
    type: String,
  },
})

const { system } = storeToRefs(useSettingsStore())

const highlightedCode = computed(() => {
  try {
    return hljs.highlight(props.code, { language: props.lang || 'html' }).value || '&nbsp;'
  } catch (e) {
    return props.code
  }
})

watch(
  () => system.value.light,
  async light => {
    // 移除掉旧的style
    document.head.querySelector('style#hljs')?.remove?.()
    // 引入新的style
    const style = document.head.appendChild(document.createElement('style'))
    style.id = 'hljs'
    // 动态加载css
    style.innerHTML = light
      ? await import('highlight.js/styles/atom-one-light.css?raw').default
      : await import('highlight.js/styles/atom-one-dark.css?raw').default
  },
  { immediate: true },
)
</script>

<template>
  <pre class="hljs-container">
    <ul class="hljs-line-number">
        <li v-for="(_, index) in code.split('\n')" :key="index">{{ index + 1 }}</li>
    </ul>
    <code class="hljs" v-html="highlightedCode" />
  </pre>
</template>

<style lang="scss" scoped>
.hljs-container {
  display: flex;
  align-items: flex-start;

  .hljs-line-number {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 1em 0;
    font-size: 14px;
    line-height: 24px;
    user-select: none;
    list-style: none;
    opacity: 0.7;
  }

  .hljs {
    line-height: 24px;
    background: transparent;

    &::-webkit-scrollbar {
      height: 10px;
    }

    &::-webkit-scrollbar-thumb {
      cursor: pointer;
      background: rgb(128 128 128 / 20%);
      background-clip: content-box;
      border: 2px solid transparent;
      border-radius: 19px;

      &:hover {
        background: rgb(128 128 128 / 30%);
      }
    }
  }
}
</style>

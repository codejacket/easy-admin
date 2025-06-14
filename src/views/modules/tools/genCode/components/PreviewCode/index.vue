<template>
    <easy-dialog title="预览代码" width="80%" height="80vh" :scroll="false" destroy-on-close>
        <div class="preview-code-container">
            <el-splitter>
                <el-splitter-panel size="225px" min="180px" max="360px" collapsible>
                    <el-scrollbar class="left-panel">
                        <el-tree :data="data" :props="treeProps" :indent="14" highlight-current
                            @node-click="handleNodeClick" />
                    </el-scrollbar>
                </el-splitter-panel>
                <el-splitter-panel>
                    <el-scrollbar class="right-panel">
                        <pre class="hljs-container">
                            <ul class="hljs-line-number">
                                <li v-for="(_, index) in content.split('\n')" :key="index">{{ index + 1 }}</li>
                            </ul>
                            <code class="hljs" v-html="highlightedCode(content, lang)" />
                        </pre>
                        <easy-button class="copy-button" i="copy" t="common.copy" size="small" v-clipboard="content" />
                    </el-scrollbar>
                </el-splitter-panel>
            </el-splitter>
        </div>
    </easy-dialog>
</template>

<script>
import { findFirstLeafNode } from '@/utils/tree'
import { useSettingsStore } from '@store/settings'
import { mapState } from 'pinia'
import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/atom-one-light.css'

hljs.registerLanguage("java", require("highlight.js/lib/languages/java"))
hljs.registerLanguage("xml", require("highlight.js/lib/languages/xml"))
hljs.registerLanguage("html", require("highlight.js/lib/languages/xml"))
hljs.registerLanguage("vue", require("highlight.js/lib/languages/xml"))
hljs.registerLanguage("js", require("highlight.js/lib/languages/javascript"))
hljs.registerLanguage("ts", require("highlight.js/lib/languages/typescript"))
hljs.registerLanguage("sql", require("highlight.js/lib/languages/sql"))

export default {
    name: 'PreviewCode',
    props: {
        data: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            content: '',
            lang: '',
            treeProps: {
                class: data => data.isPenultimate ? 'is-penultimate' : ''
            }
        }
    },
    computed: {
        ...mapState(useSettingsStore, ['light'])
    },
    methods: {
        handleNodeClick(node) {
            if (!node.children) {
                this.setCodeAndType(node)
            }
        },
        setCodeAndType(node) {
            if (node) {
                this.content = node.content || ''
                this.lang = node.label.split('.').filter(item => !item.includes('.vm')).pop()
            }
        },
        // 高亮显示
        highlightedCode(content, lang) {
            try {
                return hljs.highlight(content, { language: lang || 'html' }).value || '&nbsp;'
            } catch (e) {
                return content
            }
        }
    },
    watch: {
        data: {
            immediate: true,
            handler(val) {
                this.setCodeAndType(findFirstLeafNode(val))
            }
        },
        light: {
            immediate: true,
            async handler(light) {
                // 移除掉旧的style
                document.head.querySelector("style#hljs")?.remove?.()
                // 引入新的style
                const style = document.head.appendChild(document.createElement('style'))
                style.id = 'hljs'
                // 动态加载css
                style.innerHTML = light ? require('!!raw-loader!highlight.js/styles/atom-one-light.css').default :
                    require('!!raw-loader!highlight.js/styles/atom-one-dark.css').default
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.preview-code-container {
    height: 100%;
    display: flex;

    .left-panel {
        padding-right: 12px;

        .el-tree.el-tree--highlight-current {
            :deep(.el-tree-node.is-current>.el-tree-node__content) {
                padding-right: 5px;
                border-radius: 3px;
                border: 1px solid var(--el-color-primary-light-8);

                .el-tree-node__label {
                    color: var(--el-color-primary);
                }
            }
        }
    }

    .right-panel {
        width: 100%;
        height: 100%;
        flex: auto;
        position: relative;

        :deep(.el-scrollbar__view) {
            padding-left: 12px;

            .hljs-container {
                display: flex;
                align-items: flex-start;

                .hljs-line-number {
                    padding: 1em 0;
                    list-style: none;
                    font-size: 14px;
                    line-height: 24px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    user-select: none;
                    opacity: 0.7;
                }

                .hljs {
                    background: transparent;
                    line-height: 24px;

                    &::-webkit-scrollbar {
                        height: 10px;
                    }

                    &::-webkit-scrollbar-thumb {
                        background: rgba(128, 128, 128, 0.2);
                        background-clip: content-box;
                        border: 2px solid transparent;
                        border-radius: 19px;
                        cursor: pointer;

                        &:hover {
                            background: rgba(128, 128, 128, 0.3);
                        }
                    }
                }
            }
        }

        .copy-button {
            position: absolute;
            right: 16px;
            top: 0;
        }
    }
}
</style>
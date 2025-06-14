<template>
    <div class="app-container m20">
        <el-scrollbar class="scrollbar">
            <div class="container" ref="containerRef">
                <h2 id="props">Props</h2>
                <el-table :data="props" stripe border>
                    <el-table-column prop="name" label="属性名" width="200"></el-table-column>
                    <el-table-column prop="desc" label="说明" min-width="200"></el-table-column>
                    <el-table-column prop="type" label="类型">
                        <template #default="{ row }">
                            <el-breadcrumb separator="|">
                                <el-breadcrumb-item v-for="{ type } in row.type">
                                    <el-tag type="primary">{{ type }}</el-tag>
                                </el-breadcrumb-item>
                            </el-breadcrumb>
                        </template>
                    </el-table-column>
                    <el-table-column prop="default" label="默认值"></el-table-column>
                </el-table>
                <br>
                <el-divider />
                <h2 id="events">Events</h2>
                <el-table :data="events" stripe border>
                    <el-table-column prop="name" label="事件名" width="200"></el-table-column>
                    <el-table-column prop="desc" label="说明" min-width="200"></el-table-column>
                    <el-table-column prop="type" label="类型" width="368"></el-table-column>
                </el-table>
                <br>
                <el-divider />
                <h2 id="slots">Slots</h2>
                <el-table :data="slots" stripe border>
                    <el-table-column prop="name" label="插槽名" width="200"></el-table-column>
                    <el-table-column prop="desc" label="说明" min-width="200"></el-table-column>
                    <el-table-column prop="type" label="类型" width="368"></el-table-column>
                </el-table>
                <br>
                <el-divider />
                <h2 id="methods">Methods</h2>
                <el-table :data="methods" stripe border>
                    <el-table-column prop="name" label="方法名" width="200"></el-table-column>
                    <el-table-column prop="desc" label="说明" min-width="200"></el-table-column>
                    <el-table-column prop="type" label="类型" width="368"></el-table-column>
                </el-table>
            </div>
        </el-scrollbar>
        <el-anchor type="underline" :container="$refs['containerRef']">
            <el-anchor-link>页面导航</el-anchor-link>
            <el-anchor-link href="#props">Props</el-anchor-link>
            <el-anchor-link href="#events">Events</el-anchor-link>
            <el-anchor-link href="#slots">Slots</el-anchor-link>
            <el-anchor-link href="#methods">Methods</el-anchor-link>
        </el-anchor>
    </div>
</template>

<i18n locale="en" src="./locales/en.json"></i18n>
<i18n locale="zh" src="./locales/zh.json"></i18n>

<script>
export default {
    name: 'Table',
    data() {
        return {
            props: [{
                name: 'data',
                desc: '表格数据',
                type: [{ type: 'array' }],
                default: '[ ]',
            }, {
                name: 'v-model:columns',
                desc: '表格列配置',
                type: [{ type: 'array' }],
                default: '[ ]',
            }, {
                name: 'v-model:expand-row-keys',
                desc: '展开的行的 key 数组',
                type: [{ type: 'array' }],
                default: '[ ]',
            }, {
                name: 'drag-options',
                desc: '拖拽配置',
                type: [{ type: 'object' }],
                default: '{ disabled: true }',
            }],
            events: [],
            slots: [],
            methods: [{
                name: 'print',
                desc: '打印表格',
                type: [{
                    type: 'function'
                }]
            }]
        }
    }
}
</script>

<style lang="scss" scoped>
.app-container {
    display: flex;

    .scrollbar {
        width: calc(100% - 200px);
        height: calc(var(--main-height) - 40px);

        :deep(.el-scrollbar__bar) {
            visibility: hidden;
        }

        .container {
            margin: 20px 30px;

            #props,
            #events,
            #slots,
            #methods {
                padding: 16px 0;
                font-size: 24px;
                font-weight: 600;
                color: var(--el-text-color-regular);
                position: relative;

                &::before {
                    content: '#';
                    color: var(--el-color-primary);
                    opacity: 0;
                    position: absolute;
                    left: -18px;
                    transition: 300ms;
                }

                &:hover::before {
                    opacity: 1;
                }
            }

            .el-table {
                border: 0.5px solid var(--el-border-color-lighter);

                :deep(.el-table__header-wrapper) th {
                    word-break: break-word;
                    background-color: var(--el-fill-color-lighter);
                    height: 40px;
                    font-size: 13px;
                }
            }
        }
    }

    .el-anchor {
        width: 200px;
        height: calc(var(--main-height) - 40px);
        background: transparent;

        &::before {
            width: 1px;
            background: var(--el-border-color);
        }
    }
}
</style>
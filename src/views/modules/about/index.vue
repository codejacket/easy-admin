<template>
    <div class="m20">
        <div class="about app-card">
            <h4 class="title">项目介绍</h4>
            <p class="content">
                <el-link type="primary" :href="info.preview" style="text-indent:0">Easy-Admin</el-link>
                {{ info.introduction }}
            </p>
        </div>
        <div class="app-card">
            <h4 class="title">项目信息</h4>
            <el-descriptions :column="2" border>
                <el-descriptions-item>
                    <template #label>版本号</template>
                    <el-tag type="primary">{{ info.version }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>最后构建时间</template>
                    <template #default>{{ info.buildTime }}</template>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>开源协议</template>
                    <template #default>{{ info.license }}</template>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>作者</template>
                    <template #default>{{ info.author }}</template>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>Github地址</template>
                    <template #default>{{ info.github }}</template>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>预览地址</template>
                    <template #default>{{ info.preview }}</template>
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <div class="app-card">
            <h4 class="title">
                <el-badge type="primary" :value="dependencies.length" :offset="[15, 11]">
                    生产依赖
                </el-badge>
            </h4>
            <el-descriptions :column="3" label-width="270" border>
                <el-descriptions-item v-for="item in dependencies">
                    <template #label>{{ item.name }}</template>
                    {{ item.version }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <div class="change-log app-card">
            <h4 class="title">更新日志</h4>
            <easy-table :data="changeLog" v-model:columns="columns">
                <el-table-column type="index" label="序号" width="60" />
                <el-table-column prop="version" label="版本号" width="120" />
                <el-table-column prop="title" label="内容" align="left">
                    <template #default="{ row }">
                        <div>{{ row.title }}</div>
                        <div class="change-log-content">
                            <div v-for="(item, index) in row.content" :key="index">{{ `${index + 1}. ${item}` }}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="time" label="时间" width="200" />
            </easy-table>
        </div>
    </div>
</template>

<i18n locale="en" src="./locales/en.json"></i18n>
<i18n locale="zh" src="./locales/zh.json"></i18n>

<script>
// 获取项目的依赖信息
import { version, license, author, dependencies } from '@/../package.json'
import CHANGELOG from '!!raw-loader!@/../CHANGELOG.md'

export default {
    name: 'About',
    data() {
        return {
            info: {
                name: 'Easy-Admin',
                version,
                author,
                license,
                buildTime: '2025-04-28',
                description: 'Easy-Admin is a free and open source admin template based on Vue.js and Element UI.',
                github: 'https://github.com/codejacket/easy-admin.git',
                preview: 'https://easy-admin.cn',
                introduction: `
                    是一款基于 Vue3 开发的开源后台管理系统框架，
                    采用 Vue CLI、Vue Router、Vue I18n、Element Plus、Pinia、Axios 等主流技术栈。
                    它具备丰富的基础功能模块，支持多语言切换与灵活的权限管理，代码结构清晰，扩展性强。无论是快速搭建项目，
                    还是作为学习 Vue3 开发的实践范例， Easy-Admin 都能提供高效、便捷的解决方案，帮助开发者轻松应对各类后台管理需求 。
                `
            },
            dependencies: Object.entries(dependencies).map(([name, version]) => ({ name, version })),
            columns: [],
            changeLog: this.parseCHANGELOG()
        }
    },
    methods: {
        parseCHANGELOG() {
            try {
                return CHANGELOG.split('\r\n\r\n').slice(1).map((block, index) => {
                    let lines = block.split('\n')
                    let line0 = lines[0].replace('##', '').split('(')
                    return {
                        id: index + 1,
                        version: line0[0].trim(),
                        time: line0[1].replace(')', '').trim(),
                        title: lines[1].replace('###', '').trim(),
                        content: lines.slice(2).map(line => line.replace('-', '').trim())
                    }
                })
            } catch (error) {
                console.error('解析 CHANGELOG.md 文件失败:', error)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.m20 {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .app-card {
        padding: 16px;

        .title {
            padding-bottom: 16px;
            color: var(--el-text-color-regular);
            cursor: pointer;
        }

        .content {
            text-indent: 2em;
            font-size: 14px;
            line-height: 25px;
            color: var(--el-text-color-regular);
        }
    }

    .about,
    .change-log {
        .title {
            padding-bottom: 12px;

            span {
                margin-left: 4px;
            }
        }

        .change-log-content {
            text-indent: 1em;
            font-size: 13px;
            line-height: 25px;
            color: var(--el-text-color-regular);
            opacity: 0.7;
        }
    }

    .el-descriptions {
        --el-descriptions-item-bordered-label-background: var(--el-fill-color-lighter);
    }
}
</style>
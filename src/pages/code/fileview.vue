<template>
    <el-container style="padding: 10px;">
        <el-header
            style="
            height: auto;
            padding-bottom: 20px;"
        >
            <h3>
                <b>本地项目资源展示</b>
                <span>[ source: </span>
                <el-link type="info">
                    {{filePath}}
                </el-link>
                <span> ]</span>
            </h3>
            <div>
                忽略目录：
                <el-checkbox-group v-model="isIgnoreList" style="display: inline-block;">
                    <el-checkbox
                        v-for="(item, index) in ignoreList"
                        :key="index"
                        :label="item"
                        :disabled="item === 'node_modules'"
                    ></el-checkbox>
                </el-checkbox-group>
            </div>
            <div>
                本地项目服务地址[ts-koa2]:
                <el-input v-model="curSerUrl" style="max-width: 480px;"></el-input>
            </div>
        </el-header>
        <el-container>
            <el-aside width="280px" style="padding: 10px; max-height: 800px;">
                <el-input v-model="filePath" placeholder="请输入项目地址">
                    <el-button slot="append" @click="getFileTreeList">
                        获取
                    </el-button>
                </el-input>
                <el-tree
                    :data="list"
                    :props="defaultProps"
                    :highlight-current="true"
                    @node-click="handleNodeClick"
                ></el-tree>
            </el-aside>
            <el-main style="padding: 0 10px;">
                <div>
                    <el-tag
                        v-for="(item, index) in selectFileList"
                        :key="index"
                        :effect="currFileInfo.value === item.value ? 'dark' : 'plain'"
                        size="mini"
                        closable
                        @click="handleSelectTags(item, index, 'S')"
                        @close="handleSelectTags(item, index, 'C')"
                    >
                        {{item.name}}
                    </el-tag>
                </div>
                <code-editor
                    ref="codeEditor"
                    :code-value="codeEditotConfig.codeValue"
                    :init-mode="codeEditotConfig.initMode"
                    :init-theme="codeEditotConfig.initTheme"
                ></code-editor>
                <el-button v-if="$route.query.e" @click="saveFile">
                    保存
                </el-button>
            </el-main>
        </el-container>
    </el-container>
</template>

<script lang="ts">
import {
    Component,
    Watch,
    Vue
} from 'nuxt-property-decorator'
import {requestResponse} from '~/../config/axios.conf'
import codeEditor from '~/components/codeEditor.vue'

@Component({
    components: {codeEditor},
    head () {
        return {
            title: 'CODE FILE VIEW FRONT-END-TOOL'
        }
    }
})
export default class PageCodeFileview extends Vue {
    serUrl: string = 'http://172.10.10.176:3093/api/file/'
    curSerUrl: string = 'http://172.10.10.176:3093'
    list: any[] = []
    filePath: string = 'E:\\woker\\github\\fg-template\\ts-nuxt-template'
    defaultProps: any = {
        children: 'children',
        label: 'name'
    }
    codeEditotConfig: any = {
        codeValue: '',
        initMode: 'javascript',
        initTheme: 'idea' // seti idea
    }
    isIgnoreList: string[] = ['node_modules', 'dist', '.svn', '.git', '.idea']
    ignoreList: string[] = ['dist', '.idea', '.nuxt', 'node_modules', '.git', '.svn']
    formatMode: any = {
        js: 'javascript',
        ts: 'javascript',
        html: 'htmlmixed',
        vue: 'vue',
        css: 'css',
        less: 'css',
        sass: 'css',
        scss: 'css',
        json: 'application/json',
        java: 'javascript'
    }
    currFileInfo: any = {
        value: '',
        name: '',
        body: ''
    }
    selectFileList: any[] = []
    async getFileTreeList () {
        if (!this.filePath) {
            return false
        }
        const igStr = JSON.stringify(this.isIgnoreList)
        const res: any = await requestResponse('get', this.serUrl + 'list', {path: this.filePath, ignore: igStr})
        if (res.data && res.data.flag) {
            this.list = res.data.data
        } else {
            this.$notify({
                title: '提示',
                message: '获取失败',
                type: 'error'
            })
        }
    }
    async getFileInfo (path: string) {
        this.codeEditotConfig.initMode = this.formatMode[this.parseFormat(path)] || this.formatMode.json
        if (!path) {
            return false
        }
        const res: any = await requestResponse('get', this.serUrl + 'info', {path})
        if (res.data && res.data.flag) {
            this.$nextTick(() => {
                this.codeEditotConfig.codeValue = res.data.data
            })
            this.currFileInfo.body = res.data.data
            this.selectFileList.push(this.currFileInfo)
        } else {
            this.$notify({
                title: '提示',
                message: '获取失败',
                type: 'error'
            })
        }
    }
    async saveFile () {
        const path = this.currFileInfo.value
        if (!path) {
            return false
        }
        const mime = this.formatMode[this.parseFormat(path)] || this.formatMode.json
        const value = (this.$refs.codeEditor as any).getEditotValue()
        const qData = {
            path,
            mime,
            value
        }
        const res: any = await requestResponse('post', this.serUrl + 'save', qData)
        const data = res.data || {}
        this.$notify({
            title: '提示',
            message: this.currFileInfo.name + (data.flag ? '文件保存成功' : '保存失败'),
            type: data.flag ? 'success' : 'error'
        })
    }
    handleNodeClick (data: any) {
        const path = data.value
        if (path) {
            this.currFileInfo = data
            let sign = true
            if (this.selectFileList.length > 0) {
                this.selectFileList.forEach((item: any) => {
                    if (item.value === path) {
                        sign = false
                    }
                })
            }
            if (sign) {
                this.getFileInfo(path)
            } else {
                this.codeEditotConfig.initMode = this.formatMode[this.parseFormat(path)] || this.formatMode.json
                this.currFileInfo = data
                this.$nextTick(() => {
                    this.codeEditotConfig.codeValue = data.body
                })
            }
        }
    }
    parseFormat (url: string) {
        let str = ''
        const arr = url.split('.')
        if (arr.length > 0) {
            str = arr[arr.length - 1]
        }
        if (str) {
            str = str.toLowerCase()
        }
        return str
    }
    handleSelectTags (item: any, index: number, sign: string) {
        if (sign === 'S') {
            this.handleNodeClick(item)
        } else if (sign === 'C') {
            this.selectFileList.splice(index, 1)
            if (this.selectFileList[0]) {
                this.handleNodeClick(this.selectFileList[0])
            } else {
                this.currFileInfo = {
                    value: '',
                    name: '',
                    body: ''
                }
                this.$nextTick(() => {
                    this.codeEditotConfig.codeValue = ''
                })
            }
        }
    }
    @Watch('curSerUrl', {immediate: false})
    curSerUrlChange (val: string) {
        this.serUrl = `${val}/api/file/`
    }
}
</script>

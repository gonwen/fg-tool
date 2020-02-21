<template>
    <el-container style="padding: 10px;">
        <el-header style="height: auto;padding-bottom: 20px;">
            <h3><b>本地项目资源展示</b>[ source: <el-link type="info">{{filePath}}</el-link> ]</h3>
            <div>
                忽略目录：
                <el-checkbox-group v-model="isIgnoreList" style="display: inline-block">
                    <el-checkbox v-for="(item, index) in ignoreList" :key="index" :label="item" :disabled="item === 'node_modules'"></el-checkbox>
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
                    <el-button @click="getFileTreeList" slot="append">获取</el-button>
                </el-input>
                <el-tree :data="list" :props="defaultProps" @node-click="handleNodeClick" :highlight-current="true"></el-tree>
            </el-aside>
            <el-main style="padding: 0 10px;">
                <div>
                    <el-tag
                        v-for="(item, index) in selectFileList"
                        :key="index"
                        :effect="currFileInfo.value === item.value ? 'dark' : 'plain'"
                        size="mini"
                        @click="handleSelectTags(item, index, 'S')"
                        @close="handleSelectTags(item, index, 'C')"
                        closable>
                        {{item.name}}
                    </el-tag>
                </div>
                <code-editor ref="codeEditor" :codeValue="codeEditotConfig.codeValue" :initMode="codeEditotConfig.initMode" :initTheme="codeEditotConfig.initTheme"></code-editor>
                <el-button @click="saveFile" v-if="$route.query.e">保存</el-button>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import codeEditor from './codeEditor'
import {requestResponse} from '../config/axiosconfig'
export default {
    name: 'codeFileView',
    components: {
        codeEditor
    },
    data () {
        return {
            serUrl: 'http://172.10.10.176:3093/api/file/',
            curSerUrl: 'http://172.10.10.176:3093',
            list: [],
            filePath: 'E:\\woker\\github\\fg-tool',
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            codeEditotConfig: {
                codeValue: '',
                initMode: 'javascript',
                initTheme: 'idea' // seti idea
            },
            isIgnoreList: ['node_modules', 'dist', '.svn', '.git', '.idea'],
            ignoreList: ['dist', '.idea', '.nuxt', 'node_modules', '.git', '.svn'],
            formatMode: {
                'js': 'javascript',
                'ts': 'javascript',
                'html': 'htmlmixed',
                'vue': 'vue',
                'css': 'css',
                'less': 'css',
                'sass': 'css',
                'scss': 'css',
                'json': 'application/json',
                'java': 'javascript'
            },
            currFileInfo: {
                value: '',
                name: '',
                body: ''
            },
            selectFileList: []
        }
    },
    methods: {
        async getFileTreeList () {
            if (!this.filePath) return false
            let igStr = JSON.stringify(this.isIgnoreList)
            let res = await requestResponse('get', this.serUrl + 'list', {path: this.filePath, ignore: igStr})
            if (res.data && res.data.flag) this.list = res.data.data
            else {
                this.$notify({
                    title: '提示',
                    message: '获取失败',
                    type: 'error'
                })
            }
        },
        async getFileInfo (path) {
            this.codeEditotConfig.initMode = this.formatMode[this.parseFormat(path)] || this.formatMode.json
            if (!path) return false
            let res = await requestResponse('get', this.serUrl + 'info', {path: path})
            if (res.data && res.data.flag) {
                this.$nextTick(() => {
                    this.codeEditotConfig.codeValue = res.data.data
                })
                this.currFileInfo.body = res.data.data
                this.selectFileList.push(this.currFileInfo)
            }
            else {
                this.$notify({
                    title: '提示',
                    message: '获取失败',
                    type: 'error'
                })
            }
        },
        async saveFile () {
            let path = this.currFileInfo.value
            if (!path) return false
            let mime = this.formatMode[this.parseFormat(path)] || this.formatMode.json
            let value = ''
            value = this.$refs.codeEditor.getEditotValue()
            let qData = {
                path,
                mime,
                value
            }
            let res = await requestResponse('post', this.serUrl + 'save', qData)
            let data = res.data || {}
            this.$notify({
                title: '提示',
                message: this.currFileInfo.name + (data.flag ? '文件保存成功' : '保存失败'),
                type: data.flag ? 'success' : 'error'
            })
        },
        handleNodeClick (data) {
            let path = data.value
            if (path) {
                this.currFileInfo = data
                let sign = true
                if (this.selectFileList.length > 0) {
                    this.selectFileList.forEach(item => {
                        if (item.value === path) sign = false
                    })
                }
                if (sign) this.getFileInfo(path)
                else {
                    this.codeEditotConfig.initMode = this.formatMode[this.parseFormat(path)] || this.formatMode.json
                    this.currFileInfo = data
                    this.$nextTick(() => {
                        this.codeEditotConfig.codeValue = data.body
                    })
                }
            }
        },
        parseFormat (url) {
            let str = ''
            let arr = url.split('.')
            if (arr.length > 0) str = arr[arr.length - 1]
            if (str) str = str.toLowerCase()
            return str
        },
        handleSelectTags (item, index,  sign) {
            if (sign === 'S') this.handleNodeClick(item)
            else if (sign === 'C') {
                this.selectFileList.splice(index, 1)
                if (this.selectFileList[0]) this.handleNodeClick(this.selectFileList[0])
                else {
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
    },
    watch: {
        'curSerUrl' (val) {
            this.serUrl = `${val}/api/file/`
        }
    }
}
</script>

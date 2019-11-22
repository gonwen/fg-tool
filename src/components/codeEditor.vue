<template>
    <div class="code-box">
        <div class="code-menu" v-if="showMenu">
            <el-radio-group v-model="codeConfig.mode" @change="changeCodeMode">
                <el-radio-button v-for="(item, index) in codeMode" :key="index" :label="item.v">{{item.n}}</el-radio-button>
            </el-radio-group>
            <el-button @click="handleExportFile" type="primary" icon="el-icon-download">导出</el-button>
            <el-input-number v-if="allLineCount > 40" :min="1" :max="allLineCount" v-model="lineCount" :step="ceil(allLineCount/40)" style="width: 140px;"></el-input-number>
            <el-switch
                style="float: right"
                v-model="codeConfig.theme"
                @change="changeTheme"
                active-value="seti"
                inactive-value="idea"
                active-text="Dark"
                inactive-text="Light"
                active-color="#151718"
                inactive-color="#dddddd">
            </el-switch>
        </div>
        <div class="code-body">
            <textarea ref="editorBox" id="editorBox"></textarea>
        </div>
    </div>
</template>

<script>
import codeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'

import 'codemirror/theme/idea.css'
import 'codemirror/theme/seti.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/htmlmixed/htmlmixed'

// 代码折叠
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'
import 'codemirror/addon/fold/foldgutter.css'

// 自动提示
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/html-hint'
import 'codemirror/addon/hint/css-hint'
import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/anyword-hint.js'

import 'codemirror/keymap/sublime'

// search
import 'codemirror/addon/search/search'
import 'codemirror/addon/search/jump-to-line'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/dialog/dialog'

export default {
    name: 'codeEditor',
    props: {
        // 功能面板开关
        showMenu: {
            default: false,
            type: Boolean
        },
        initTheme: {
            default: 'idea',
            type: String
        },
        initMode: {
            default: 'javascript',
            type: String
        },
        codeValue: {
            default: '',
            type: String
        },
        indentUnit: {
            default: 4,
            type: Number
        }
    },
    data () {
        return {
            lineCount: 1,
            allLineCount: 1,
            codeConfig: {
                mode: 'javascript', // 语言模式 htmlmixed  javascript   application/json
                theme: 'idea', // 主题
                keyMap: 'sublime', // 快键键风格
                tags: {
                    style: [
                        ['type', /^text\/(x-)?scss$/, 'text/x-scss'],
                        [null, null, 'css']
                    ],
                    custom: [[null, null, 'customMode']]
                },
                lineNumbers: true, // 显示行号
                smartIndent: true, // 智能缩进
                indentUnit: this.indentUnit, // 智能缩进单位为4个空格长度
                indentWithTabs: true, // 使用制表符进行智能缩进
                lineWrapping: true, //
                // 在行槽中添加行号显示器、折叠器、语法检测器`
                gutters: [
                    'CodeMirror-linenumbers',
                    'CodeMirror-foldgutter',
                    'CodeMirror-lint-markers'
                ],
                foldGutter: true, // 启用行槽中的代码折叠
                autofocus: true, // 自动聚焦
                matchBrackets: true, // 匹配结束符号，比如"]、}"
                autoCloseBrackets: true, // 自动闭合符号
                styleActiveLine: true, // 显示选中行的样式
                // 行号格式
                // lineNumberFormatter: (num) => num + '行',
                extraKeys: {
                    'Tab': 'autocomplete', // 自动补全
                    'Alt-F': 'findPersistent', // 查找
                    'Alt-N': 'replace' // 替换
                }
            },
            editor: null,
            codePreString: '',
            codeMode: [
                {
                    n: 'HTML',
                    v: 'htmlmixed',
                    ft: 'html',
                    mime: 'text/html'
                },
                {
                    n: 'JavaScript',
                    v: 'javascript',
                    ft: 'js',
                    mime: 'application/javascript'
                },
                {
                    n: 'JSON',
                    v: 'application/json',
                    ft: 'json',
                    mime: 'application/json'
                }
            ]
        }
    },
    created () {
        this.codeConfig.mode = this.initMode
        this.codeConfig.theme = this.initTheme
    },
    mounted () {
        this.initEditor()
    },
    methods: {
        initEditor () {
            let editorBox = this.$refs.editorBox
            this.editor = codeMirror.fromTextArea(editorBox, this.codeConfig)
            this.editor.on('blur', () => {
                this.allLineCount = this.editor.lineCount()
            })
        },
        changeCodeMode (mode) {
            this.codeConfig.mode = mode
            this.setEditotValue('')
            this.editor.setOption('mode', mode)
        },
        changeTheme (val) {
            this.editor.setOption('theme', val)
        },
        setEditotValue (str) {
            if (this.editor) this.editor.setValue(str)
        },
        getEditotValue () {
            let str = ''
            if (this.editor) str = this.editor.getValue()
            return str
        },
        handleExportFile () {
            let str = this.getEditotValue()
            if (str) {
                const type = this.codeConfig.mode
                let info = ''
                this.codeMode.forEach(item => {
                    if (item.v === type) info = item
                })
                let blob = new Blob([str], {type: info.mime})
                this.downFile(blob, info)
            } else {
                this.$notify({
                    title: '提示',
                    message: '无内容',
                    type: 'error'
                })
            }
        },
        downFile (blob, info) {
            let fileUrl = window.createObjectURL !== undefined
                ? window.createObjectURL(blob)
                : window.URL !== undefined
                    ? window.URL.createObjectURL(blob)
                    : window.URL.createObjectURL(blob)
            let a = document.createElement('a')
            a.download = `${info.n}_${new Date().getTime()}.${info.ft}`
            a.href = fileUrl
            document.getElementsByTagName('body')[0].appendChild(a)
            a.click()
            a.parentNode.removeChild(a)
            window.URL.revokeObjectURL(fileUrl)
        },
        ceil: (n) => Math.ceil(n)
    },
    watch: {
        'codeValue' (val) {
            this.setEditotValue(val)
            this.allLineCount = this.editor.lineCount()
        },
        'initTheme' (val) {
            this.changeTheme(val)
        },
        'initMode' (val) {
            this.changeCodeMode(val)
        },
        'lineCount' (num) {
            this.editor.scrollIntoView({line: num - 1, ch: 0})
        }
    }
}
</script>

<style lang="scss">
.code-box{
    margin: 20px 0;
    .code-body{
        border: 1px solid #f4f4f4;
        box-shadow: 0 0 6px #aaa;
    }
    .CodeMirror,
    .CodeMirror-scroll{
        height: auto;
        min-height: 300px;
        max-height: 700px;
    }
}
</style>

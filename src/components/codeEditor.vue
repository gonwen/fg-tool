<template>
    <div class="code-box">
        <div v-if="showMenu" class="code-menu">
            <el-radio-group v-model="codeConfig.mode" @change="changeCodeMode">
                <el-radio-button v-for="(item, index) in codeMode" :key="index" :label="item.v">
                    {{item.n}}
                </el-radio-button>
            </el-radio-group>
            <el-button type="primary" icon="el-icon-download" @click="handleExportFile">
                导出
            </el-button>
            <el-input-number
                v-if="allLineCount > 40"
                v-model="lineCounts"
                :min="1"
                :max="allLineCount"
                :step="ceil(allLineCount/40)"
                style="width: 140px;"
            ></el-input-number>
            <el-switch
                v-model="codeConfig.theme"
                style="float: right;"
                active-value="seti"
                inactive-value="idea"
                active-text="Dark"
                inactive-text="Light"
                active-color="#151718"
                inactive-color="#dddddd"
                @change="changeTheme"
            >
            </el-switch>
        </div>
        <div class="code-body">
            <label>
                <textarea id="editorBox" ref="editorBox"></textarea>
            </label>
        </div>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Watch,
    Prop,
    Vue
} from 'nuxt-property-decorator'
interface Codemodel {
    n: string,
    v: string
    ft: string
    mime: string
}

@Component({
    name: 'codeEditor',
    mounted () {
        (this as any).init()
    }
})
export default class CodeEditor extends Vue {
    @Prop({
        default: 'idea'
    })
    initTheme!: string
    @Prop({
        default: 'javascript'
    })
    initMode!: string
    @Prop({
        default: ''
    })
    codeValue!: string
    @Prop({
        default: 4
    })
    indentUnit!: number
    @Prop({
        default: false
    })
    showMenu!: boolean
    lineCounts: number = 1
    allLineCount: number = 1
    codeConfig: any = {
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
            Tab: 'autocomplete', // 自动补全
            'Alt-F': 'findPersistent', // 查找
            'Alt-N': 'replace' // 替换
        }
    }
    editor: any = null
    // codePreString: string = ''
    codeMode: Codemodel[] = [
        {
            n: 'HTML',
            v: 'htmlmixed',
            ft: 'html',
            mime: 'text/html'
        },
        {
            n: 'CSS',
            v: 'css',
            ft: 'css',
            mime: 'text/css'
        },
        {
            n: 'VUE',
            v: 'vue',
            ft: 'vue',
            mime: 'text/vue'
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
        },
        {
            n: 'JAVA',
            v: 'javascript',
            ft: 'java',
            mime: 'text/x-java'
        }
    ]
    isOpenWTW: boolean = false// 是否开启逐字模式输入
    speedWTW: any = 10 // 逐字模式输入速度
    init () {
        const query: any = this.$route.query
        this.isOpenWTW = !!query.wtw
        this.speedWTW = !isNaN(Number(query.speed)) ? query.speed : 10
        this.codeConfig.mode = this.initMode
        this.codeConfig.theme = this.initTheme
        this.initEditor()
    }
    initEditor () {
        const editorBox = this.$refs.editorBox
        const codeMirror: any = require('~/plugins/codemirror')()
        this.editor = codeMirror.fromTextArea(editorBox, this.codeConfig)
        const on = this.editor.on as any
        on('blur', () => {
            this.allLineCount = this.editor.lineCount()
        })
    }
    setEditotValue (str: string) {
        if (this.editor) {
            this.editor.setValue(str)
        }
    }
    getEditotValue () {
        let str = ''
        if (this.editor) {
            str = this.editor.getValue()
        }
        return str
    }
    handleExportFile () {
        const str = this.getEditotValue()
        if (str) {
            const type = this.codeConfig.mode
            let info: any = {}
            this.codeMode.forEach((item: Codemodel) => {
                if (item.v === type) {
                    info = item
                }
            })
            const blob = new Blob([str], {type: info.mime})
            this.downFile(blob, info)
        } else {
            this.$notify({
                title: '提示',
                message: '无内容',
                type: 'error'
            })
        }
    }
    downFile (blob: any, info: any) {
        const wd = window as any
        const fileUrl = wd.createObjectURL !== undefined
            ? wd.createObjectURL(blob)
            : wd.URL.createObjectURL(blob)
        const a: any = document.createElement('a')
        a.download = `${info.n}_${new Date().getTime()}.${info.ft}`
        a.href = fileUrl
        document.getElementsByTagName('body')[0].appendChild(a)
        a.click()
        a.parentNode.removeChild(a)
        window.URL.revokeObjectURL(fileUrl)
    }
    // 字符逐字输入模式
    wordByWordExport (str: string, num?: number) {
        const len = str.length
        let ind = num || 1
        const speed = this.speedWTW
        this.setEditotValue(str.substring(0, ind))
        ind++
        if (ind > len) {
            return false
        }
        setTimeout(() => {
            this.wordByWordExport(str, ind)
        }, speed)
    }
    ceil (num: number) {
        Math.ceil(num)
    }
    @Watch('codeValue', {immediate: false})
    changeCodeValue (val: string) {
        if (this.isOpenWTW) {
            this.wordByWordExport(val)
        } else {
            this.setEditotValue(val)
        }
        this.allLineCount = this.editor.lineCount()
    }
    @Watch('initTheme', {immediate: false})
    changeTheme (val: string) {
        this.editor.setOption('theme', val)
    }
    @Watch('initMode', {immediate: false})
    changeCodeMode (mode: any) {
        this.codeConfig.mode = mode
        this.setEditotValue('')
        this.editor.setOption('mode', mode)
    }
    @Watch('lineCounts', {immediate: false})
    changeLineCount (num: number) {
        const parms: any = {
            line: num - 1,
            ch: 0
        }
        this.editor.scrollIntoView(parms)
    }
}
</script>

<style lang="scss">
    .code-box {
        .code-body {
            border: 1px solid #f4f4f4;
            box-shadow: 0 0 6px #aaa;
        }

        .CodeMirror,
        .CodeMirror-scroll {
            height: auto;
            min-height: 300px;
            max-height: 700px;
        }
    }
</style>

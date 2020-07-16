<template>
    <div class="md">
        <div class="md-h">
            <div>
                <nuxt-link to="/">
                    <span class="el-icon-back"></span>
                    返回列表
                </nuxt-link>
                <el-button>分享</el-button>
                <el-button>加入我的收藏库</el-button>
            </div>
            <nav>
                <nuxt-link
                    v-for="(item, index) in nav"
                    :key="index"
                    :to="`/model/?t=${item.type}`"
                >
                    {{item.btnName}}
                </nuxt-link>
            </nav>
            <div>
                {{info.productName}}
                <nuxt-link to="/">
                    <el-button>下一个</el-button>
                </nuxt-link>
            </div>
        </div>
        <template v-if="ctype === 'view' || ctype === 'dcp'">
            <iframe ref="iframe" class="md-iframe" :src="getIframeUrl()"></iframe>
            <div class="md-l">
                <div class="md-panl md-items">
                    <h6>基本信息</h6>
                    <div v-for="(item, index) in info.baseInfo" :key="index">
                        <label>{{item.label}}</label>
                        <span>{{item.value}}</span>
                    </div>
                </div>
                <div class="md-panl md-items">
                    <h6>模型信息</h6>
                    <div v-for="(item, index) in info.partInfo" :key="index">
                        <label>{{item.label}}</label>
                        <span>{{item.value}}</span>
                    </div>
                </div>
            </div>
            <div class="md-r">
                <div class="md-panl">
                    <div v-if="allShow">
                        <iframe ref="allIframe" class="md-iframe" :src="getIframeUrl()"></iframe>
                    </div>
                    <h6>专业模块</h6>
                    <div>
                        <div>
                            <el-button @click="handleShowModel('')">
                                整体模型
                            </el-button>
                        </div>
                        <template v-for="(item, index) in info.modelRoot.children">
                            <el-button :key="index" :title="item.name" @click="handleShowModel(item)">
                                {{FILTER_FORMATER.wordNum(item.name, 12)}}
                            </el-button>
                        </template>

                        <div style="margin-top: 20px;">
                            <template v-for="(item, index) in curNodeModels">
                                <el-button :key="index" type="text" :title="item.name" @click="handleShowModel(item, 'child')">
                                    {{FILTER_FORMATER.wordNum(item.name, 12)}}
                                </el-button>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-if="ctype === 'file'">
            <el-row class="md-m md-file">
                <el-col
                    v-for="(item, index) in info.fileInfo"
                    :key="index"
                    :lg="24 / info.fileInfo.length"
                    :span="24 * 2 / info.fileInfo.length"
                    class="md-panl md-items"
                >
                    <h6>
                        <span>{{item.label}}</span>
                        <el-button type="text" @click="downFile(item.node)">
                            打包下载
                        </el-button>
                    </h6>
                    <div v-for="(ite, ind) in item.node" :key="ind">
                        <label>{{ite.fileName}}</label>
                        <span>{{ite.fileSize}}</span>
                        <el-button type="text" @click="downFile(ite)">
                            下载
                        </el-button>
                    </div>
                </el-col>
            </el-row>
        </template>
        <template v-if="ctype === 'period'">
            <d3-gantt :is-echart-model="true" class="md-m"></d3-gantt>
        </template>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Watch,
    Vue
} from 'nuxt-property-decorator'
import d3Gantt from '~/components/d3/gantt.vue'

@Component({
    components: {d3Gantt},
    head () {
        return {
            title: 'BUILDING MODEL PRODUCTS VIEW FRONT-END-TOOL'
        }
    },
    mounted () {
        const that = this as any
        that.queryTypeChange(that.$route.query.t)
    }
})
export default class PageModel extends Vue {
    nav: any[] = [
        {
            type: 'view',
            btnName: '产品预览'
        },
        {
            type: 'dsg',
            btnName: '设计解读'
        },
        {
            type: 'dcp',
            btnName: '模型分解'
        },
        {
            type: 'period',
            btnName: '工期推演'
        },
        {
            type: 'mng',
            btnName: '管理模型'
        },
        {
            type: 'hardcover',
            btnName: '室内精装'
        },
        {
            type: 'file',
            btnName: '产品资料'
        },
        {
            type: 'pay',
            btnName: '购买产品'
        }
    ]
    base64FileUrl: string =
        'aHR0cHM6Ly9teHpoLXByb2Qu' +
        'b3NzLWNuLWJlaWppbmcuYWxp' +
        'eXVuY3MuY29tL21vZGVsRm9s' +
        'ZGVyX2IzOTMyZjA5LTNiZjgt' +
        'NDNmZC04MTE2LTI3MzRmNjNj' +
        'ZDdhNS9vdXRwdXQvM2Quc3Zm'
    info: any = {
        productName: '嘉谊产品-1.0',
        baseInfo: [
            {
                key: '',
                label: '使用模组',
                value: '180个'
            },
            {
                key: '',
                label: '使用部品',
                value: '320个'
            },
            {
                key: '',
                label: '参与品牌',
                value: '50个'
            }
        ],
        partInfo: [
            {
                key: '',
                label: '使用模组',
                value: '180个'
            },
            {
                key: '',
                label: '使用部品',
                value: '320个'
            },
            {
                key: '',
                label: '参与品牌',
                value: '50个'
            }
        ],
        modelRoot: [],
        fileInfo: [
            {
                type: 'pro',
                label: '产品资料',
                node: [
                    {
                        fileName: '标准模型参数模板.xlsx',
                        fileSize: 9774,
                        fileUrl: 'ciipResoruce/bpsc/18036/file/20200623/986d46efaff4584c10b5646f994e1fea.xlsx'
                    },
                    {
                        fileName: '挡土墙.png',
                        fileSize: 9085,
                        fileUrl: 'ciipResoruce/bpsc/18036/file/20200623/d58d92519462743939e787e807a07ee4.png'
                    },
                    {
                        fileName: '挡土墙.rfa',
                        fileSize: 348160,
                        fileUrl: 'ciipResoruce/bpsc/18036/file/20200623/874bd3729f4d478b57ee4319836e5124.rfa'
                    }
                ]
            },
            {
                type: 'par',
                label: '部品资料',
                node: [
                    {
                        fileName: '标准模型参数模板.xlsx',
                        fileSize: 9774,
                        fileUrl: 'ciipResoruce/bpsc/18036/file/20200623/986d46efaff4584c10b5646f994e1fea.xlsx'
                    },
                    {
                        fileName: '挡土墙.png',
                        fileSize: 9085,
                        fileUrl: 'ciipResoruce/bpsc/18036/file/20200623/d58d92519462743939e787e807a07ee4.png'
                    },
                    {
                        fileName: '挡土墙.rfa',
                        fileSize: 348160,
                        fileUrl: 'ciipResoruce/bpsc/18036/file/20200623/874bd3729f4d478b57ee4319836e5124.rfa'
                    }
                ]
            },
            {
                type: 'mod',
                label: '族模组资料',
                node: [
                    {
                        fileName: '标准模型参数模板.xlsx',
                        fileSize: 9774,
                        fileUrl: 'ciipResoruce/bpsc/18036/file/20200623/986d46efaff4584c10b5646f994e1fea.xlsx'
                    },
                    {
                        fileName: '挡土墙.png',
                        fileSize: 9085,
                        fileUrl: 'ciipResoruce/bpsc/18036/file/20200623/d58d92519462743939e787e807a07ee4.png'
                    },
                    {
                        fileName: '挡土墙.rfa',
                        fileSize: 348160,
                        fileUrl: 'ciipResoruce/bpsc/18036/file/20200623/874bd3729f4d478b57ee4319836e5124.rfa'
                    }
                ]
            },
            {
                type: 'hom',
                label: '室内精装资料',
                node: [
                    {
                        fileName: '标准模型参数模板.xlsx',
                        fileSize: 9774,
                        fileUrl: 'ciipResoruce/bpsc/18036/file/20200623/986d46efaff4584c10b5646f994e1fea.xlsx'
                    },
                    {
                        fileName: '挡土墙.png',
                        fileSize: 9085,
                        fileUrl: 'ciipResoruce/bpsc/18036/file/20200623/d58d92519462743939e787e807a07ee4.png'
                    },
                    {
                        fileName: '挡土墙.rfa',
                        fileSize: 348160,
                        fileUrl: 'ciipResoruce/bpsc/18036/file/20200623/874bd3729f4d478b57ee4319836e5124.rfa'
                    }
                ]
            }
        ]
    }
    iframe: any = null
    // showIds: any = [] // 显示中的 dbid
    curNodeModels: any = []
    allShow: boolean = false
    timer: any = null
    ctype: string = ''
    getIframeUrl (hideTool: boolean = true) {
        let base = '../../model/view.html?'
        if (hideTool) {
            base += 'hdtl=hd&'
        }
        // const base = 'http://www.ciip.com/static/html/model/view.html?'
        const qy = this.$route.query
        let surl = ''
        if (qy.u) {
            surl = `u=${qy.u}`
        } else if (qy.file) {
            surl = `file=${qy.file}`
        } else {
            surl = `u=${this.base64FileUrl}`
            // surl = 'vtp=more'
        }
        return base + surl
    }
    initFrameInfo () {
        this.iframe = (this.$refs.iframe as any).contentWindow
        window.addEventListener('message', (e: any) => {
            const d = e.data
            if (d.sign === 'model') {
                const s = d.modelLoadingStatus
                const rt = d.modelViewRoot
                if (s === 2) {
                    this.iframe.postMessage({
                        t: 'tree',
                        s: true
                    }, '*')
                }
                if (rt) {
                    this.info.modelRoot = rt[0]
                }
            }
        })
    }
    selectModelChangeColor (item: any = '') {
        const dom = (this.$refs.allIframe as any)
        if (item) {
            clearTimeout(this.timer)
            try {
                const iframe: any = dom.contentWindow
                iframe.postMessage({
                    t: 'click',
                    s: true,
                    o: {
                        ids: this.getbdIds(item),
                        s: true,
                        // c: this.setColor(17, 169, 232, 0.3)
                        c: this.setColor(255, 0, 0, 0.3)
                    }
                }, '*')
            } catch {
                this.timer = setTimeout(() => {
                    this.selectModelChangeColor(item)
                }, 500)
            }
        }
    }
    setColor (r: number, g: number, b: number, a: number = 1) {
        const m = 255
        return [
            r / m,
            g / m,
            b / m,
            a
        ]
    }
    getbdIds (info: any) {
        const na: number[] = []
        const fids = (item: any) => {
            const child = item.children
            if (
                child &&
                child.constructor === Array &&
                child.length > 0
            ) {
                child.forEach((itm: any) => {
                    na.push(itm.dbId)
                    fids(itm)
                })
            }
        }
        fids(info)
        return na
    }
    changeModelByDbid (a: number[], type: string = 'show') {
        if (a && a.length > 0) {
            this.iframe.postMessage({
                t: type,
                s: true,
                o: a
            }, '*')
        }
    }
    handleShowModel (info: any, type: string = '') {
        const dbId = info.dbId || ''
        const oArr: number[] = []
        let sArr: number[] = []
        let hArr: number[] = []
        const rt = this.info.modelRoot
        let child: any = []
        rt.children.forEach((item: any) => {
            oArr.push(item.dbId)
        })
        if (dbId) {
            this.allShow = true
            child = info.children || []
            hArr = oArr.filter((i: any) => i !== dbId)
            sArr = [dbId]
            this.changeModelByDbid(hArr, 'hide')
            this.changeModelByDbid(sArr)
            this.selectModelChangeColor(info)
        } else {
            this.allShow = false
            sArr = oArr
            this.changeModelByDbid(sArr)
        }
        if (!type) {
            this.curNodeModels = child
        }
    }
    downFile (items: any) {
        let blobUrl: any = null
        let filename = ''
        const base = 'https://resource.ciip.com/'
        if (items.fileUrl) {
            filename = items.fileName
            blobUrl = base + items.fileUrl
        } else {
            filename = items.label + '.rar'
            const a: any = []
            items.forEach((it: any) => {
                a.push(base + it.fileUrl)
            })
            this.$message.error('无法提供打包下载服务')
        }
        if (blobUrl) {
            this.downLoadFile(blobUrl, filename)
        }
    }
    downLoadFile (file: any, name: string = 'test.mp4') {
        let fileUrl = ''
        if (file.constructor === Blob) {
            fileUrl = window.URL.createObjectURL(file)
        } else if (file.constructor === String) {
            fileUrl = file
        }
        const a = document.createElement('a') as any
        a.download = name
        a.href = fileUrl
        document.getElementsByTagName('body')[0].appendChild(a)
        a.click()
        a.parentNode.removeChild(a)
        window.URL.revokeObjectURL(fileUrl)
    }
    @Watch('$route.query.t', {immediate: false})
    queryTypeChange (n: string) {
        this.ctype = n || 'view'
        if (this.ctype === 'view' || this.ctype === 'dcp') {
            this.$nextTick(() => {
                this.initFrameInfo()
            })
        }
    }
}
</script>

<style scoped lang="scss">
    $blue: #11a9e8;
    $height: 60px;
    $sideWidth: 200px;

    .md,
    .md-iframe {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 999;
    }

    .md {
        position: fixed;
    }

    .md-iframe {
        border: none;
        z-index: 1;
    }

    .md-h,
    .md-l,
    .md-m,
    .md-r {
        width: $sideWidth;
        height: calc(100% - #{$height});
        position: absolute;
        top: $height;
        left: 0;
        padding: 0 10px;
        z-index: 3;
    }

    .md-m {
        width: 100%;
    }

    .md-r {
        left: auto;
        right: 0;
        overflow: auto;
    }

    .md-h {
        width: 100%;
        height: $height;
        top: 0;
        display: flex;
        justify-content: space-between;
        line-height: $height;

        nav {
            a {
                margin: 0 20px;
                color: #333;
            }

            .nuxt-link-exact-active {
                color: $blue;
            }
        }
    }

    .md-items {
        & > div {
            line-height: 34px;
            border-bottom: 1px solid #ccc;
            font-size: 12px;
        }

        span {
            color: #333;
        }

        label {
            color: #666;
            width: 80px;
            display: inline-block;
            float: left;
        }
    }

    .md-panl {
        padding-top: 20px;

        .el-button {
            margin: 0 5px;

            & > .el-button--text {
                span {
                    text-decoration: underline;
                }
            }
        }

        h6 {
            font-size: 14px;
            color: #333;
            margin: 10px 0;
        }

        .md-iframe {
            height: $sideWidth;
            margin-bottom: 20px;
            position: relative;
        }
    }

    .md-file {
        .el-col {
            padding: 20px;

            > div,
            h6 {
                display: flex;
                justify-content: space-between;
            }

            label {
                width: auto;
                float: none;
            }
        }
    }
</style>

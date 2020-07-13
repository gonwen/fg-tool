<!-- DOM截图 -->
<template>
    <div class="cap">
        <!-- 截图操作 -->
        <div>
            <el-button @click="capture">
                获取
            </el-button>
            <el-button @click="changeDomImgUrl">
                转换图片
            </el-button>
        </div>
        <!-- 截图图片的dom -->
        <div ref="dom" class="cap-content"></div>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'nuxt-property-decorator'
import axios from 'axios'
axios.defaults.withCredentials = false
const getBase64ByUrl = (url: string) => axios.get('http://172.10.10.176:3093/api/file/fileByUrl?url=' + url)

@Component({
    head () {
        return {
            title: 'CAPTURE FRONT-END-TOOL'
        }
    },
    mounted () {
        (this as any).initDom()
    }
})
export default class PageCapture extends Vue {
    htmlStr: string = '<h5 style="text-align: center;padding-top: 20px;font-size: 18px; color: #666;">DOM 截图</h5><p><img style="overflow-wrap: break-word; cursor: pointer;" src="http://bbs.chinabim.com/data/attachment/forum/202005/06/140433iipnbrn8un68ndlt.png" width="600" height="332" alt="" /><span style="color: #444444; font-size: 14px;">当前，在室内装修工程中，普遍存在着一系列问题。例如：软件以及读图失真导致的最终工程造价偏离预期较大的问题，以及因为传统软件难以及时地调整与修改设计的错漏以及碰撞问题，使得工程建设出现工程延期以及造价成本抬高的问题。室内装修设计、施工是一项需要丰富经验的系统工作。在CAD时代下，精装修图纸绘制效率低下、错误不易被发现、重复出图等，一直困扰着项目各方。</span><img id="aimg_22365" class="zoom" style="overflow-wrap: break-word; cursor: pointer;" src="http://bbs.chinabim.com/data/attachment/forum/202005/06/140434cej1wjf5wfjcw3c6.png" width="600" alt="" /></p>'
    dom: any = null
    initDom () {
        this.dom = this.$refs.dom
        this.dom.innerHTML = this.htmlStr
    }
    capture () {
        const html2canvas = require('html2canvas')
        html2canvas(this.dom).then((canvas: any) => {
            document.body.appendChild(canvas)
            this.downLoadFile(canvas.toDataURL('image/png', 1), `dom-${this.randomid()}.png`)
        })
    }
    changeDomImgUrl () {
        const imgs = this.getImgDoms()
        if (imgs && imgs.length > 0) {
            for (let i = 0; i < imgs.length; i++) {
                this.imgUrl2Blob(imgs[i])
            }
        } else {
            this.$message.error('无图片资源需转换')
        }
    }
    getImgDoms () {
        return this.dom.getElementsByTagName('img')
    }
    async imgUrl2Blob (imgDom: any) {
        // getBase64ByUrl
        // const res = await axios({url: imgDom.src, responseType: 'blob'})
        // if (res && res.data.constructor === Blob) {
        //     imgDom.src = await this.blob2Base64Async(res.data)
        // }
        const res = await getBase64ByUrl(imgDom.src)
        if (res && res.data && res.data.data) {
            const baseStr = res.data.data
            baseStr.replace(/=+$/, '')
            imgDom.src = baseStr
        }
    }
    /*
    blob2Base64Async (blob: any) {
        return new Promise((resolve) => {
            const file = new FileReader()
            file.readAsDataURL(blob)
            file.onload = (e: any) => {
                resolve(e.target.result)
            }
        })
    }
    dataURLtoBlob (dataurl: any) {
        const arr = dataurl.split(',')
        const mime = arr[0].match(/:(.*?);/)[1]
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n) || []
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], {type: mime})
    }
    */
    downLoadFile (file: any, name: string = 'test.jpg') {
        let fileUrl = ''
        if (file.constructor === Blob) {
            fileUrl = window.URL.createObjectURL(file)
        } else if (file.constructor === String) {
            fileUrl = file
        }
        const a: any = document.createElement('a')
        a.download = name
        a.href = fileUrl
        document.getElementsByTagName('body')[0].appendChild(a)
        a.click()
        a.parentNode.removeChild(a)
        window.URL.revokeObjectURL(fileUrl)
    }
    randomid () {
        const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)
        return s4() + s4()
    }
}
</script>

<style lang="scss" scoped>
    .cap {
        max-width: 600px;
        margin: 20px;
        box-shadow: 0 0 6px #ccc;
        padding: 20px;
    }
</style>

<style lang="scss">
    .cap-content {
        display: inline-block;
        width: 100%;

        div {
            max-width: 100% !important;
        }

        img {
            max-width: 100%;
            width: auto;
            height: auto;
            display: block;
            margin: 20px auto;
        }
    }
</style>

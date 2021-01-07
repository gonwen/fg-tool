<!-- DOM截图 -->
<template>
    <div>
        <el-radio-group v-model="model">
            <el-radio-button label="client">当前客户端</el-radio-button>
            <el-radio-button label="serve">nodejs服务端</el-radio-button>
        </el-radio-group>
        <div v-if="model === 'client'" class="cap">
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
        <div v-else v-loading="loading">
            <el-input v-model="website" style="max-width: 900px;">
                <el-button slot="append" @click="puppeteer">执行</el-button>
            </el-input>
            <img v-if="baseImgs" :src="baseImgs" alt="">
        </div>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'nuxt-property-decorator'
import axios from 'axios'
axios.defaults.withCredentials = false
const baseSer = 'http://192.168.1.78/:3093/api/'
const getBase64ByUrl = (url: string) => axios.get(baseSer + 'file/fileByUrl?url=' + url)
const getPuppeteerByUrl = (url: string) => axios.get(baseSer + 'capture/png?url=' + url)

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
    img1: string = 'https://resource.ciip.com/bpscResource/carousel/20200724/d1791e7a99b42068d5cc43e49bc292f1.png'
    img2: string = 'https://resource.ciip.com/bpscResource/carousel/20200724/9b4dee1fd54d877a1a17db08141d8423.png'
    htmlStr: string = '<h5 style="text-align: center;padding-top: 20px;font-size: 18px; color: #666;">DOM 截图</h5><p><img style="overflow-wrap: break-word; cursor: pointer;" src="' + this.img1 + '" width="600" height="332" alt="" /><span style="color: #444444; font-size: 14px;">当前，在室内装修工程中，普遍存在着一系列问题。例如：软件以及读图失真导致的最终工程造价偏离预期较大的问题，以及因为传统软件难以及时地调整与修改设计的错漏以及碰撞问题，使得工程建设出现工程延期以及造价成本抬高的问题。室内装修设计、施工是一项需要丰富经验的系统工作。在CAD时代下，精装修图纸绘制效率低下、错误不易被发现、重复出图等，一直困扰着项目各方。</span><img id="aimg_22365" class="zoom" style="overflow-wrap: break-word; cursor: pointer;" src="' + this.img2 + '" width="600" alt="" /></p>'
    dom: any = null
    model: string = 'client'
    website: string = 'https://www.baidu.com'
    loading: boolean = false
    baseImgs: string = ''
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
    async imgUrl2Blob (imgDom: HTMLImageElement) {
        // getBase64ByUrl
        // const res = await axios({url: imgDom.src, responseType: 'blob'})
        // if (res && res.data.constructor === Blob) {
        //     imgDom.src = await this.blob2Base64Async(res.data)
        // }
        // this.createImage(imgDom)
        const res = await getBase64ByUrl(imgDom.src)
        if (res && res.data && res.data.data) {
            const baseStr = res.data.data
            baseStr.replace(/=+$/, '')
            imgDom.src = baseStr
        }
    }
    createImage (imgDom: HTMLImageElement) {
        const img = new Image
        img.crossOrigin = 'Anonymous'
        img.src = imgDom.src + '?v=' + Math.random()
        img.onload = () => {
            imgDom.src = this.getCanvasBase64Image(img)
        }
    }
    getCanvasBase64Image (img: HTMLImageElement) {
        const canvas = document.createElement('canvas')
        const ctx: any = canvas.getContext('2d')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        ctx.drawImage(img, 0, 0)
        return canvas.toDataURL('image/png')
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
        let fileUrl: any = ''
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
    async puppeteer () {
        this.loading = true
        const res = await getPuppeteerByUrl(this.website)
        this.loading = false
        if (res && res.data && res.data.data) {
            this.baseImgs = res.data.data
        }
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

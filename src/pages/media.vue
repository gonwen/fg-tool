<template>
    <div>
        <video ref="video" width="640" height="480" controls autoplay></video>
        <br>
        <el-button @click="handlePlay('start')">
            开始
        </el-button>
        <el-button @click="handlePlay">
            暂停
        </el-button>
        <div ref="mtser" :class="{'active': isShow}">
            <template v-if="isShow">
                <span v-for="item in 5" :key="item">{{'****' + item + '****'}}</span>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'nuxt-property-decorator'
@Component({
    head () {
        return {
            title: 'MEDIA FRONT-END-TOOL'
        }
    }
})
export default class PageMedia extends Vue {
    recorder: any = null
    // videoStatus: string = 'start'
    isShow: boolean = false
    initVideo () {
        let video = this.$refs.video as any
        const vw = video.clientWidth
        const vh = video.clientHeight
        // chrome浏览器报错  进入设置chrome://flags/#unsafely-treat-insecure-origin-as-secure
        navigator.mediaDevices.getUserMedia({audio: true, video: {width: vw, height: vh}})
            .then((stream: any) => {
                const MediaRecorder = (window as any).MediaRecorder
                this.recorder = new MediaRecorder(stream)
                video.srcObject = stream
                video = (...arg: any) => {
                    console.log(arg)
                }
                this.recorder.ondataavailable = (event: any) => {
                    this.downLoadFile(URL.createObjectURL(event.data))
                    this.$message.info(URL.createObjectURL(event.data))
                }
                this.recorder.start()
                console.log(this.recorder)
            })
            .catch((e) => {
                this.$message.error(e)
            })
    }
    handlePlay (status: string) {
        if (this.recorder) {
            this.recorder[status === 'start' ? 'start' : 'stop']()
        } else if (status === 'start') {
            this.initVideo()
        } else {
            this.$message.error('操作异常')
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
    observer () {
        const observer = new MutationObserver((mutations) => {
            console.log('***mt***', mutations)
        })
        // 开始观察
        observer.observe(this.$refs.mtser as any, {
            attributes: true,
            childList: true,
            subtree: true
        })
        // 停止观察
        // observer.disconnect()
    }
}
</script>

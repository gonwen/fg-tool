<template>
    <div>
        <video ref="video" width="640" height="480" controls autoplay></video>
        <br>
        <el-button @click="handlePlay('start')">开始</el-button>
        <el-button @click="handlePlay">暂停</el-button>
        <div ref="mtser" :class="{'active': isShow}">
            <template v-if="isShow">
                <span v-for="item in 5" :key="item">{{'****' + item + '****'}}</span>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            recorder: null,
            videoStatus: 'start',
            isShow: false
        }
    },
    methods: {
        initVideo () {
            let video = this.$refs.video
            const vw = video.clientWidth
            const vh = video.clientHeight
            navigator.mediaDevices.getUserMedia({audio: true, video: {width: vw, height: vh}})
                .then((stream) => {
                    this.recorder = new MediaRecorder(stream)
                    video.srcObject = stream
                    video = (...arg) => {
                        console.log(arg)
                    }
                    this.recorder.ondataavailable = (event) => {
                        // this.downLoadFile(URL.createObjectURL(event.data))
                        this.$message.info(URL.createObjectURL(event.data))
                    }
                    this.recorder.start()
                    console.log(this.recorder)
                })
                .catch((e) => {
                    this.$message.error(e)
                })
        },
        handlePlay (status) {
            if (this.recorder) {
                this.recorder[status === 'start' ? 'start' : 'stop']()
            } else {
                if (status === 'start') {
                    this.initVideo()
                } else {
                    this.$message.error('操作异常')
                }
            }
        },
        downLoadFile (file, name) {
            let fileUrl = ''
            if (file.constructor === Blob) {
                fileUrl = window.URL.createObjectURL(file)
            } else if (file.constructor === String) {
                fileUrl = file
            }
            const a = document.createElement('a')
            a.download = name || 'test.mp4'
            a.href = fileUrl
            document.getElementsByTagName('body')[0].appendChild(a)
            a.click()
            a.parentNode.removeChild(a)
            window.URL.revokeObjectURL(fileUrl)
        }
    },
    mounted () {
        const observer = new MutationObserver((mutations) => {
            console.log('***mt***', mutations)
        })
        // 开始观察
        observer.observe(this.$refs.mtser, {
            attributes: true,
            childList: true,
            subtree: true
        })
        // 停止观察
        // observer.disconnect()
    }
}
</script>

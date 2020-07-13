<!-- 用户设备指纹采集 -->
<template>
    <div>
        <el-checkbox-group v-model="typeValue">
            <el-checkbox
                v-for="(item, index) in types"
                :key="index"
                :label="item.v"
            >
                {{item.n}}
            </el-checkbox>
        </el-checkbox-group>
        <el-button @click="init">
            采集
        </el-button>
        <span>{{hash}}</span>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'nuxt-property-decorator'
const md5 = require('md5')
interface Printtype {
    n: string
    v: string
}

@Component({
    head () {
        return {
            title: 'FINGERPRINT SHOW FRONT-END-TOOL'
        }
    }
})
export default class PageFingerprint extends Vue {
    hash: string = ''
    typeValue: any = []
    types: Printtype[] = [
        {
            n: 'Canvas',
            v: 'canvas'
        },
        {
            n: 'Audio',
            v: 'audio'
        }
    ]
    init () {
        this.hash = this.getFingerprint()
    }
    getCanvasPrint () {
        const canvas = document.createElement('canvas')
        canvas.width = 100
        canvas.height = 100
        const cs: any = canvas.getContext('2d')
        cs.font = '14px Georgia'
        cs.fillText('FRONT-END TOOL', 0, 0)
        cs.moveTo(0, 0)
        cs.lineTo(0, 100)
        cs.lineTo(100, 100)
        cs.strokeStyle = 'blue'
        cs.stroke()
        return canvas.toDataURL().replace('data:image/png;bases64,', '')
    }
    getAudioPrint () {
        const actx = new AudioContext()
        const oscillator = actx.createOscillator()
        const gainNode = actx.createGain()
        oscillator.connect(gainNode)
        gainNode.connect(actx.destination)
        oscillator.type = 'sine'
        oscillator.frequency.value = 196.00
        gainNode.gain.setValueAtTime(0, actx.currentTime)
        gainNode.gain.linearRampToValueAtTime(1, actx.currentTime + 0.01)
        oscillator.start(actx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 1)
        oscillator.stop(actx.currentTime + 1)
        return 'audio'
    }
    getFingerprint () {
        const tv = this.typeValue
        if (tv.length > 0) {
            let printStr = ''
            tv.forEach((item: any) => {
                if (item === 'canvas') {
                    printStr += this.getCanvasPrint()
                }
                if (item === 'audio') {
                    printStr += this.getAudioPrint()
                }
            })
            return md5(printStr)
        } else {
            this.$message.error('请选择采集模式')
        }
    }
}
</script>

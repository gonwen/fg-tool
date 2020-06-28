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
        <el-button @click="init">采集</el-button>
        <span>{{hash}}</span>
    </div>
</template>

<script>
import md5 from 'md5'
export default {
    data () {
        return {
            hash: '',
            typeValue: [],
            types: [
                {
                    n: 'Canvas',
                    v: 'canvas'
                },
                {
                    n: 'Audio',
                    v: 'audio'
                }
            ]
        }
    },
    methods: {
        init () {
            this.hash = this.getFingerprint()
        },
        getCanvasPrint () {
            const canvas = document.createElement('canvas')
            canvas.width = 100
            canvas.height = 100
            const cs =  canvas.getContext('2d')
            cs.font = '14px Georgia'
            cs.fillText('FRONT-END TOOL', 0, 0)
            cs.moveTo(0, 0)
            cs.lineTo(0, 100)
            cs.lineTo(100, 100)
            cs.strokeStyle = 'blue'
            cs.stroke()
            return canvas.toDataURL().replace('data:image/png;bases64,', '')
        },
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
        },
        getFingerprint () {
            const tv = this.typeValue
            if (tv.length > 0) {
                let printStr = ''
                tv.forEach(item => {
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
}
</script>

<!--
a5ca0b5894324f8bb54bb9fffad29d1e     audio
60753afaaf1464b32b87a004d7487431     audio + canvas
9ca06a97b33cce18cb71a9283db2e028     canvas
75048ca104d25b94f23350ba7a77f4f4     canvas + audio
-->

<!--
// 创建音频上下文
var audioCtx = new AudioContext();
// 创建音调控制对象
var oscillator = audioCtx.createOscillator();
// 创建音量控制对象
var gainNode = audioCtx.createGain();
// 音调音量关联
oscillator.connect(gainNode);
// 音量和设备关联
gainNode.connect(audioCtx.destination);
// 音调类型指定为正弦波
oscillator.type = 'sine';
// 设置音调频率
oscillator.frequency.value = 196.00;
// 先把当前音量设为0
gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
// 0.01秒时间内音量从刚刚的0变成1，线性变化
gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
// 声音走起
oscillator.start(audioCtx.currentTime);
// 1秒时间内音量从刚刚的1变成0.001，指数变化
gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
// 1秒后停止声音
oscillator.stop(audioCtx.currentTime + 1);
-->

<!-- svg base clock -->
<template>
    <svg width="300" height="300">
        <!--<g>
            <rect x="10" y="10" width="200" height="25" stroke="#ccc" fill="none">
                <animate
                    id="c1"
                    attributeName="width"
                    attributeType="XML"
                    from="200" to="20"
                    begin="0s" dur="5s"
                    fill="freeze">
                </animate>
            </rect>
            <circle cx="120" cy="60" r="10" stroke="#ccc" fill="none">
                <animate
                    attributeName="r"
                    attributeType="XML"
                    begin="c1.end+5s"
                    from="10" to="20"
                    dur="4s"
                ></animate>
            </circle>
        </g>
        <g>
            <polygon points="30 30 70 30 90 70 10 70" style="fill:#f4f4f4;stroke:#ccc">
                <animate
                    attributeName="points"
                    attributeType="XML"
                    to="50 30 70 50 50 90 30 50"
                    begin="0s" dur="5s" fill="freeze"
                ></animate>
            </polygon>
            <path d="M15 50 Q40 15,50 50,65 32,100 40" style="fill:#eee;stroke:#ccc" transform="translate(0,50)">
                <animate
                    attributeName="d"
                    attributeType="XML"
                    to="M50 15Q15 40,50 50,32 65,40 100"
                    begin="0s" dur="5s" fill="freeze"
                ></animate>
            </path>
        </g>
        <g transform="translate(100,60)">
            <rect x="-10" y="-10" width="20" height="20" style="fill:#eee;stroke:#ccc">
                <animateTransform
                    attributeType="XML"
                    attributeName="transform" type="scale"
                    from="1" to="4 2"
                    dur ="3s"
                    begin = "0s" fill="freeze"
                ></animateTransform>
            </rect>
        </g>
        <g>
            <rect x="-10" y="-10" width="20" height="20" style="fill:#eee;stroke:#ccc">
                <animateTransform
                    attributeType="XML"
                    attributeName="transform" type="scale"
                    from="1" to="4 2"
                    dur ="3s"
                    begin = "0s" fill="freeze"
                    additive = "sum"
                ></animateTransform>
                <animateTransform
                    attributeType="XML"
                    attributeName="transform" type="rotate"
                    from="0" to="90"
                    dur ="3s"
                    begin = "3s" fill="freeze"
                    additive = "sum"
                ></animateTransform>
            </rect>
        </g>-->
        <!--<g>
            <path id="movePath" d="M50,135C100,25 150,225 200,125" fill="none" stroke="#eee"></path>
            <circle id="movePathCircle" cx="-10" cy="-10" r="6" stroke="#ccc" fill="#eee">
                <animateMotion id="movePathCircleAnimate" dur="3s" fill="freeze">
                    <mpath xlink:href="#movePath"/>
                </animateMotion>
            </circle>
            <circle cx="-10" cy="-10" r="6" stroke="#aaa" fill="#ccc">
                <animateMotion id="movePathCircleTwoAnimate" begin="movePathCircleAnimate.begin + 1s" dur="3s" fill="freeze">
                    <mpath xlink:href="#movePath"/>
                </animateMotion>
            </circle>
            <rect x="-10" y="-10" width="12" height="12" style="fill:#999;stroke:#333">
                <animateMotion begin="movePathCircleTwoAnimate.begin + 1s" dur="3s" fill="freeze" rotate="auto">
                    <mpath xlink:href="#movePath"/>
                </animateMotion>
            </rect>
        </g>-->
        <g transform ="translate(50, 50)">
            <circle :r="clock.cw / 2" stroke="#ccc" fill="none" :transform ="`translate(${clock.cw / 2}, ${clock.ch / 2})`"></circle>
            <g
                v-for="(item, index) in drawCalibration()"
                :id="`clockCalibration${index}`"
                :key="index + 'cb'"
                :transform="`translate(${clock.cw / 2}, ${clock.ch / 2}) rotate(${item.rd}) translate(0, -${clock.ch / 2 - 2})`"
            >
                <rect
                    :width="item.w"
                    :height="item.h"
                    :style="`fill:${item.c};stroke:#333`"
                ></rect>
                <text
                    v-if="item.ih"
                    text-anchor="middle"
                    font-size="10"
                    transform="translate(0, 18)"
                    fill="#666">
                    {{item.tx}}
                </text>
            </g>
            <rect
                v-for="(item, index) in drawPointer()"
                :id="`${item.type}ClockPointer`"
                :key="index"
                :width="item.w"
                :height="item.h"
                :style="`fill:${item.c};stroke:#333`"
                :transform="`translate(${clock.cw / 2}, ${clock.ch / 2}) rotate(${parseToDeg(clock[item.type], item.type)}) translate(-${item.w / 2}, -${item.px})`"
            ></rect>
            <circle r="4" stroke="#999" fill="#ccc" :transform ="`translate(${clock.cw / 2}, ${clock.ch / 2})`"></circle>
            <text text-anchor="middle" font-size="12" fill="#999" :transform ="`translate(${clock.cw / 2}, ${clock.ch + 20})`">{{clock.c}}</text>
        </g>
    </svg>
</template>

<script>
export default {
    data () {
        return {
            //
            clock: {
                c: null, // 当前时间
                h: 0,
                m: 0,
                s: 0,
                cw: 200,
                ch: 200,
                timer: null
            }
        }
    },
    methods: {
        init () {
            clearInterval(this.clock.timer)
            this.clock.timer = setInterval(() => {
                this.getTimeInfo()
            }, 1000)
        },
        parseToDeg (num, type) {
            let dg = 60
            let n = num
            const px = -180
            if (type === 'h') {
                dg = 12
                n = n - 12
            }
            return (n / dg) * 360 + px
        },
        parseToCalibration (index, dg = 60) {
            let w = 1
            let h = 2
            let c = '#ccc'
            let ih = false
            let tx = index || 12
            if (!(index % (dg / 12))) {
                ih = true
                w = 2
                h = 4
                c = '#999'
                tx = index / (dg / 12) || 12
            }
            let rd = (index / dg) * 360
            return {
                w,
                h,
                c,
                tx,
                ih,
                rd
            }
        },
        getTimeInfo () {
            const c = new Date()
            this.clock.c = c
            this.clock.h = c.getHours()
            this.clock.m = c.getMinutes()
            this.clock.s = c.getSeconds()
        },
        drawBox () {

        },
        drawCalibration (dg = 60) {
            let list = []
            for (let i = 0; i < dg; i++) {
                list.push(this.parseToCalibration(i, dg))
            }
            return list
        },
        drawPointer () {
            return [
                {
                    type: 'h',
                    w: 3,
                    h: 50,
                    c: '#ccc',
                    px: 10
                },
                {
                    type: 'm',
                    w: 2,
                    h: 80,
                    c: '#aaa',
                    px: 10
                },
                {
                    type: 's',
                    w: 1,
                    h: 100,
                    c: '#999',
                    px: 20
                }
            ]
        }
    },
    mounted () {
        this.init()
    }
}
</script>

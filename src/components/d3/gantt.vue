<template>
    <div>
        <el-row style="max-width: 1200px;">
            <el-col :span="12">
                <iframe
                    v-show="iframeStatus"
                    ref="iframe"
                    style="width: 100%;opacity: 1"
                    height="340"
                    :src="`static/model/test.html?u=${$route.query.u || base64FileUrl}`"
                ></iframe>
            </el-col>
            <el-col :span="12">
                <div style="max-height: 340px; overflow:auto;">
                    <el-tree
                        v-if="modelInfo.tree && showModel === 'tree'"
                        :data="modelInfo.tree"
                        node-key="dbId"
                        show-checkbox
                        @check="handleTreeCheck"
                        :props="{children: 'children', label: 'name'}">
                    </el-tree>
                    <div v-if="!modelInfo.tree" style="padding: 20px;">
                        <h4>切换操作模式</h4>
                        <el-switch
                            style="margin: 10px 0"
                            v-model="showModel"
                            active-value="tree"
                            inactive-value="echart"
                            active-text="树形"
                            inactive-text="图表">
                        </el-switch>
                        <br>
                        <el-button @click="sentMessageModel">获取</el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div style="max-width: 12000px; padding: 30px 40px;" v-if="sliderInfo.show && showModel === 'echart'">
            <el-row>
                <el-col :span="16">
                    <el-row>
                        <el-col :span="2">
                            <el-button icon="el-icon-caret-right" circle size="mini" @click="hanlePlay"></el-button>
                        </el-col>
                        <el-col :span="22">
                            <el-slider
                                class="gt-slider"
                                v-model="sliderInfo.quality"
                                :max="sliderInfo.max"
                                :min="sliderInfo.min"
                                :step="sliderInfo.step"
                                :format-tooltip="formatSlider"
                                :marks="sliderInfo.marks"
                            ></el-slider>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="6" :offset="2">
                    <el-input
                        style="max-width: 60px;"
                        :min="0"
                        :max="dataForm.data.length"
                        type="number"
                        size="mini"
                        v-model="bezierLineInfo.sIndex"
                    ></el-input>
                    <el-input
                        style="max-width: 60px;"
                        :min="0"
                        :max="dataForm.data.length"
                        type="number"
                        size="mini"
                        v-model="bezierLineInfo.eIndex"
                    ></el-input>
                    <input
                        style="max-width: 60px; border-color: transparent;background-color: transparent;line-height: 28px;"
                        type="color"
                        size="mini"
                        v-model="bezierLineInfo.color"
                    ></input>
                    <el-button size="mini" @click="setBezierLine">设置关联曲线</el-button>
                </el-col>
            </el-row>
        </div>
        <div v-if="showModel === 'echart'">
            <el-row style="background-color: #fafafa">
                <el-col :span="8">
                    <el-form :model="dataForm" style="max-width: 780px;" class="ef-form">
                        <el-row v-for="(item, index) in dataForm.data" :key="index">
                            <el-col :span="8">
                                <el-form-item>
                                    <el-input v-model="dataForm.data[index].text" @change="changeInput"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item>
                                    <!--value-format="yyyy-MM-dd"-->
                                    <el-date-picker
                                        v-model="dataForm.data[index].start"
                                        @change="changeInput"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item>
                                    <el-date-picker
                                        v-model="dataForm.data[index].end"
                                        @change="changeInput"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <div v-if="false">
                            <el-button icon="el-icon-plus" circle size="mini"></el-button>
                            <el-button icon="el-icon-minus" circle size="mini"></el-button>
                        </div>
                    </el-form>
                </el-col>
                <el-col :span="16">
                    <svg :id="$options.name"></svg>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3'
export default {
    name: 'd3Gantt',
    data () {
        return {
            dataForm: {
                data: [
                    // {start: '2020-01-26', end: '2020-02-24', text: '地基基坑'},
                    // {start: "2020-01-26", end: "2021-01-24", text: '主体结构'},
                    // {start: "2021-01-26", end: "2022-01-24", text: '外立面'},
                    // {start: "2021-01-26", end: "2023-01-24", text: '砌体工程'},
                    // {start: "2023-01-26", end: "2024-01-24", text: '装饰专修'},
                    // {start: "2023-01-26", end: "2025-01-24", text: '机电工程'},
                    // {start: '2020-01-26', end: '2020-02-24', text: '地基基坑'},
                    // {start: "2020-01-26", end: "2021-01-24", text: '主体结构'},
                    // {start: "2021-01-26", end: "2022-01-24", text: '外立面'},
                    // {start: "2021-01-26", end: "2023-01-24", text: '砌体工程'},
                    // {start: "2023-01-26", end: "2024-01-24", text: '装饰专修'},
                    // {start: "2023-01-26", end: "2025-01-24", text: '机电工程'},
                    // {start: '2020-01-26', end: '2020-02-24', text: '地基基坑'},
                    // {start: "2020-01-26", end: "2021-01-24", text: '主体结构'},
                    // {start: "2021-01-26", end: "2022-01-24", text: '外立面'},
                    // {start: "2021-01-26", end: "2023-01-24", text: '砌体工程'},
                    // {start: "2023-01-26", end: "2024-01-24", text: '装饰专修'},
                    // {start: "2023-01-26", end: "2025-01-24", text: '机电工程'}
                ]
            },
            eugColors: {
                eugene_blue: "#418FDE",
                eugene_green: "#789D4A",
                rain: "#7A99AC",
                fenders_blue: "#0033A0",
                // police_blue: "#00205B",
                police_blue: '#ccc',
                butter: "#ECD898",
                golden_sun: "#FED141",
                moss: "#B7BF10",
                forest: "#4E5B31",
                fire: "#AF272F",
                pumpkin: "#E87722",
                hazelnut: "#8B5B29",
                bark: "#5E4B3C"
            },
            svg: null,
            width: 1200,
            height: 0,
            rowHeight: 28,
            margin: {
                top: 70,
                bottom: 10,
                left: 20,
                right: 50
            },
            axisInfo: {},
            sliderInfo: {
                step: 24 * 60 * 60 * 1000,
                quality: 0,
                min: 0,
                max: 0,
                marks: {},
                isPlay: false,
                timer: null,
                show: false
            },
            modelInfo: {
                tree: null,
                hide: [],
                show: [],
                status: false
            },
            iframe: null,
            iframeStatus: true,
            endTimeDbId: null, // this is json   key => end date   value  => model dbId
            showDbIds: [],
            bezierLineInfo: {
                sIndex: 1,
                eIndex: 2,
                color: '#000000'
            },
            checkedIds: [], // 选中的 dbid
            showModel: 'echart',
            base64FileUrl: 'aHR0cHM6Ly9teHpoLXByb2Qub3NzLWNuLWJlaWppbmcuYWxpeXVuY3MuY29tL21vZGVsRm9sZGVyX2IzOTMyZjA5LTNiZjgtNDNmZC04MTE2LTI3MzRmNjNjZDdhNS9vdXRwdXQvM2Quc3Zm'
        }
    },
    watch: {
        'sliderInfo.quality' (val) {
            this.d3mMark
                .attr('x1', this.getOptionXscale(val))
                .attr('x2', this.getOptionXscale(val))
            this.sendMessageShowModel(val)
            // if (val !== this.sliderInfo.min) this.sendMessageShowModel(val)
        },
        'modelInfo.tree' (val) {
            if (val) {
                this.initDataForm()
            }
        }
    },
    methods: {
        handleTreeCheck (a, b) {
            let arr = [
                ...b.checkedKeys,
                // ...b.halfCheckedKeys
            ]
            let oarr = this.checkedIds

            // TODO
            // let showArr = this.addFilter(oarr, arr)
            let showArr = arr

            let hideArr = this.deleterFilter(oarr, arr)
            let types = ['hide', 'show']
            types.forEach(item => {
                let itemArr = item === 'hide' ? hideArr : showArr
                if (itemArr.length > 0) {
                    this.iframe.postMessage({
                        t: item,
                        s: true,
                        o: itemArr
                    }, '*')
                }
            })
            this.checkedIds = arr
        },
        addFilter (o, n) {
            return n.filter(i => o.indexOf(i) === -1)
        },
        deleterFilter (o, n) {
            return o.filter(i => n.indexOf(i) === -1)
        },
        formatSlider (val) {
            return this.xAxisTxtFomater(val, 'YMD')
        },
        hanlePlay () {
            let info = this.sliderInfo
            if (info.isPlay) {
                clearInterval(info.timer)
                info.isPlay = false
            } else {
                if (info.quality + info.step > info.max) {
                    clearInterval(info.timer)
                    info.isPlay = false
                    info.quality = info.min
                } else {
                    info.isPlay = true
                    info.timer = setInterval(() => {
                        info.quality += info.step
                        if (info.quality + info.step > info.max) {
                            clearInterval(info.timer)
                            info.isPlay = false
                            // info.quality = info.min
                        }
                    }, 50)
                }
            }
        },
        setSliderInfo () {
            let info = this.axisInfo
            let min = info.omin.getTime()
            let max = info.omax.getTime()
            this.sliderInfo.quality = min
            this.sliderInfo.min = min
            this.sliderInfo.max = max
            this.sliderInfo.marks[min] = this.xAxisTxtFomater(min, 'YMD')
            this.sliderInfo.marks[max] = this.xAxisTxtFomater(max, 'YMD')
            this.sliderInfo.show = true
        },
        init () {
            let width = this.width
            let eugColors = this.eugColors
            let rowHeight = this.rowHeight
            let margin = this.margin
            let data = this.dataForm.data
            let axisInfo = this.getXaxis(data)
            let {min, max, axisData, axisType, omin, omax} = axisInfo
            this.axisInfo = axisInfo
            let height = rowHeight * data.length + margin.top + margin.bottom
            this.height = height
            let x = this.getOptionXscale

            this.svg = d3.select(`svg#${this.$options.name}`)
                .attr('width', width)
                .attr('height', height)
                .attr('font-family', 'sans-serif')
            this.svg.selectAll('g').remove()
            this.svg.selectAll('line').remove()
            this.svg.selectAll('path').remove()


            let g = this.svg.append('g')
            g.selectAll('xaxis')
                .data(axisData)
                .enter()
                .append('text')
                .attr('y', 50)
                .attr('x', d => x(d))
                .text(d => `${this.xAxisTxtFomater(d, axisType)}`)
                .attr('text-anchor', 'middle')
                .attr('fill', eugColors.police_blue)
                .attr('font-size', 10)

            g.selectAll('line')
                .data(axisData)
                .enter()
                .append('line')
                .attr('x1', d => x(d))
                .attr('x2', d => x(d))
                .attr('y1', margin.top)
                .attr('y2', height - margin.bottom)
                .attr('stroke', '#dddddd')


            let row = g.selectAll('row')
                .data(data)
                .enter()
                .append('g')
                .attr('transform', (d, i) => `translate(0, ${margin.top + (i * rowHeight)})`)


            // row.append("text")
            //     .text(d => d.text)
            //     .attr("y", rowHeight / 2)
            //     .attr("fill", eugColors.police_blue)
            //     .attr("font-size", 13)
            //     .attr("text-anchor", "end")
            //     .attr("x", margin.left - 40)
            //     .attr("font-weight", "bold")
            //     .attr("dominant-baseline", "central")

            row.append('rect')
                .attr('width', d => {
                    let n = 0
                    if (d.end && d.start) n = x(d.end) - x(d.start)
                    return  n
                })
                .attr('height', rowHeight - 10)
                .attr("x", d => x(d.start))
                .attr("y", 5)
                .attr("fill", eugColors.police_blue)
                .attr("stroke", "#ffffff")
                .attr("rx", 4)


            row.append("text")
                .text(d => {
                    let s = new Date(d.start).getTime()
                    let e = new Date(d.end).getTime()
                    let step = this.sliderInfo.step
                    return Math.ceil((e - s)/step) + '天'
                })
                .attr("y", rowHeight / 2)
                .attr("fill", "#ffffff")
                .attr("font-size", 10)
                .attr("text-anchor", "middle")
                .attr("x", d => x(d.end) - ((x(d.end) - x(d.start)) / 2))
                //.attr("font-weight", "bold")
                .attr("dominant-baseline", "central")


            this.setRowText(row, 'end')
            this.setRowText(row, 'start')

            this.setSliderInfo()

            // 当前时间进度标识刻度
            this.setInitMartk(omin)
        },
        setBezierLine () {
            let data = this.dataForm.data
            let {sIndex, eIndex, color} = this.bezierLineInfo
            let sItem = data[sIndex]
            let eItem = data[eIndex]
            let m = this.margin
            let rw = this.rowHeight
            let x = this.getOptionXscale
            let x1, y1, x2, y2, dx = 10, dy = Math.abs(sIndex - eIndex) * rw

            x1 = x(sItem.end)
            x2 = x(eItem.start)
            y1 = m.top + (sIndex * rw) + rw/2
            y2 = m.top + (eIndex * rw) + rw/2

            let path = d3.path()
            path.moveTo(x1, y1)
            path.bezierCurveTo(x1 - dx, y1 + dy, x2 + dx, y2 - dy, x2, y2)
            // path.quadraticCurveTo(x1 - dx, y1 + dy, x2, y2)

            this.svg.append('path')
                .attr('d', path.toString())
                .style('fill', 'none')
                .style('stroke', color)
                .style('stroke-width', '1')
        },
        setInitMartk (d) {
            // 当前时间进度刻度
            let {bottom} = this.margin
            let height = this.height
            let x = this.getOptionXscale
            this.d3mMark = this.svg.append('line')
                .attr('x1', x(d))
                .attr('x2', x(d))
                .attr('y1', 30)
                .attr('y2', height + bottom)
                .attr('stroke-width', 2)
                .attr('stroke', '#333')
        },
        setRowText (row, key) {
            let x = this.getOptionXscale
            row.append('text')
                .text(d => `${d[key].toLocaleString().split(',')[0]}`)
                .attr('y', this.rowHeight / 2)
                .attr('fill', '#888888')
                .attr('font-size', 10)
                .attr('text-anchor', key === 'end' ? 'start' : 'end')
                .attr('x', d => x(d[key]) + (key === 'end' ? 5 : -5))
                .attr('font-weight', 'bold')
                .attr('dominant-baseline', 'central')
        },
        getMinAndMaxOrigin (data) {
            let omin = new Date(d3.min(data, d => d.start))
            let omax = new Date(d3.max(data, d => d.end))
            return {omin, omax}
        },
        getMinAndMax (t, org) {
            let origin = JSON.parse(JSON.stringify(org))
            let min = new Date(origin.omin)
            let max = new Date(origin.omax)
            if (t === 'Y') {
                // 冗余1年
                min = new Date(`${min.getFullYear() - 1}-01-01`)
                max = new Date(`${max.getFullYear() + 1}-01-01`)
            }
            if (t === 'M') {
                // 冗余1月
                min.setMonth(min.getMonth())
                max.setMonth(max.getMonth() + 1)
                min = new Date(min.getFullYear() + '-' + (min.getMonth() + 1) + '-01')
                max = new Date(max.getFullYear() + '-' + (max.getMonth() + 1) + '-01')
            }
            if (t === 'D') {
                min.setDate(min.getDate() - 1)
                max.setDate(max.getDate() + 1)
            }
            return {min, max}
        },
        getXaxis (data) {
            let minMaxOrigin = this.getMinAndMaxOrigin(data)
            let omin = minMaxOrigin.omin
            let omax = minMaxOrigin.omax

            let days = 24 * 60 * 60 * 1000
            let nums = (omax - omin) / days // total days
            let axisData = []
            let axisType = 'D' // type  D day  M mouth  Y year
            let step = 1

            if (nums > 3 * 12 * 30) axisType = 'Y' // > 3 year
            else if (nums > 150) axisType = 'M' // > 150 days
            else step = nums > 30 ? Math.ceil(nums / 30) : 1

            let minMax = this.getMinAndMax(axisType, minMaxOrigin)
            let min = minMax.min
            let max = minMax.max

            axisData = this.getAxisData(axisType, min, max, step)

            return {
                axisData,
                axisType,
                ...minMax,
                ...minMaxOrigin
            }
        },
        getAxisData (type, min, max, step) {
            let data = []
            let tgt = new Date(min.getTime())
            let stp = step || 1
            while(tgt <= max) {
                data.push(new Date(tgt.getTime()))
                if (type === 'Y') tgt.setYear(tgt.getFullYear() + stp)
                else if (type === 'M') tgt.setMonth(tgt.getMonth() + stp)
                else if (type === 'D') tgt.setDate(tgt.getDate() + stp)
            }
            return data
        },
        xAxisTxtFomater (dy, tp) {
            let t = new Date(dy)
            let y = t.getFullYear()
            let m = t.getMonth() + 1
            let d = t.getDate()
            let txt = ''
            switch (tp) {
                case 'Y':
                    txt = `${y}年`
                    break
                case 'M':
                    txt = `${m === 1 ? y + '/' : ''}${m}月`
                    break
                case 'D':
                    txt = `${d}日`
                    if (d === 1) txt = `${m}/` + txt
                    if (d === 1 && m === 1) txt = `${y}/` + txt
                    break
                case 'YMD':
                    txt = `${y}年${m}月${d}日`
                case 'YYYYMMDD':
                    txt = `${y}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d}`
            }
            return txt
        },
        getOptionXscale (d) {
            let {min, max} = this.axisInfo
            let {left, right} = this.margin
            let width = this.width
            return d3.scaleTime()
                .domain([min.getTime(), max.getTime()])
                .range([left, width - right])(new Date(d).getTime())
        },
        initFrameInfo () {
            window.addEventListener('message',(e) => {
                let d = e.data
                if (d.sign === 'model') {
                    if (d.modelViewRoot) {
                        this.modelInfo.tree = d.modelViewRoot.children
                        // console.log(this.modelInfo.tree)
                    }
                    if (d.modelLoadingStatus) this.modelInfo.status = true
                }
            })
        },
        sentMessageModel () {
            this.iframe.postMessage({
                t: 'tree',
                s: true
            }, '*')
        },
        sendMessageShowModel (val) {
            let json = this.endTimeDbId
            if (json) {
                let showArr = []
                let hideArr = []
                let ntime = new Date(val).getTime()
                for (let key in json) {
                    let item = json[key]
                    if (item.status === 'show' && new Date(key).getTime() > ntime) {
                        this.endTimeDbId[key].status = 'hide'
                        hideArr.push(item.dbId)
                    }
                    if (item.status === 'hide' && new Date(key).getTime() <= ntime) {
                        this.endTimeDbId[key].status = 'show'
                        showArr.push(item.dbId)
                    }
                }
                let sign = null
                if (hideArr.length > 0) sign = 'hide'
                if (showArr.length > 0) sign = 'show'
                if (!sign) return false
                this.iframe.postMessage({
                    t: sign,
                    s: true,
                    o: sign === 'show' ? showArr : hideArr
                }, '*')
            }
        },
        initDataForm () {
            let arr = this.modelInfo.tree
            if (arr && arr.constructor === Array) {
                this.dataForm.data = []
                let ntime = new Date().getTime()
                let step = this.sliderInfo.step
                arr.forEach(item => {
                    let srm = Math.floor(Math.random() * 400)
                    let erm = Math.floor(Math.random() * 300 + srm + 10)
                    this.dataForm.data.push({
                        start: this.xAxisTxtFomater((ntime + (step * srm)), 'YYYYMMDD'),
                        end: this.xAxisTxtFomater((ntime + (step * erm)), 'YYYYMMDD'),
                        text: item.name,
                        dbId: item.dbId
                    })
                })
                this.changeInput()
                // 隐藏虚影层
                this.iframe.postMessage({
                    t: 'lines',
                    s: true
                }, '*')
            }
        },
        changeInput () {
            let arr = this.dataForm.data
            if (arr && arr.constructor === Array) {
                let json = {}
                arr.forEach(item => {
                    if (item.start && item.end) {
                        json[item.end] = {...item, status: 'show'}
                    }
                })
                this.endTimeDbId = {...json}
                if (this.showModel === 'echart') this.init()
                this.iframeStatus = true
                this.sendMessageShowModel(this.sliderInfo.max)
            }
        }
    },
    created () {
        this.initFrameInfo()
    },
    mounted () {
        // this.init()
        this.$nextTick(() => {
            this.iframe = this.$refs.iframe.contentWindow
            // this.sentMessageModel()
        })
    }
}
</script>

<style lang="scss">
    .el-slider{
        &.gt-slider{
            .el-slider__marks-text{
                width: 100px;
            }
        }
    }
    .ef-form{
        margin-top: 70px;
        .el-form-item{
            margin-bottom: 0;
            .el-input{
                .el-input__inner{
                    line-height: 28px;
                    height: 28px;
                    background-color: transparent;
                }
            }
            .el-form-item__content{
                line-height: 28px;
                height: 28px;
            }
        }
    }
</style>

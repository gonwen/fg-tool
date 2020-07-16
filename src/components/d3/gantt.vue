<template>
    <div>
        <el-row style="max-width: 1200px;">
            <el-col :span="12">
                <iframe
                    v-show="iframeStatus"
                    ref="iframe"
                    style="
                    width: 100%;
                    opacity: 1;"
                    height="340"
                    :src="getIframeUrl()"
                ></iframe>
            </el-col>
            <el-col v-if="!isEchartModel" :span="12">
                <div
                    style="
                    max-height: 340px;
                    overflow: auto;"
                >
                    <el-tree
                        v-if="modelInfo.tree && showModel === 'tree'"
                        :data="modelInfo.tree"
                        node-key="dbId"
                        show-checkbox
                        :props="{children: 'children', label: 'name'}"
                        @node-click="handleTreeClick"
                        @check="handleTreeCheck"
                    >
                    </el-tree>
                    <div v-if="!modelInfo.tree" style="padding: 20px;">
                        <h4>切换操作模式</h4>
                        <el-radio-group v-model="showModel" size="mini" style="margin: 10px 0;">
                            <el-radio-button label="tree">
                                树形
                            </el-radio-button>
                            <el-radio-button label="echart">
                                图表
                            </el-radio-button>
                            <el-radio-button label="more">
                                合模
                            </el-radio-button>
                        </el-radio-group>
                        <br>
                        <el-button v-if="showModel !== 'more' || (showModel === 'more' && isMerge)" size="mini" @click="sentMessageModel">
                            获取
                        </el-button>
                    </div>
                    <el-tree
                        v-if="modelInfo.tree && showModel === 'more'"
                        :data="modelInfo.tree"
                        node-key="dbId"
                        :props="{children: 'children', label: 'name'}"
                    >
                    </el-tree>
                </div>
            </el-col>
        </el-row>
        <div
            v-if="showModel === 'more'"
            style="
            max-width: 1200px;
            padding: 40px 0;"
        >
            <el-form :model="moreModel">
                <h4 style="margin-bottom: 20px;">
                    合模模型信息配置
                </h4>
                <el-row v-for="mindex in moreModel.data.length" :key="mindex">
                    <el-col :span="6">
                        <el-form-item>
                            <el-input v-model="moreModel.data[mindex - 1].oths" placeholder="配置信息备注"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item>
                            <el-input v-model="moreModel.data[mindex - 1].path" placeholder="输入模型网络地址"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-button v-if="!modelInfo.tree" size="mini" @click="submitMoreModel">
                    合模
                </el-button>
            </el-form>
        </div>
        <div v-if="sliderInfo.show && showModel === 'echart'" style="max-width: 12000px; padding: 30px 40px;">
            <el-row>
                <el-col :span="16">
                    <el-row>
                        <el-col :span="2">
                            <el-button icon="el-icon-caret-right" circle size="mini" @click="hanlePlay"></el-button>
                        </el-col>
                        <el-col :span="22">
                            <el-slider
                                v-model="sliderInfo.quality"
                                class="gt-slider"
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
                        v-model="bezierLineInfo.sIndex"
                        style="max-width: 60px;"
                        :min="0"
                        :max="dataForm.data.length"
                        type="number"
                        size="mini"
                    ></el-input>
                    <el-input
                        v-model="bezierLineInfo.eIndex"
                        style="max-width: 60px;"
                        :min="0"
                        :max="dataForm.data.length"
                        type="number"
                        size="mini"
                    ></el-input>
                    <label>
                        <input
                            v-model="bezierLineInfo.color"
                            style="
                            max-width: 60px;
                            border-color: transparent;
                            background-color: transparent;
                            line-height: 28px;"
                            type="color"
                            size="mini"
                        ></input>
                    </label>
                    <el-button size="mini" @click="setBezierLine">
                        设置关联曲线
                    </el-button>
                </el-col>
            </el-row>
        </div>
        <div v-if="showModel === 'echart'">
            <el-row style="background-color: #fafafa;">
                <el-col :span="8">
                    <el-form :model="dataForm" style="max-width: 780px;" class="ef-form">
                        <el-row v-for="index in dataForm.data.length" :key="index">
                            <el-col :span="8">
                                <el-form-item>
                                    <el-input v-model="dataForm.data[index - 1].text" @change="changeInput"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item>
                                    <!--value-format="yyyy-MM-dd"-->
                                    <el-date-picker
                                        v-model="dataForm.data[index - 1].start"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择日期"
                                        @change="changeInput"
                                    >
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item>
                                    <el-date-picker
                                        v-model="dataForm.data[index - 1].end"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择日期"
                                        @change="changeInput"
                                    >
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
                    <svg :id="$options.name" />
                </el-col>
            </el-row>
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
const d3 = require('d3')

@Component({
    name: 'd3Gantt',
    mounted () {
        const that = this as any
        that.initFrameInfo()
        // that.init()
        that.$nextTick(() => {
            that.iframe = that.$refs.iframe.contentWindow
            // that.sentMessageModel()
        })
    }
})
export default class D3Gantt extends Vue {
    @Prop({
        default: false
    })
    isEchartModel!: string
    dataForm: any = {
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
    }
    eugColors: any = {
        eugene_blue: '#418FDE',
        eugene_green: '#789D4A',
        rain: '#7A99AC',
        fenders_blue: '#0033A0',
        // police_blue: "#00205B",
        police_blue: '#ccc',
        butter: '#ECD898',
        golden_sun: '#FED141',
        moss: '#B7BF10',
        forest: '#4E5B31',
        fire: '#AF272F',
        pumpkin: '#E87722',
        hazelnut: '#8B5B29',
        bark: '#5E4B3C'
    }
    svg: any = null
    width: number = 1200
    height: number = 0
    rowHeight: number = 28
    margin: any = {
        top: 70,
        bottom: 10,
        left: 20,
        right: 50
    }
    axisInfo: any = {}
    sliderInfo: any = {
        step: 24 * 60 * 60 * 1000,
        quality: 0,
        min: 0,
        max: 0,
        marks: {},
        isPlay: false,
        timer: null,
        show: false
    }
    modelInfo: any = {
        tree: null,
        hide: [],
        show: [],
        status: false
    }
    iframe: any = null
    iframeStatus: boolean = true
    endTimeDbId: any = null // this is json   key => end date   value  => model dbId
    // showDbIds: any = []
    bezierLineInfo: any = {
        sIndex: 1,
        eIndex: 2,
        color: '#000000'
    }
    checkedIds: any = [] // 选中的 dbid
    showModel: string = this.isEchartModel ? 'echart' : 'more'
    // modelFileUrl: string = ''
    base64FileUrl: string =
        'aHR0cHM6Ly9teHpoLXByb2Qu' +
        'b3NzLWNuLWJlaWppbmcuYWxp' +
        'eXVuY3MuY29tL21vZGVsRm9s' +
        'ZGVyX2IzOTMyZjA5LTNiZjgt' +
        'NDNmZC04MTE2LTI3MzRmNjNj' +
        'ZDdhNS9vdXRwdXQvM2Quc3Zm'
    // 合模配置信息
    moreModel: any = {
        data: [
            {
                path: 'https://mxzh-prod.oss-cn-beijing.aliyuncs.com/modelFolder_0302677f-f855-4c52-8c90-911560a13efd/output/3d.svf',
                oths: '立式多级离心泵'
            },
            {
                path: 'https://mxzh-prod.oss-cn-beijing.aliyuncs.com/modelFolder_e37a185a-420c-4e13-80ad-852b84affbe2/output/3d.svf',
                oths: '给水设备-泵'
            },
            {
                path: 'https://mxzh-prod.oss-cn-beijing.aliyuncs.com/modelFolder_7e2295d4-40a5-410c-8ade-f07f7ffef22a/output/3d.svf',
                oths: 'M_离心泵-卧式端吸'
            },
            {
                path: 'https://mxzh-prod.oss-cn-beijing.aliyuncs.com/modelFolder_7b6da5a1-27b2-4cfb-904d-eeec5cbe0893/output/3d.svf',
                oths: '天花百叶'
            },
            {
                path: 'https://mxzh-prod.oss-cn-beijing.aliyuncs.com/modelFolder_60209531-7866-420c-8121-41b6e3b5efc3/output/3d.svf',
                oths: '地弹簧钢化玻璃门'
            }
        ]
    }
    isMerge: boolean = false
    d3mMark: any = null
    submitMoreModel () {
        const arr = this.moreModel.data
        this.isMerge = true
        this.iframe.postMessage({
            t: 'loadModels',
            s: true,
            o: {files: arr}
        }, '*')
    }
    getIframeUrl () {
        let base = '../../model/test.html?'
        // const base = 'http://www.ciip.com/static/html/model/view.html?'
        base += 'hdtl=e&'
        const qy = this.$route.query
        let surl = ''
        if (this.showModel === 'more') {
            surl = 'vtp=more'
        } else if (qy.u) {
            surl = `u=${qy.u}`
        } else if (qy.file) {
            surl = `file=${qy.file}`
        } else {
            surl = `u=${this.base64FileUrl}`
        }
        return base + surl
    }
    handleTreeClick (data: any, node: any) {
        const o: any = {
            ids: [],
            s: false
        }
        if (node.checked) {
            o.s = true
            const dg = (item: any) => {
                const a = item.children
                if (item.children) {
                    a.forEach((itm: any) => {
                        dg(itm)
                    })
                } else {
                    o.ids.push(item.dbId)
                }
            }
            dg(data)
        }
        this.iframe.postMessage({
            t: 'click',
            s: true,
            o
        }, '*')
    }
    handleTreeCheck (...arg: any) {
        const arr = [
            ...arg[1].checkedKeys
            // ...b.halfCheckedKeys
        ]
        const oarr = this.checkedIds
        // let showArr = this.addFilter(oarr, arr)
        const showArr = arr

        const hideArr = this.deleterFilter(oarr, arr)
        const types = ['hide', 'show']
        types.forEach((item: any) => {
            const itemArr = item === 'hide' ? hideArr : showArr
            if (itemArr.length > 0) {
                this.iframe.postMessage({
                    t: item,
                    s: true,
                    o: itemArr
                }, '*')
            }
        })
        this.checkedIds = arr
    }
    // addFilter (o: any, n: any) {
    //     return n.filter((i: any) => o.includes(i))
    // }
    deleterFilter (o: any, n: any) {
        return o.filter((i: any) => n.includes(i))
    }
    formatSlider (val: any) {
        return this.xAxisTxtFomater(val, 'YMD')
    }
    hanlePlay () {
        const info = this.sliderInfo
        if (info.isPlay) {
            clearInterval(info.timer)
            info.isPlay = false
        } else if (info.quality + info.step > info.max) {
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
    setSliderInfo () {
        const info = this.axisInfo
        const min = info.omin.getTime()
        const max = info.omax.getTime()
        this.sliderInfo.quality = min
        this.sliderInfo.min = min
        this.sliderInfo.max = max
        this.sliderInfo.marks[min] = this.xAxisTxtFomater(min, 'YMD')
        this.sliderInfo.marks[max] = this.xAxisTxtFomater(max, 'YMD')
        this.sliderInfo.show = true
    }
    init () {
        const width = this.width
        const eugColors = this.eugColors
        const rowHeight = this.rowHeight
        const margin = this.margin
        const data = this.dataForm.data
        const axisInfo = this.getXaxis(data)
        const {axisData, axisType, omin} = axisInfo
        this.axisInfo = axisInfo
        const height = rowHeight * data.length + margin.top + margin.bottom
        this.height = height
        const x = this.getOptionXscale

        this.svg = d3.select(`svg#${this.$options.name}`)
            .attr('width', width)
            .attr('height', height)
            .attr('font-family', 'sans-serif')
        this.svg.selectAll('g').remove()
        this.svg.selectAll('line').remove()
        this.svg.selectAll('path').remove()

        const g = this.svg.append('g')
        g.selectAll('xaxis')
            .data(axisData)
            .enter()
            .append('text')
            .attr('y', 50)
            .attr('x', (d: any) => x(d))
            .text((d: any) => `${this.xAxisTxtFomater(d, axisType)}`)
            .attr('text-anchor', 'middle')
            .attr('fill', eugColors.police_blue)
            .attr('font-size', 10)

        g.selectAll('line')
            .data(axisData)
            .enter()
            .append('line')
            .attr('x1', (d: any) => x(d))
            .attr('x2', (d: any) => x(d))
            .attr('y1', margin.top)
            .attr('y2', height - margin.bottom)
            .attr('stroke', '#dddddd')

        const row = g.selectAll('row')
            .data(data)
            .enter()
            .append('g')
            .attr('transform', (...args: any[]) => {
                return `translate(0, ${margin.top + (args[1] * rowHeight)})`
            })

        row.append('rect')
            .attr('width', (d: any) => {
                let n = 0
                if (d.end && d.start) {
                    n = x(d.end) - x(d.start)
                }
                return n
            })
            .attr('height', rowHeight - 10)
            .attr('x', (d: any) => x(d.start))
            .attr('y', 5)
            .attr('fill', eugColors.police_blue)
            .attr('stroke', '#ffffff')
            .attr('rx', 4)

        this.setRowTitileText(row)
        this.setRowText(row, 'end')
        this.setRowText(row, 'start')

        this.setSliderInfo()

        // 当前时间进度标识刻度
        this.setInitMartk(omin)
    }
    setBezierLine () {
        const data = this.dataForm.data
        const {sIndex, eIndex, color} = this.bezierLineInfo
        const sItem = data[sIndex]
        const eItem = data[eIndex]
        const m = this.margin
        const rw = this.rowHeight
        const x = this.getOptionXscale
        const dx = 10
        const dy = Math.abs(sIndex - eIndex) * rw
        const x1 = x(sItem.end)
        const x2 = x(eItem.start)
        const y1 = m.top + (sIndex * rw) + rw / 2
        const y2 = m.top + (eIndex * rw) + rw / 2

        const path: any = d3.path()
        path.moveTo(x1, y1)
        path.bezierCurveTo(x1 - dx, y1 + dy, x2 + dx, y2 - dy, x2, y2)
        // path.quadraticCurveTo(x1 - dx, y1 + dy, x2, y2)

        this.svg.append('path')
            .attr('d', path.toString())
            .style('fill', 'none')
            .style('stroke', color)
            .style('stroke-width', '1')
    }
    setRowTitileText (row: any) {
        const x = this.getOptionXscale
        row.append('text')
            .text((d: any) => {
                const s = new Date(d.start).getTime()
                const e = new Date(d.end).getTime()
                const step = this.sliderInfo.step
                return Math.ceil((e - s) / step) + '天'
            })
            .attr('y', this.rowHeight / 2)
            .attr('fill', '#ffffff')
            .attr('font-size', 10)
            .attr('text-anchor', 'middle')
            .attr('x', (d: any) => x(d.end) - ((x(d.end) - x(d.start)) / 2))
            // .attr('font-weight', 'bold')
            .attr('dominant-baseline', 'central')
    }
    setInitMartk (d: any) {
        // 当前时间进度刻度
        const {bottom} = this.margin
        const height = this.height
        const x = this.getOptionXscale
        this.d3mMark = this.svg.append('line')
            .attr('x1', x(d))
            .attr('x2', x(d))
            .attr('y1', 30)
            .attr('y2', height + bottom)
            .attr('stroke-width', 2)
            .attr('stroke', '#333')
    }
    setRowText (row: any, key: any) {
        const x: any = this.getOptionXscale
        row.append('text')
            .text((d: any) => `${d[key].toLocaleString().split(',')[0]}`)
            .attr('y', this.rowHeight / 2)
            .attr('fill', '#888888')
            .attr('font-size', 10)
            .attr('text-anchor', key === 'end' ? 'start' : 'end')
            .attr('x', (d: any) => x(d[key]) + (key === 'end' ? 5 : -5))
            .attr('font-weight', 'bold')
            .attr('dominant-baseline', 'central')
    }
    getMinAndMaxOrigin (data: any) {
        const omin = new Date(d3.min(data, (d: any) => d.start))
        const omax = new Date(d3.max(data, (d: any) => d.end))
        return {omin, omax}
    }
    getMinAndMax (t: string, org: any) {
        const origin = JSON.parse(JSON.stringify(org))
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
    }
    getXaxis (data: any) {
        const minMaxOrigin = this.getMinAndMaxOrigin(data)
        const omin: any = minMaxOrigin.omin
        const omax: any = minMaxOrigin.omax

        const days = 24 * 60 * 60 * 1000
        const nums = (omax - omin) / days // total days
        let axisData = []
        let axisType = 'D' // type  D day  M mouth  Y year
        let step = 1

        if (nums > 3 * 12 * 30) {
            axisType = 'Y' // > 3 year
        } else if (nums > 150) {
            axisType = 'M' // > 150 days
        } else {
            step = nums > 30 ? Math.ceil(nums / 30) : 1
        }

        const minMax = this.getMinAndMax(axisType, minMaxOrigin)
        const min = minMax.min
        const max = minMax.max

        axisData = this.getAxisData(axisType, min, max, step)

        return {
            axisData,
            axisType,
            ...minMax,
            ...minMaxOrigin
        }
    }
    getAxisData (type: string = 'D', min: any, max: any, step: number = 1) {
        const data = []
        let tg: any = new Date(min.getTime())
        const stp = step
        while (tg <= max) {
            data.push(new Date(tg.getTime()))
            const tgt = tg
            if (type === 'Y') {
                tgt.setYear(tgt.getFullYear() + stp)
            } else if (type === 'M') {
                tgt.setMonth(tgt.getMonth() + stp)
            } else {
                tgt.setDate(tgt.getDate() + stp)
            }
            tg = tgt
        }
        return data
    }
    xAxisTxtFomater (dy: string | number, tp: string) {
        const t = new Date(dy)
        const y = t.getFullYear()
        const m = t.getMonth() + 1
        const d = t.getDate()
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
                if (d === 1) {
                    txt = `${m}/` + txt
                }
                if (d === 1 && m === 1) {
                    txt = `${y}/` + txt
                }
                break
            case 'YMD':
                txt = `${y}年${m}月${d}日`
                break
            case 'YYYYMMDD':
                txt = `${y}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d}`
                break
        }
        return txt
    }
    getOptionXscale (d: any) {
        const {min, max} = this.axisInfo
        const {left, right} = this.margin
        const width = this.width
        return d3.scaleTime()
            .domain([min.getTime(), max.getTime()])
            .range([left, width - right])(new Date(d).getTime())
    }
    initFrameInfo () {
        window.addEventListener('message', (e) => {
            const d = e.data
            if (d.sign === 'model') {
                if (d.modelViewRoot) {
                    const root = d.modelViewRoot
                    if (root.length === 1) {
                        this.modelInfo.tree = root[0].children
                    } else if (root.length > 1 && this.showModel === 'more') {
                        this.modelInfo.tree = []
                        const mData = this.moreModel.data
                        root.forEach((item: any, index: number) => {
                            const cind = Math.abs(root.length - index - 1)
                            this.modelInfo.tree.push({
                                dbId: `##${cind + 1}##`,
                                name: mData[cind].oths,
                                children: item.children
                            })
                        })
                    }
                }
                if (d.modelLoadingStatus) {
                    this.modelInfo.status = true
                    if (this.isEchartModel && d.modelLoadingStatus === 2) {
                        this.sentMessageModel()
                    }
                }
            }
        })
    }
    sentMessageModel () {
        this.iframe.postMessage({
            t: 'tree',
            s: true
        }, '*')
    }
    sendMessageShowModel (val: any) {
        const json = this.endTimeDbId
        if (json) {
            const showArr = []
            const hideArr = []
            const ntime = new Date(val).getTime()
            for (const key in json) {
                if (
                    json.hasOwnProperty(key) // eslint-disable-line no-prototype-builtins
                ) {
                    const item = json[key]
                    if (item.status === 'show' && new Date(key).getTime() > ntime) {
                        this.endTimeDbId[key].status = 'hide'
                        hideArr.push(item.dbId)
                    }
                    if (item.status === 'hide' && new Date(key).getTime() <= ntime) {
                        this.endTimeDbId[key].status = 'show'
                        showArr.push(item.dbId)
                    }
                }
            }
            let sign = null
            if (hideArr.length > 0) {
                sign = 'hide'
            }
            if (showArr.length > 0) {
                sign = 'show'
            }
            if (!sign) {
                return false
            }
            this.iframe.postMessage({
                t: sign,
                s: true,
                o: sign === 'show' ? showArr : hideArr
            }, '*')
        }
    }
    initDataForm () {
        const arr = this.modelInfo.tree
        if (arr && arr.constructor === Array) {
            this.dataForm.data = []
            const ntime = new Date().getTime()
            const step = this.sliderInfo.step
            arr.forEach((item: any) => {
                const srm = Math.floor(Math.random() * 400)
                const erm = Math.floor(Math.random() * 300 + srm + 10)
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
    }
    changeInput () {
        const arr = this.dataForm.data
        if (arr && arr.constructor === Array) {
            const json: any = {}
            arr.forEach((item: any) => {
                if (item.start && item.end) {
                    json[item.end] = {...item, status: 'show'}
                }
            })
            this.endTimeDbId = {...json}
            if (this.showModel === 'echart') {
                this.init()
            }
            this.iframeStatus = true
            this.sendMessageShowModel(this.sliderInfo.max)
        }
    }
    @Watch('sliderInfo.quality', {immediate: false})
    watchQuality (val: any) {
        this.d3mMark
            .attr('x1', this.getOptionXscale(val))
            .attr('x2', this.getOptionXscale(val))
        this.sendMessageShowModel(val)
        // if (val !== this.sliderInfo.min) this.sendMessageShowModel(val)
    }
    @Watch('modelInfo.tree', {immediate: false})
    watchTree (val: any) {
        if (val && this.showModel !== 'more') {
            this.initDataForm()
        }
    }
}
</script>

<style lang="scss">
    .el-slider {
        &.gt-slider {
            .el-slider__marks-text {
                width: 100px;
            }
        }
    }

    .ef-form {
        margin-top: 70px;

        .el-form-item {
            margin-bottom: 0;

            .el-input {
                .el-input__inner {
                    line-height: 28px;
                    height: 28px;
                    background-color: transparent;
                }
            }

            .el-form-item__content {
                line-height: 28px;
                height: 28px;
            }
        }
    }
</style>

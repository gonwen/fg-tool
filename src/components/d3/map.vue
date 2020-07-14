<template>
    <div>
        <!--<el-slider v-model="width" :min="160" :max="1600"></el-slider>
        <el-slider v-model="height" :min="120" :max="900"></el-slider>-->
        <div class="svg">
            <svg :id="$options.name" :width="width" :height="height" :class="{'svg-min': model === 'world'}" @click="changeModel('china')" />
            <svg :id="$options.name + 'world'" :width="wdWidth" :height="wdHeight" :class="{'svg-min': model === 'china'}" @click="changeModel('world')" />
        </div>
        <div v-if="ceng.show" class="map-ceng" :style="{top: `${ceng.y}px`, left: `${ceng.x}px`}">
            <div class="ceng-main">
                <h6>{{ceng.n}}</h6>
                <p v-if="ceng.p">
                    注册企业数
                    <span>{{ceng.p}}</span>
                </p>
                <p v-if="ceng.s">
                    部品资源数
                    <span>{{ceng.s}}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Watch,
    Vue
} from 'nuxt-property-decorator'
import {requestResponse} from '~/../config/axios.conf'
const d3 = require('d3')
const originDataStr: string = '' +
    '[{"n":"北京","p":"2747","s":"14578"},{"n":"江苏","p":"1126","s":"7862"},{"n":"广东","p":"3846","s":"17571"},' +
    '{"n":"贵州","p":"166","s":"152"},{"n":"河南","p":"1024","s":"2526"},{"n":"天津","p":"745","s":"887"},' +
    '{"n":"河北","p":"1364","s":"13333"},{"n":"江西","p":"456","s":"4700"},{"n":"内蒙古","p":"236","s":"971"},' +
    '{"n":"广西","p":"87","s":"933"},{"n":"辽宁","p":"896","s":"1311"},{"n":"吉林","p":"678","s":"865"},' +
    '{"n":"四川","p":"1103","s":"775"},{"n":"甘肃","p":"678","s":"679"},{"n":"湖北","p":"1117","s":"4551"},' +
    '{"n":"上海","p":"1813","s":"12489"},{"n":"浙江","p":"2274","s":"1443"},{"n":"湖南","p":"980","s":"1376"},' +
    '{"n":"山东","p":"1587","s":"307"},{"n":"陕西","p":"759","s":"291"},{"n":"黑龙江","p":"469","s":"291"},' +
    '{"n":"山西","p":"682","s":"217"},{"n":"云南","p":"96","s":"165"},{"n":"重庆","p":"1328","s":"108"},' +
    '{"n":"福建","p":"779","s":"104"},{"n":"青海","p":"30","s":"10"},{"n":"新疆","p":"93","s":"9"},' +
    '{"n":"安徽","p":"483"},{"n":"宁夏","p":"79"},{"n":"西藏","p":"10"},{"n":"海南","p":"19"},' +
    '{"n":"台湾","p":"0"},{"n":"香港","p":"0"},{"n":"澳门","p":"0"}]'
interface Worldorigin {
    name: string
    value: [number, number]
}

@Component({
    name: 'd3Map',
    async mounted () {
        const that = this as any
        await that.getMapData()
        await that.getWorldMapData()
        that.init()
        that.initWord()
    }
})
export default class D3Map extends Vue {
    width: number = 800
    height: number = 600
    wdWidth: number = 200
    wdHeight: number = 140
    model: string = 'china'
    mapData: any = {}
    worldmapData: any = {}
    margin: any = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    }
    OriginData: any = JSON.parse(originDataStr)
    parseData: any = {}
    ceng: any = {
        show: false,
        n: '北京',
        p: '454',
        s: '45645',
        x: 0,
        y: 0
    }
    svg: any = null
    worldSvg: any = null
    worldOrigin: Worldorigin[] = [
        {
            name: '中国',
            value: [104.195397, 35.86166]
        },
        {
            name: '俄罗斯',
            value: [37.511977, 55.767799]
        },
        {
            name: '白俄罗斯',
            value: [27.529114, 53.954141]
        },
        {
            name: '乌克兰',
            value: [30.509476, 50.475794]
        },
        {
            name: '马来西亚',
            value: [101.681748, 3.197445]
        },
        {
            name: '哈萨克斯坦',
            value: [71.475657, 51.281803]
        },
        {
            name: '巴西',
            value: [-47.942336, -15.778623]
        },
        {
            name: '加拿大',
            value: [-75.714762, 45.591873]
        },
        {
            name: '澳大利亚',
            value: [149.098451, -35.259215]
        },
        {
            name: '美国',
            value: [-95.712891, 37.09024]
        }
    ]
    worldCircle: any = null
    async getMapData () {
        let data = {}
        // https://geo.datav.aliyun.com/areas_v2/bound/100000.json
        const url = window.location.origin + '/data/chinamap.json'
        const res: any = await requestResponse('get', url)
        if (res.data) {
            this.mapData = res.data
            data = res.data
        }
        this.getParseData(data, this.OriginData)
        return data
    }
    async getWorldMapData () {
        let data: any = {}
        const url = window.location.origin + '/data/worldmap.json'
        const res: any = await requestResponse('get', url)
        if (res.data) {
            this.worldmapData = res.data
            data = res.data
        }
        return data
    }
    getParseData (map: any, origin: any) {
        const marr: any = map.features
        const org: any = JSON.parse(JSON.stringify(origin))
        marr.forEach((item: any, index: number) => {
            const n: any = item.properties.name
            for (let i = 0; i < org.length; i++) {
                if (n.includes(org[i].n)) {
                    this.parseData[index] = i
                    break
                }
            }
        })
    }
    init () {
        const geoData = this.mapData

        const svg = d3.select(`svg#${this.$options.name}`)
        svg.select('g').remove()
        this.svg = svg

        const ceng = this.ceng
        const that = this

        const wrapper = svg.append('g').attr('class', 'wrapper')
        wrapper.selectAll('path')
            .data(geoData.features)
            .enter()
            .append('path')
            .attr('d', (d: any) => this.geoPath(d))
            .attr('stroke', '#eee')
            .attr('fill', (d: any) => d.properties.name === '北京市' ? '#999' : '#eee')
            .attr('stroke-width', 1)
            .attr('stroke', '#d9d9d9')
            .on('mouseover', function () {
                // @ts-ignore
                that.moveOverInfo(this, arguments[1])
            })
            .on('mouseleave', function () {
                ceng.show = false
                // ceng.attr('display', 'none')
                // @ts-ignore
                d3.select(this).attr('fill', (d: any) => d.properties.name === '北京市' ? '#999' : '#eee')
            })

        svg.call(d3.zoom()
            .on('zoom', () => {
                wrapper.style('stroke-width', `${1.5 / d3.event.transform.k}px`)
                wrapper.attr('transform', d3.event.transform)
            }))
    }
    geoProjection (t: any) {
        const w = t ? this.wdWidth : this.width
        const h = t ? this.wdHeight : this.height
        const zm = t ? 0.2 : 7 / 8
        return d3.geoMercator()
            .center([t ? 0 : 110, t ? 0 : 25])
            .scale([w <= h ? w * zm : h * zm])
            .translate([w / 2, (h / 2) * (t ? 1.4 : 1.2)])
            .precision([0.1])
    }
    geoPath (d: any, t?: any) {
        const pro = this.geoProjection(t)
        return d3.geoPath().projection(pro)(d)
    }
    initWord () {
        const geoData = this.worldmapData

        const svg = d3.select(`svg#${this.$options.name}world`)
        svg.select('g').remove()
        svg.html('')
        this.worldSvg = svg
        console.log(svg)

        const wrapper = svg.append('g').attr('class', 'wrapper')
        wrapper.selectAll('path')
            .data(geoData.features)
            .enter()
            .append('path')
            .attr('d', (d: any) => this.geoPath(d, true))
            .attr('fill', '#eee')
            .attr('stroke-width', 1)
        this.createAllCircles()
    }
    createAllCircles () {
        this.worldSvg.select('g.g-circles').remove()
        this.worldCircle = this.worldSvg.append('g')
            .attr('class', 'g-circles')
        this.worldOrigin.forEach((item: Worldorigin, index: number) => {
            this.drawCircles(item, index)
        })
    }
    drawCircles (item: any, index: number) {
        const zm = this.model === 'china' ? 0.2 : 7 / 8
        const p = this.geoProjection(true)(item.value)
        const x = p[0]
        const y = p[1]
        const uuid = this.getUuid()
        const id = `${uuid}g${index}`
        const g = this.worldCircle.append('g')
            .attr('id', id)
            .attr('transform', `translate(${x}, ${y})`)
        let html = `<text x="0" y="-10" font-size="10px" fill="#999">${item.name}</text>`
        html += this.drawCircleAnimates(zm, id + 'cri')
        g.html(html)
        return g
    }
    drawCircleAnimates (zm: number, id: string) {
        let circleHtml = ''
        circleHtml += this.drawCircleAnimate(zm, id + 'f', `0s;${id}t.end-2s`)
        circleHtml += this.drawCircleAnimate(zm, id + 's', `${id}f.end-2s`)
        circleHtml += this.drawCircleAnimate(zm, id + 't', `${id}s.end-2s`)
        return circleHtml
    }
    drawCircleAnimate (zm: number, id: string, bef: string = '0s') {
        return `<circle cx="0" cy="0" fill="rgba(255,255,255,0)" r="${5 * zm}"
                stroke="#666" stroke-width="1">
                <animate id="${id}" attributeName="r" values="2;10;2"
                repeatCount="indefinite"
                begin="${bef}" dur="4s" fill="freeze"></animate>
                <animate attributeName="stroke"
                values="#666;rgba(102,102,102,0);#666"
                repeatCount="indefinite"
                begin="${bef}" dur="4s"></animate>
                </circle>`
    }
    getUuid () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)
    }
    moveOverInfo (dom: any, i: any) {
        const ceng = this.ceng
        const pd = this.parseData
        const og = this.OriginData
        const e = d3.event
        const info = og[pd[i.toString()]]
        ceng.n = info.n
        ceng.p = info.p
        ceng.s = info.s
        ceng.y = e.y + 20
        ceng.x = e.x + 20
        ceng.show = true
        /* svg 渲染 层
        ceng
            .attr('display', 'block')
            .attr('transform', `translate(${e.x}, ${e.y})`)
        if (info) {
            ceng.select('text.name').text(info.n)
            if (info.p) ceng.select('text.p').text(`人数：${info.p}`)
            if (info.s) ceng.select('text.s').text(`部品数：${info.s}`)
        }
        */
        d3.select(dom).attr('fill', '#ddd')
    }
    creatText (ceng: any, cl: any, x: any, y: any, color: any) {
        ceng.append('text')
            .text('')
            .attr('class', cl)
            .attr('x', x)
            .attr('y', y)
            .attr('fill', color)
            .attr('font-size', 10)
            .attr('text-anchor', 'left')
            .attr('dominant-baseline', 'central')
    }
    changeModel (sign: any) {
        const m = this.model
        if (sign !== m) {
            this.model = m === 'china' ? 'world' : 'china'
        }
    }
    @Watch('width', {immediate: false})
    @Watch('height', {immediate: false})
    changeWidth () {
        if (this.svg) {
            this.init()
        }
    }
    @Watch('wdWidth', {immediate: false})
    @Watch('wdHeight', {immediate: false})
    changeWdwidth () {
        if (this.worldSvg) {
            this.initWord()
        }
    }
    @Watch('model', {immediate: false})
    watchModel (val: any) {
        this.ceng.show = false
        const size = [800, 600, 200, 140]
        const f = val === 'china'
        this.width = f ? size[0] : size[2]
        this.height = f ? size[1] : size[3]
        this.wdWidth = f ? size[2] : size[0]
        this.wdHeight = f ? size[3] : size[1]
    }
}
</script>

<style scoped lang="scss">
    .svg {
        /* margin: 0 auto; */
        border: 1px solid #eee;
        position: relative;
        width: 800px;
        height: 600px;

        .svg-min {
            position: absolute;
            width: 200px;
            height: 140px;
            border: 1px solid #eee;
            left: 20px;
            bottom: 20px;
            z-index: 2;
        }
    }

    .map-ceng {
        position: fixed;
        top: 0;
        left: 0;
        width: 120px;
        background-color: rgba(0, 0, 0, 0.6);
        color: #fff;
        line-height: 16px;
        z-index: 999999;
        border-radius: 4px;

        .ceng-main {
            padding: 6px;
        }

        h6 {
            font-size: 14px;
            line-height: 20px;
        }

        p {
            font-size: 12px;

            span {
                color: #ccc;
                margin-left: 5px;
            }
        }
    }
</style>

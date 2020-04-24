<template>
    <div>
        <svg :id="$options.name" style="border: 1px solid #eee;" width="800" height="600"></svg>
        <div class="map-ceng" v-if="ceng.show" :style="{top: `${ceng.y}px`, left: `${ceng.x}px`}">
            <div class="ceng-main">
                <h6>{{ceng.n}}</h6>
                <p v-if="ceng.p">注册企业数<span>{{ceng.p}}</span></p>
                <p v-if="ceng.s">部品资源数<span>{{ceng.s}}</span></p>
            </div>
        </div>
    </div>
</template>

<script>
import {requestResponse} from '../../config/axiosconfig'
import * as d3 from 'd3'
export default {
    name: 'd3Map',
    data () {
        return {
            mapData: {},
            worldmapData: {},
            margin: {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
            },
            OriginData: [
                {'n': '北京', 'p': '2747', 's': '14578'},
                {'n': '江苏', 'p': '1126', 's': '7862'},
                {'n': '广东', 'p': '3846', 's': '17571'},
                {'n': '贵州', 'p': '166', 's': '152'},
                {'n': '河南', 'p': '1024', 's': '2526'},
                {'n': '天津', 'p': '745', 's': '887'},
                {'n': '河北', 'p': '1364', 's': '13333'},
                {'n': '江西', 'p': '456', 's': '4700'},
                {'n': '内蒙古', 'p': '236', 's': '971'},
                {'n': '广西', 'p': '87', 's': '933'},
                {'n': '辽宁', 'p': '896', 's': '1311'},
                {'n': '吉林', 'p': '678', 's': '865'},
                {'n': '四川', 'p': '1103', 's': '775'},
                {'n': '甘肃', 'p': '678', 's': '679'},
                {'n': '湖北', 'p': '1117', 's': '4551'},
                {'n': '上海', 'p': '1813', 's': '12489'},
                {'n': '浙江', 'p': '2274', 's': '1443'},
                {'n': '湖南', 'p': '980', 's': '1376'},
                {'n': '山东', 'p': '1587', 's': '307'},
                {'n': '陕西', 'p': '759', 's': '291'},
                {'n': '黑龙江', 'p': '469', 's': '291'},
                {'n': '山西', 'p': '682', 's': '217'},
                {'n': '云南', 'p': '96', 's': '165'},
                {'n': '重庆', 'p': '1328', 's': '108'},
                {'n': '福建', 'p': '779', 's': '104'},
                {'n': '青海', 'p': '30', 's': '10'},
                {'n': '新疆', 'p': '93', 's': '9'},
                {'n': '安徽', 'p': '483'},
                {'n': '宁夏', 'p': '79'},
                {'n': '西藏', 'p': '10'},
                {'n': '海南', 'p': '19'},
                {'n': '台湾', 'p': '0'},
                {'n': '香港', 'p': '0'},
                {'n': '澳门', 'p': '0'}
            ],
            parseData: {},
            ceng: {
                show: false,
                n: '北京',
                p: '454',
                s: '45645',
                x: 0,
                y: 0
            }
        }
    },
    methods: {
        async getMapData () {
            let data = {}
            // https://geo.datav.aliyun.com/areas_v2/bound/100000.json
            let res = await requestResponse('get', 'static/data/chinamap.json')
            if (res.data) {
                this.mapData = res.data
                data = res.data
            }
            this.getParseData(data, this.OriginData)
            return data
        },
        getParseData (map, origin) {
            let marr = map.features
            let org = JSON.parse(JSON.stringify(origin))
            marr.forEach((item, index) => {
                let n = item.properties.name
                for (let i = 0; i < org.length; i ++) {
                    if (n.indexOf(org[i].n) > -1) {
                        this.parseData[index] = i
                        break
                    }
                }
            })
        },
        async init () {
            const geoData = await this.getMapData()
            let margin = this.margin
            let width = 800 - margin.left - margin.right
            let height = 600 - margin.top - margin.bottom
            const svg = d3.select(`svg#${this.$options.name}`)
            const projection = d3.geoMercator()
                .center([110, 25])
                .scale([500])
                .translate([450,350])
                .precision([.1])
            const geoPath = d3.geoPath()
                .projection(projection)

            let ceng = this.ceng
            let that = this

            const wrapper = svg.append('g').attr('class', 'wrapper')
            wrapper.selectAll('path')
                .data(geoData.features)
                .enter()
                .append('path')
                .attr('d', d => geoPath(d))
                .attr('stroke', '#eee')
                .attr('fill', d => d.properties.name === '湖南省' ? '#ddd' : '#eee')
                .attr('stroke-width', 1)
                .attr('stroke', '#d9d9d9')
                .on('mouseover', function(d, i) {
                    that.moveOverInfo(this, d, i)
                })
                .on('mouseleave', function(d) {
                    ceng.show = false
                    // ceng.attr('display', 'none')
                    d3.select(this).attr("fill", '#eee')
                })

            svg.call(d3.zoom()
                .on('zoom', () => {
                    wrapper.style('stroke-width', `${1.5 / d3.event.transform.k}px`)
                    wrapper.attr('transform', d3.event.transform)
                }))
            /* svg 渲染 层
            ceng = svg.append('g').attr('display', 'none')
            ceng.append('rect')
                .attr('width', 100)
                .attr('height', 60)
                .attr('x', 0)
                .attr('y', 0)
                .attr('fill', 'rgba(102,102,102,0.8)')
                .attr('rx', 4)
            this.creatText(ceng, 'name', 10, 15, '#fff')
            this.creatText(ceng, 'p', 10, 30, '#eee')
            this.creatText(ceng, 's', 10, 45, '#eee')
            */
        },
        moveOverInfo (dom, d, i) {
            let ceng = this.ceng
            let pd = this.parseData
            let og = this.OriginData
            let e = d3.event
            let info = og[pd[i.toString()]]
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
        },
        creatText (ceng, cl, x, y, color) {
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
    },
    created () {
        this.init()
    }
}
</script>

<style scoped lang="scss">
.map-ceng{
    position: fixed;
    top: 0;
    left: 0;
    width: 120px;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    line-height: 16px;
    z-index: 999999;
    border-radius: 4px;
    .ceng-main{
        padding: 6px;
    }
    h6{
        font-size: 14px;
        line-height: 20px;
    }
    p{
        font-size: 12px;
        span{
            color: #0096e2;
            margin-left: 5px;
        }
    }
}
</style>

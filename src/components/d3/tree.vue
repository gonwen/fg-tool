<template>
    <div :id="id" class="tree-container">
        <el-form ref="treeForm" style="max-width: 1200px;">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="MMD文件地址" label-width="120px">
                        <el-input v-model="fileUrl"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="node解析服务" label-width="120px">
                        <el-input v-model="serUrl">
                            <el-button slot="append" @click="getTree">
                                查询
                            </el-button>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <svg class="d3-tree">
            <g class="container" />
        </svg>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'nuxt-property-decorator'
import {requestResponse} from '~/../config/axios.conf'
const d3 = require('d3')
// const dataset = {"name":"用户中心[2.6迭代]","node":[{"name":"首页[调整]","node":[{"name":"@LZ"}]},{"name":"项目管理[新增]","node":[{"name":"@LZ"}]},{"name":"订单管理","node":[{"name":"@LZ"}]},{"name":"资金管理","node":[{"name":"@LZ"}]},{"name":"用户中心-菜单[调整]","node":[{"name":"@GW"}]},{"name":"用户中心-菜单权限控制[调整]","node":[{"name":"@GW"}]},{"name":"用户中心-权限管理[调整]","node":[{"name":"@GW"}]},{"name":"账号管理-企业信息-企业认证[调整]","node":[{"name":"@ZX"}]},{"name":"账号管理-企业信息[调整]","node":[{"name":"@ZX"}]},{"name":"注册[调整]","node":[{"name":"@ZX"}]},{"name":"登录[调整]","node":[{"name":"@ZX"}]},{"name":"云盘管理[调整]","node":[{"name":"@TCY"}]},{"name":"应用工作台[调整]","node":[{"name":"@TCY"}]},{"name":"申请加入企业页面[调整]","node":[{"name":"@TCY"}]},{"name":"子平台用户名称+用户信息[调整]","node":[{"name":"@GW"}]},{"name":"金优家关联性其他细节调整优化","node":[{"name":"@TCY"}]},{"name":"云工厂关联性其他细节调整优化","node":[{"name":"@LZ"}]},{"name":"云应用关联性其他细节调整优化","node":[{"name":"@ZX"}]},{"name":"CIIP后台-企业认证审核[调整]","node":[{"name":"@LZ"}]},{"name":"用户中心各版块检查测试联调","node":[{"config":{"collapsed":"true"},"name":"@TCY","node":[{"name":"文化工作台"},{"name":"应用工作台"},{"name":"供应方工作台/商品管理"},{"name":"云盘管理"},{"name":"账号管理/我的企业"}]},{"config":{"collapsed":"true"},"name":"@LZ","node":[{"name":"智能建造工作台/项目管理"},{"name":"供应方工作台/订单管理"},{"name":"供应方工作台/资金管理"},{"name":"需求方工作台/订单管理"},{"name":"需求方工作台/资金管理"},{"name":"企业管理工作台/企业钱包"}]},{"config":{"collapsed":"true"},"name":"@ZX","node":[{"name":"企业管理工作台/企业信息、企业认证、资质管理"},{"name":"账号管理/[除我的企业外]"},{"name":"消息管理"},{"name":"我的下载"},{"name":"我的收藏"}]},{"name":"@GW","node":[{"name":"企业管理工作台/组织管理、权限管理"},{"name":"供应方工作台/产品管理"},{"name":"供应方工作台/门店与代理"}]}]},{"name":"子平台检查测试联调","node":[{"name":"@TCY","node":[{"name":"金优家"},{"name":"建筑百科"}]},{"name":"@LZ","node":[{"name":"部品工厂"},{"name":"项目中心"}]},{"name":"@ZX","node":[{"name":"云应用市场"},{"name":"云采购"}]},{"name":"@GW","node":[{"name":"其他子平台网站"}]}]}]}
const dataset = '{"name":"平台建筑研究院 + 在线办公 + 智企服务","node":[{"config":{"fileUrl":"src/pages/community"},"name":"社群中心[/community]","node":[{"config":{"fileUrl":"src/pages/community/enterprise"},"name":"智企服务[/community/enterprise]##@ZXG##"},{"config":{"fileUrl":"src/pages/community/online"},"name":"在线办公[/community/online]##@WMZ##"},{"config":{"fileUrl":"src/pages/community/wiki/index.vue"},"name":"维基文化[/community/wiki]##@ZXG##"}]},{"config":{"fileUrl":"src/pages/institute"},"name":"平台建筑研究院[/institute]","node":[{"config":{"fileUrl":"src/pages/institute/index.vue"},"name":"首页[/institute]##@LZ##"},{"config":{"fileUrl":"src/pages/institute/certificate.vue"},"name":"证书对接[/institute/certificate]##@TCY##"},{"config":{"fileUrl":"src/pages/institute/qualification.vue"},"name":"资质对接[/institute/qualification]##@ZX##"},{"config":{"fileUrl":"src/pages/institute/standard.vue"},"name":"标准服务[/institute/standard]##@LZ##"},{"config":{"fileUrl":"src/pages/institute/expert.vue"},"name":"专家库[/institute/expert]##@GW##","node":[{"name":"无需ui"}]},{"config":{"fileUrl":"src/pages/institute/d/_class.vue"},"name":"需求列表[/institute/d/_class]##@GW##","node":[{"name":"无需ui"}]},{"config":{"fileUrl":"src/pages/institute/s/_class.vue"},"name":"服务列表[/institute/s/_class]##@GW##","node":[{"name":"无需ui"}]}]}]}'
interface Color {
    text: string
    bg: string
}
@Component({
    name: 'd3Tree',
    created () {
        // const that = this as any
        // that.id = that.uuid()
    },
    mounted () {
        const that = this as any
        that.id = that.uuid()
        that.$nextTick(() => {
            (this as any).init()
        })
    }
})
export default class D3Tree extends Vue {
    dataTree: any = JSON.parse(dataset)
    serUrl: string = 'http://172.10.10.176:3093/api/mmd/tree'
    fileUrl: string = 'F:\\svn\\client-project\\qiao-nuxt\\readme_institute.mmd'
    id: string = ''
    zoom: any = null
    index: number = 0
    duration: number = 750
    root: any = null
    nodes: any = []
    links: any = []
    dTreeData: any = null
    transform: any = null
    margin: any = {top: 20, right: 90, bottom: 30, left: 90}
    height: number = 0
    width: number = 0
    color: Color[] = [
        {
            text: '#fff',
            bg: '#666'
        },
        {
            text: '#666',
            bg: '#ccc'
        },
        {
            text: '#666',
            bg: '#eee'
        },
        {
            text: '#fff',
            bg: '#11a9e8'
        }
    ]
    uuid () {
        const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)
        return s4() +
            s4() +
            '-' +
            s4() +
            '-' +
            s4() +
            '-' +
            s4() +
            '-' +
            s4() +
            s4() +
            s4()
    }
    getRoot () {
        const root = d3.hierarchy(this.dataTree, (d: any) => d.node)
        root.x0 = this.height / 2
        root.y0 = 0
        return root
    }
    clickNode (d: any) {
        if (!d._children && !d.children) {
            return
        }
        if (d.children) {
            this.$set(d, '_children', d.children)
            d.children = null
        } else {
            this.$set(d, 'children', d._children)
            d._children = null
        }
        this.$nextTick(
            () => {
                this.update(d)
            }
        )
    }
    diagonal (s: any, d: any) {
        // const px = d.pxw || 0
        // d.y = d.y + px
        return `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                ${(s.y + d.y) / 2} ${d.x},
                ${d.y} ${d.x}`
    }
    getNodesAndLinks () {
        this.dTreeData = this.treemap(this.root)
        this.nodes = this.dTreeData.descendants()
        this.links = this.dTreeData.descendants().slice(1)
    }
    update (source: any) {
        this.getNodesAndLinks()
        this.nodes.forEach((d: any) => {
            d.y = d.depth * 280
        })
        const svg = d3.select(this.$el).select('svg.d3-tree')
        const container = svg.select('g.container')
        const node = container.selectAll('g.node')
            .data(this.nodes, (d: any) => {
                return d.id || (d.id = ++this.index)
            })
        const nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .on('click', this.clickNode)
            .attr('transform', () => 'translate(' + source.y0 + ',' + source.x0 + ')')

        nodeEnter.append('text')
            .attr('x', 15)
            .attr('dy', '.35em')
            .attr('text-anchor', 'start')
            .attr('font-size', 12)
            .text((d: any) => d.data.name)
            .style('fill-opacity', 1e-6)

        nodeEnter.append('rect')
            .attr('x', 0)
            .attr('y', -15)
            .attr('width', (d: any, i: number) => {
                const dom = nodeEnter._groups[0][i].children[0]
                const w = dom.clientWidth || dom.scrollWidth
                d.pxw = w
                return w
            })
            .attr('height', 30)
            .attr('fill', (d: any) => this.color[d.depth >= 4 ? 3 : d.depth].bg)
            .attr('fill-opacity', 1)
            .attr('rx', 6)
            .attr('ry', 6)

        nodeEnter.append('text')
            .attr('class', 'text')
            .attr('x', 15)
            .attr('dy', '.35em')
            .attr('text-anchor', 'start')
            .attr('font-size', 12)
            .attr('fill', (d: any) => this.color[d.depth >= 4 ? 3 : d.depth].text)
            .text((d: any) => d.data.name)
            .style('fill-opacity', 1e-6)
        const nodeUpdate = nodeEnter.merge(node)
            .transition()
            .duration(this.duration)
            .attr('transform', (d: any) => 'translate(' + d.y + ',' + d.x + ')')
        nodeUpdate.select('text.text')
            .style('fill-opacity', 1)
        const nodeExit = node.exit()
            .transition()
            .duration(this.duration)
            .attr('transform', () => 'translate(' + source.y + ',' + source.x + ')')
            .remove()
        nodeExit.select('text.text')
            .style('fill-opacity', 1e-6)
        const link = container.selectAll('path.link')
            .data(this.links, (d: any) => { return d.id })
        const linkEnter = link.enter().insert('path', 'g')
            .attr('class', 'link')
            .attr('d', () => {
                const o = {x: source.x0, y: source.y0}
                return this.diagonal(o, o)
            })
            .attr('fill', 'none')
            .attr('stroke-width', 1)
            .attr('stroke', '#ccc')

        const linkUpdate = linkEnter.merge(link)
        linkUpdate.transition()
            .duration(this.duration)
            .attr('d', (d: any) => this.diagonal(d, d.parent))

        link.exit().transition()
            .duration(this.duration)
            .attr('d', () => {
                const o = {x: source.x, y: source.y}
                return this.diagonal(o, o)
            })
            .remove()

        this.nodes.forEach((d: any) => {
            d.x0 = d.x
            d.y0 = d.y
        })
    }
    zoomed () {
        d3.select(this.$el).select('g.container').attr('transform', d3.event.transform)
    }
    async getTree () {
        const surl = this.serUrl
        const path = this.fileUrl
        if (path) {
            const res: any = await requestResponse('get', surl, {path})
            if (res.data && res.data.flag) {
                this.dataTree = res.data.data[0]
                this.init()
            } else {
                this.$notify({
                    title: '提示',
                    message: '获取失败',
                    type: 'error'
                })
            }
        }
    }
    init () {
        // 创建svg画布
        const dow = document.getElementById(this.id) as any
        const formDom: any = this.$refs.treeForm
        this.width = dow.clientWidth
        this.height = dow.clientHeight - formDom.$el.clientHeight
        const svg = d3.select(this.$el).select('svg.d3-tree')
            .attr('width', this.width)
            .attr('height', this.height)
        const transform = d3.zoomIdentity.translate(this.margin.left, this.margin.top).scale(1)
        const container = svg.select('g.container')
        // init zoom behavior, which is both an object and function
        this.zoom = d3.zoom()
            .scaleExtent([1 / 2, 8])
            .on('zoom', this.zoomed)
        container.transition().duration(750).call(this.zoom.transform, transform)
        svg.call(this.zoom)
        this.root = this.getRoot()
        this.update(this.root)
    }
    get treemap () {
        return d3.tree().size([this.height, this.width])
    }
}
</script>

<style lang='scss' scoped>
    .tree-container {
        width: 100%;
        height: 900px;
    }

    .d3-tree {
        .node {
            cursor: pointer;
        }

        .node circle {
            fill: #fff;
            stroke: #999;
            stroke-width: 1.5px;
        }

        .node text {
            font: 18px sans-serif;
        }

        .link {
            fill: none;
            stroke: #ccc;
            stroke-width: 1.5px;
        }
    }
</style>

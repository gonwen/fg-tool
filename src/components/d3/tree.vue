<template>
    <div class="tree-container" :id="id">
        <el-form style="max-width: 1200px;">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="MMD文件地址" label-width="120px">
                        <el-input v-model="fileUrl"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="node解析服务" label-width="120px">
                        <el-input v-model="serUrl">
                            <el-button slot="append" @click="getTree">查询</el-button>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <svg class="d3-tree">
            <g class="container"></g>
        </svg>
    </div>
</template>
<script>
const dataset = {"name":"用户中心[2.6迭代]","node":[{"name":"首页[调整]","node":[{"name":"@LZ"}]},{"name":"项目管理[新增]","node":[{"name":"@LZ"}]},{"name":"订单管理","node":[{"name":"@LZ"}]},{"name":"资金管理","node":[{"name":"@LZ"}]},{"name":"用户中心-菜单[调整]","node":[{"name":"@GW"}]},{"name":"用户中心-菜单权限控制[调整]","node":[{"name":"@GW"}]},{"name":"用户中心-权限管理[调整]","node":[{"name":"@GW"}]},{"name":"账号管理-企业信息-企业认证[调整]","node":[{"name":"@ZX"}]},{"name":"账号管理-企业信息[调整]","node":[{"name":"@ZX"}]},{"name":"注册[调整]","node":[{"name":"@ZX"}]},{"name":"登录[调整]","node":[{"name":"@ZX"}]},{"name":"云盘管理[调整]","node":[{"name":"@TCY"}]},{"name":"应用工作台[调整]","node":[{"name":"@TCY"}]},{"name":"申请加入企业页面[调整]","node":[{"name":"@TCY"}]},{"name":"子平台用户名称+用户信息[调整]","node":[{"name":"@GW"}]},{"name":"金优家关联性其他细节调整优化","node":[{"name":"@TCY"}]},{"name":"云工厂关联性其他细节调整优化","node":[{"name":"@LZ"}]},{"name":"云应用关联性其他细节调整优化","node":[{"name":"@ZX"}]},{"name":"CIIP后台-企业认证审核[调整]","node":[{"name":"@LZ"}]},{"name":"用户中心各版块检查测试联调","node":[{"config":{"collapsed":"true"},"name":"@TCY","node":[{"name":"文化工作台"},{"name":"应用工作台"},{"name":"供应方工作台/商品管理"},{"name":"云盘管理"},{"name":"账号管理/我的企业"}]},{"config":{"collapsed":"true"},"name":"@LZ","node":[{"name":"智能建造工作台/项目管理"},{"name":"供应方工作台/订单管理"},{"name":"供应方工作台/资金管理"},{"name":"需求方工作台/订单管理"},{"name":"需求方工作台/资金管理"},{"name":"企业管理工作台/企业钱包"}]},{"config":{"collapsed":"true"},"name":"@ZX","node":[{"name":"企业管理工作台/企业信息、企业认证、资质管理"},{"name":"账号管理/[除我的企业外]"},{"name":"消息管理"},{"name":"我的下载"},{"name":"我的收藏"}]},{"name":"@GW","node":[{"name":"企业管理工作台/组织管理、权限管理"},{"name":"供应方工作台/产品管理"},{"name":"供应方工作台/门店与代理"}]}]},{"name":"子平台检查测试联调","node":[{"name":"@TCY","node":[{"name":"金优家"},{"name":"建筑百科"}]},{"name":"@LZ","node":[{"name":"部品工厂"},{"name":"项目中心"}]},{"name":"@ZX","node":[{"name":"云应用市场"},{"name":"云采购"}]},{"name":"@GW","node":[{"name":"其他子平台网站"}]}]}]}
import {requestResponse} from '../../config/axiosconfig'
import * as d3 from 'd3'
export default {
    name: 'd3Tree',
    data() {
        return {
            dataTree: dataset,
            serUrl: 'http://172.10.10.176:3093/api/mmd/tree',
            fileUrl: 'F:\\svn\\client-project\\ciip-member-nuxt\\readme_4.0.mmd',
            id: '',
            zoom: null,
            index: 0,
            duration: 750,
            root: null,
            nodes: [],
            links: [],
            dTreeData: null,
            transform: null,
            margin: { top: 20, right: 90, bottom: 30, left: 90 },
            color: [
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
        }
    },
    methods: {
        uuid () {
            const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1)
            return s4()
                + s4()
                + '-'
                + s4()
                + '-'
                + s4()
                +  '-'
                + s4()
                + '-'
                + s4()
                + s4()
                + s4()
        },
        getRoot () {
            let root = d3.hierarchy(this.dataTree, d => d.node)
            root.x0 = this.height / 2
            root.y0 = 0
            return root
        },
        clickNode (d) {
            if (!d._children && !d.children) return
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
        },

        diagonal (s, d) {
            return `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                ${(s.y + d.y) / 2} ${d.x},
                ${d.y} ${d.x}`
        },
        getNodesAndLinks () {
            console.log(this.treemap(this.root))
            this.dTreeData = this.treemap(this.root)
            this.nodes = this.dTreeData.descendants()
            this.links = this.dTreeData.descendants().slice(1)
        },
        update (source) {
            this.getNodesAndLinks()
            this.nodes.forEach(d => {
                d.y = d.depth * 280
            })
            const svg = d3.select(this.$el).select('svg.d3-tree')
            const container = svg.select('g.container')
            let node = container.selectAll('g.node')
                .data(this.nodes, d => {
                    return d.id || (d.id = ++this.index)
                })
            let nodeEnter = node.enter().append('g')
                .attr('class', 'node')
                .on('click', this.clickNode)
                .attr('transform', d => 'translate(' + source.y0 + ',' + source.x0 + ')')

            nodeEnter.append('text')
                .attr('x', 15)
                .attr('dy', '.35em')
                .attr('text-anchor', 'start')
                .attr('font-size', 12)
                .text(d => d.data.name)
                .style('fill-opacity', 1e-6)

            let rect = nodeEnter.append('rect')
                .attr('x', (d, i) => 0)
                .attr('y', d => -15)
                .attr('width', (d, i) => {
                    const dom = nodeEnter['_groups'][0][i].children[0]
                    // const w = dom.clientWidth || dom.scrollWidth
                    // console.log(d.data.name + '**scrollWidth**' + dom.scrollWidth + '**clientWidth**' + dom.clientWidth)
                    return dom.clientWidth || dom.scrollWidth
                })
                .attr('height', 30)
                .attr('fill', d => this.color[d.depth >= 4 ? 3 : d.depth].bg)
                .attr('fill-opacity', 1)
                .attr('rx', 6)
                .attr('ry', 6)

            nodeEnter.append('text')
                .attr('class', 'text')
                .attr('x', 15)
                .attr('dy', '.35em')
                .attr('text-anchor', 'start')
                .attr('font-size', 12)
                .attr('fill', d => this.color[d.depth >= 4 ? 3 : d.depth].text)
                .text(d => d.data.name)
                .style('fill-opacity', 1e-6)


            let nodeUpdate = nodeEnter.merge(node)
                .transition()
                .duration(this.duration)
                .attr('transform', (d, i) => 'translate(' + d.y + ',' + d.x + ')')


            nodeUpdate.select('text.text')
                .style('fill-opacity', 1)

            let nodeExit = node.exit()
                .transition()
                .duration(this.duration)
                .attr('transform', (d, i) => 'translate(' + source.y + ',' + source.x + ')')
                .remove()


            nodeExit.select('text.text')
                .style('fill-opacity', 1e-6)

            let link = container.selectAll('path.link')
                .data(this.links, d => { return d.id })


            let linkEnter = link.enter().insert('path', 'g')
                .attr('class', 'link')
                .attr('d', d => {
                    let o = {x: source.x0, y: source.y0}
                    return this.diagonal(o, o)
                })
                .attr('fill', 'none')
                .attr('stroke-width', 1)
                .attr('stroke', '#ccc')

            let linkUpdate = linkEnter.merge(link)
            linkUpdate.transition()
                .duration(this.duration)
                .attr('d', d => this.diagonal(d, d.parent))

            link.exit().transition()
                .duration(this.duration)
                .attr('d', d => {
                    let o = {x: source.x, y: source.y}
                    return this.diagonal(o, o)
                })
                .remove()

            this.nodes.forEach(d => {
                d.x0 = d.x
                d.y0 = d.y
            })
        },
        zoomed () {
            d3.select(this.$el).select('g.container').attr('transform', d3.event.transform)
        },
        async getTree () {
            let surl = this.serUrl
            let path = this.fileUrl
            if (path) {
                let res = await requestResponse('get', surl, {path: path})
                if (res.data && res.data.flag) {
                    this.dataTree = res.data.data[0]
                    this.init()
                }
                else {
                    this.$notify({
                        title: '提示',
                        message: '获取失败',
                        type: 'error'
                    })
                }
            }
        },
        init () {
            //创建svg画布
            this.width = document.getElementById(this.id).clientWidth
            this.height = document.getElementById(this.id).clientHeight
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
    },
    created() {
        this.id = this.uuid()
    },
    async mounted () {
        this.init()
        // this.getTree()
    },
    computed: {
        treemap () {
            return d3.tree().size([this.height, this.width])
        }
    }
}
</script>
<style lang='scss' scoped>
    .tree-container {
        width: 100%;
        height: 1000px;
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

<template>
    <div>
        <svg :id="$options.name" width="420" height="300"></svg>
        <el-button @click="init">init</el-button>
    </div>
</template>

<script>
import * as d3 from 'd3'
export default {
    name: 'd3Graph',
    data () {
        return {
            nodesData: [
                { 'name': 'Lillian', 'sex': 'F' },
                { 'name': 'Gordon', 'sex': 'M' },
                { 'name': 'Sylvester', 'sex': 'M' },
                { 'name': 'Mary', 'sex': 'F' },
                { 'name': 'Helen', 'sex': 'F' },
                { 'name': 'Jamie', 'sex': 'M' },
                { 'name': 'Jessie', 'sex': 'F' },
                { 'name': 'Ashton', 'sex': 'M' },
                { 'name': 'Duncan', 'sex': 'M' },
                { 'name': 'Evette', 'sex': 'F' },
                { 'name': 'Mauer', 'sex': 'M' },
                { 'name': 'Fray', 'sex': 'F' },
                { 'name': 'Duke', 'sex': 'M' },
                { 'name': 'Baron', 'sex': 'M' },
                { 'name': 'Infante', 'sex': 'M' },
                { 'name': 'Percy', 'sex': 'M' },
                { 'name': 'Cynthia', 'sex': 'F' }
            ],
            linksData: [
                { 'source': 'Sylvester', 'target': 'Gordon', 'type': 'A' },
                { 'source': 'Sylvester', 'target': 'Lillian', 'type': 'A' },
                { 'source': 'Sylvester', 'target': 'Mary', 'type': 'A' },
                { 'source': 'Sylvester', 'target': 'Jamie', 'type': 'A' },
                { 'source': 'Sylvester', 'target': 'Jessie', 'type': 'A' },
                { 'source': 'Sylvester', 'target': 'Helen', 'type': 'A' },
                { 'source': 'Helen', 'target': 'Gordon', 'type': 'A' },
                { 'source': 'Mary', 'target': 'Lillian', 'type': 'A' },
                { 'source': 'Ashton', 'target': 'Mary', 'type': 'A' },
                { 'source': 'Duncan', 'target': 'Jamie', 'type': 'A' },
                { 'source': 'Gordon', 'target': 'Jessie', 'type': 'A' },
                { 'source': 'Sylvester', 'target': 'Fray', 'type': 'E' },
                { 'source': 'Fray', 'target': 'Mauer', 'type': 'A' },
                { 'source': 'Fray', 'target': 'Cynthia', 'type': 'A' },
                { 'source': 'Fray', 'target': 'Percy', 'type': 'A' },
                { 'source': 'Percy', 'target': 'Cynthia', 'type': 'A' },
                { 'source': 'Infante', 'target': 'Duke', 'type': 'A' },
                { 'source': 'Duke', 'target': 'Gordon', 'type': 'A' },
                { 'source': 'Duke', 'target': 'Sylvester', 'type': 'A' },
                { 'source': 'Baron', 'target': 'Duke', 'type': 'A' },
                { 'source': 'Baron', 'target': 'Sylvester', 'type': 'E' },
                { 'source': 'Evette', 'target': 'Sylvester', 'type': 'E' },
                { 'source': 'Cynthia', 'target': 'Sylvester', 'type': 'E' },
                { 'source': 'Cynthia', 'target': 'Jamie', 'type': 'E' },
                { 'source': 'Mauer', 'target': 'Jessie', 'type': 'E' }
            ]
        }
    },
    methods: {
        mockNode () {
            let len =  Math.floor(20 + Math.random() * 40) // 20 - 60
            let arr = []
            const randomType = () => Math.floor((Math.random() * 2))
            for (let i = 0; i < len; i++) {
                arr.push({
                    name: 'name' + i,
                    sex: randomType() === 0 ? 'F' : 'M'
                })
            }
            return arr
        },
        mockData () {
            let len =  Math.floor(40 + Math.random() * 160) // 40 -200
            let arr = []
            let ndd = this.mockNode()
            let nlen = ndd.length
            const randomNode = () => Math.floor(Math.random() * nlen)
            const randomType = () => Math.floor((Math.random() * 2))
            for (let i = 0; i < len; i++) {
                arr.push({
                    source: ndd[randomNode()],
                    target: ndd[randomNode()],
                    type: randomType() === 0 ? 'A' : 'E'
                })
            }
            return {
                link: arr,
                node: ndd
            }
        },
        init () {
            let svg = d3.select(`svg#${this.$options.name}`)
            svg.selectAll('g').remove()
            let width = svg.attr('width')
            let height = svg.attr('height')

            let mockData = this.mockData()
            let nodesData = mockData.node
            let linksData = mockData.link

            let simulation = d3.forceSimulation()
                .nodes(nodesData)
                .force('charge_force', d3.forceManyBody())
                .force('center_force', d3.forceCenter(width / 2, height / 2))

            let drag = d3.drag()
                .on('start', function (d) {
                    d3.select(this)
                        .classed('dragging', true)
                        .attr('fill', '#11a9e8')
                })
                .on('drag', function (d) {
                    d3.select(this)
                        .raise()
                        .attr('cx', d.x = d3.event.x)
                        .attr('cy', d.y = d3.event.y)
                })
                .on('end',  function (d) {
                    d3.select(this)
                        .classed('dragging', false)
                        .attr('fill', d => d.sex === 'M' ? '#666' : '#999')
                })
            let node = svg.append('g')
                .attr('class', 'nodes')
                .selectAll('circle')
                .data(nodesData)
                .enter()
                .append('circle')
                .attr('r', 4)
                .attr('fill', d => d.sex === 'M' ? '#666' : '#999')
                .call(drag)

            let link = svg.append('g')
                .attr('class', 'links')
                .selectAll('line')
                .data(linksData)
                .enter()
                .append('line')
                .attr('stroke-width', 1)
                .style('stroke', d => d.type === 'A' ? '#bbb' : '#ddd')

            simulation.on('tick', () => {
                this.tickAction(node, link)
            })

            let linkForce = d3.forceLink(linksData)
                .id(d => d.name)

            simulation.force('links', linkForce)
        },
        tickAction (node, link) {
            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)

            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y)
        }
    },
    mounted () {
        this.init()
    }
}
</script>

<style scoped>

</style>

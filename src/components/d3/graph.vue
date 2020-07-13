<template>
    <div>
        <svg :id="$options.name" width="420" height="300" />
        <el-button @click="init">
            init
        </el-button>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'nuxt-property-decorator'
const d3 = require('d3')
interface Nodesdata {
    name: string
    sex: 'F' | 'M'
}
interface Linksdata {
    source: string
    target: string
    type: 'A' | 'E'
}

@Component({
    name: 'd3Graph',
    mounted () {
        (this as any).init()
    }
})
export default class D3Graph extends Vue {
    /*
    nodesData: Nodesdata[] = [
        {name: 'Lillian', sex: 'F'},
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
    ]
    linksData: Linksdata[] = [
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
    */
    mockNode () {
        const len = Math.floor(20 + Math.random() * 40) // 20 - 60
        const arr: Nodesdata[] = []
        const randomType = () => Math.floor((Math.random() * 2))
        for (let i = 0; i < len; i++) {
            const node: Nodesdata = {
                name: 'name' + i,
                sex: randomType() === 0 ? 'F' : 'M'
            }
            arr.push(node)
        }
        return arr
    }
    mockData () {
        const len = Math.floor(40 + Math.random() * 160) // 40 -200
        const arr: Linksdata[] = []
        const ndd: Nodesdata[] = this.mockNode()
        const nlen = ndd.length
        const randomNode = () => Math.floor(Math.random() * nlen)
        const randomType = () => Math.floor((Math.random() * 2))
        for (let i = 0; i < len; i++) {
            const link: Linksdata = {
                source: ndd[randomNode()].name,
                target: ndd[randomNode()].name,
                type: randomType() === 0 ? 'A' : 'E'
            }
            arr.push(link)
        }
        return {
            link: arr,
            node: ndd
        }
    }
    init () {
        const svg = d3.select(`svg#${this.$options.name}`)
        svg.selectAll('g').remove()
        const width = svg.attr('width')
        const height = svg.attr('height')

        const mockData = this.mockData()
        const nodesData: Nodesdata[] = mockData.node
        const linksData: Linksdata[] = mockData.link

        const simulation = d3.forceSimulation()
            .nodes(nodesData)
            .force('charge_force', d3.forceManyBody())
            .force('center_force', d3.forceCenter(width / 2, height / 2))

        const drag = d3.drag()
            .on('start', function () {
                // @ts-ignore
                d3.select(this)
                    .classed('dragging', true)
                    .attr('fill', '#11a9e8')
            })
            .on('drag', function (d: any) {
                // @ts-ignore
                d3.select(this)
                    .raise()
                    .attr('cx', d.x = d3.event.x)
                    .attr('cy', d.y = d3.event.y)
            })
            .on('end', function () {
                // @ts-ignore
                d3.select(this)
                    .classed('dragging', false)
                    .attr('fill', (d: any) => d.sex === 'M' ? '#666' : '#999')
            })
        const node = svg.append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(nodesData)
            .enter()
            .append('circle')
            .attr('r', 4)
            .attr('fill', (d: any) => d.sex === 'M' ? '#666' : '#999')
            .call(drag)

        const link = svg.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(linksData)
            .enter()
            .append('line')
            .attr('stroke-width', 1)
            .style('stroke', (d: any) => d.type === 'A' ? '#bbb' : '#ddd')

        simulation.on('tick', () => {
            this.tickAction(node, link)
        })

        const linkForce = d3.forceLink(linksData)
            .id((d: any) => d.name)

        simulation.force('links', linkForce)
    }
    tickAction (node: any, link: any) {
        node
            .attr('cx', (d: any) => d.x)
            .attr('cy', (d: any) => d.y)

        link
            .attr('x1', (d: any) => d.source.x)
            .attr('y1', (d: any) => d.source.y)
            .attr('x2', (d: any) => d.target.x)
            .attr('y2', (d: any) => d.target.y)
    }
}
</script>

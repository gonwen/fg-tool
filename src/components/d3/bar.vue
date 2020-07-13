<template>
    <div>
        <svg :id="$options.name" width="420" height="300" />
    </div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'nuxt-property-decorator'
const d3 = require('d3')

@Component({
    name: 'd3Bar',
    mounted () {
        (this as any).init()
    }
})
export default class D3Bar extends Vue {
    init () {
        const marge = {top: 60, bottom: 60, left: 60, right: 60}
        const svg = d3.select(`svg#${this.$options.name}`)
        const width = svg.attr('width')
        const height = svg.attr('height')
        const g = svg.append('g')
            .attr('transform', 'translate(' + marge.top + ',' + marge.left + ')')

        const dataset = [10, 20, 30, 23, 13, 40, 27, 35, 100]

        const xScale = d3.scaleBand()
            .domain(d3.range(dataset.length).map((val: string) => {
                return `#${val}`
            }))
            .rangeRound([0, width - marge.left - marge.right])
        const xAxis = d3.axisBottom(xScale)

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset)])
            .range([height - marge.top - marge.bottom, 0])
        const yAxis = d3.axisLeft(yScale)

        g.append('g')
            .attr('transform', 'translate(' + 0 + ',' + (height - marge.top - marge.bottom) + ')')
            .call(xAxis)
        g.append('g')
            .attr('transform', 'translate(0,0)')
            .call(yAxis)

        // 绘制矩形和文字
        const gs = g.selectAll('.rect')
            .data(dataset)
            .enter()
            .append('g')

        // 绘制矩形
        const rectPadding = 20 // 矩形之间的间隙
        gs.append('rect')
            .attr('x', (...args: any[]) => {
                return xScale.step() * (args[1] + xScale.paddingOuter()) + rectPadding / 2
            })
            .attr('y', (d: any) => yScale(d))
            .attr('width', () => xScale.step() - rectPadding)
            .attr('height', (d: any) => height - marge.top - marge.bottom - yScale(d))
            .attr('fill', '#999')
            .on('mouseover', function () {
                // @ts-ignore
                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr('fill', '#ccc')
            })
            .on('mouseout', function () {
                // @ts-ignore
                d3.select(this)
                    .transition()
                    .delay(100)
                    .duration(100)
                    .attr('fill', '#999')
            })
        // 绘制文字
        gs.append('text')
        // .attr('x', (d,i) => xScale.step() * (i + xScale.paddingOuter()) + rectPadding / 2)
            .attr('x', (...args: any[]) => {
                // console.log('***i**', i)
                // console.log('**step**', xScale.step())
                // console.log('**paddingOuter**', xScale.paddingOuter())
                return (xScale.step() * args[1]) + rectPadding
            })
            .attr('y', (d: any) => yScale(d))
            .attr('dx', () => {
                return 0
                // return xScale.step() / 2
            })
            .attr('dy', -5)
            .attr('fill', '#666')
            .text((d: any) => d)
            .style('cursor', 'pointer')
            .style('font-size', '12px')
    }
}
</script>

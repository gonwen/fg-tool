<template>
    <div>
        <svg :id="$options.name" width="420" height="300"></svg>
    </div>
</template>

<script>
import * as d3 from 'd3'
export default {
    name: 'd3Bar',
    methods: {
        init () {
            let marge = {top:60, bottom:60, left:60, right:60}
            let svg = d3.select(`svg#${this.$options.name}`)
            let width = svg.attr('width')
            let height = svg.attr('height')
            let g = svg.append('g')
                .attr('transform', 'translate(' + marge.top + ',' + marge.left + ')')

            let dataset = [10,20,30,23,13,40,27,35,100]

            let xScale = d3.scaleBand()
                .domain(d3.range(dataset.length).map(val => {
                    return `#${val}`
                }))
                .rangeRound([0, width - marge.left - marge.right])
            let xAxis = d3.axisBottom(xScale)

            let yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset)])
                .range([height - marge.top - marge.bottom, 0])
            let yAxis = d3.axisLeft(yScale)

            g.append('g')
                .attr('transform','translate(' + 0 + ',' + (height - marge.top - marge.bottom) + ')')
                .call(xAxis)
            g.append('g')
                .attr('transform', 'translate(0,0)')
                .call(yAxis)

            //绘制矩形和文字
            var gs = g.selectAll('.rect')
                .data(dataset)
                .enter()
                .append('g')

            //绘制矩形
            var rectPadding = 20 // 矩形之间的间隙
            gs.append('rect')
                .attr('x', (d,i) => xScale.step() * (i + xScale.paddingOuter()) + rectPadding / 2)
                .attr('y', d => yScale(d))
                .attr('width', () => xScale.step() - rectPadding)
                .attr('height', d => height - marge.top - marge.bottom - yScale(d))
                .attr('fill', '#999')
                .on('mouseover', function() {
                    var rect = d3.select(this)
                        .transition()
                        .duration(100)
                        .attr('fill', '#ccc')
                })
                .on('mouseout', function(){
                    var rect = d3.select(this)
                        .transition()
                        .delay(100)
                        .duration(100)
                        .attr('fill', '#999')
                })
            //绘制文字
            gs.append('text')
            // .attr('x', (d,i) => xScale.step() * (i + xScale.paddingOuter()) + rectPadding / 2)
                .attr('x', (d,i) => {
                    // console.log('***d**', d)
                    // console.log('***i**', i)
                    // console.log('**step**', xScale.step())
                    // console.log('**paddingOuter**', xScale.paddingOuter())
                    return (xScale.step() * i) + rectPadding
                })
                .attr('y', d => yScale(d))
                .attr('dx', () => {
                    return 0
                    // return xScale.step() / 2
                })
                .attr('dy', -5)
                .attr('fill', '#666')
                .text(d => d)
                .style('cursor', 'pointer')
                .style('font-size', '12px')
        }
    },
    mounted () {
        this.init()
    }
}
</script>

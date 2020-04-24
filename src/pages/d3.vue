<template>
    <div>
        <el-tabs v-model="activeName" type="card" @tab-click="changeAtive">
            <el-tab-pane label="关系图" name="graph" disabled>
                <d3-graph v-if="activeName === 'graph'"></d3-graph>
            </el-tab-pane>
            <el-tab-pane label="柱状图" name="bar" disabled>
                <d3-bar v-if="activeName === 'bar'"></d3-bar>
            </el-tab-pane>
            <el-tab-pane label="树形图" name="tree">
                <d3-tree v-if="activeName === 'tree'"></d3-tree>
            </el-tab-pane>
            <el-tab-pane label="甘特图" name="gantt">
                <d3-gantt v-if="activeName === 'gantt'"></d3-gantt>
            </el-tab-pane>
            <el-tab-pane label="Map" name="map">
                <d3-map v-if="activeName === 'map'"></d3-map>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import d3Graph from '../components/d3/graph'
import d3Bar from '../components/d3/bar'
import d3Tree from '../components/d3/tree'
import d3Gantt from '../components/d3/gantt'
import d3Map from '../components/d3/map'
export default {
    components: {
        d3Graph,
        d3Bar,
        d3Tree,
        d3Gantt,
        d3Map
    },
    data () {
        return {
            activeName: 'tree',
            tabsInfo: [
                {
                    label: '关系图',
                    value: 'graph',
                    tpl: 'd3-graph'
                },
                {
                    label: '柱状图',
                    value: 'bar',
                    tpl: 'd3-bar'
                },
                {
                    label: '树形图',
                    value: 'tree',
                    tpl: 'd3-tree'
                },
                {
                    label: '甘特图',
                    value: 'gantt',
                    tpl: 'd3-gantt'
                },
                {
                    label: 'Map',
                    value: 'map',
                    tpl: 'd3-map'
                }
            ]
        }
    },
    created () {
        this.vaditorActiveName()
    },
    methods: {
        changeAtive (info) {
            this.$router.push({
                query: {t: info.name}
            })
        },
        vaditorActiveName () {
            let flag = false
            let type = this.activeName
            let cType = this.$route.query.t
            if (cType) {
                this.tabsInfo.forEach(item => {
                    if (item.value === cType) {
                        type = cType
                        flag = true
                    }
                })
                if (!flag) this.changeAtive({name: type})
            }
            this.activeName = type
        }
    }
}
</script>

<style>
    .links line {
        stroke: #999;
        stroke-opacity: 0.6;
    }
    .nodes circle {
        stroke: #fff;
        stroke-width: 1.5px;
    }
</style>

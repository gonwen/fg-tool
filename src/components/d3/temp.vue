<template>
    <div>
        <el-form :model="dataForm" style="max-width: 780px;">
            <el-row v-for="(item, index) in dataForm.data" :key="index">
                <el-col :span="8">
                    <el-form-item>
                        <el-input v-model="dataForm.data[index].text"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item>
                        <el-date-picker
                            v-model="dataForm.data[index].start"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item>
                        <el-date-picker
                            v-model="dataForm.data[index].end"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-button icon="el-icon-plus" type="primary" circle size="mini"></el-button>
            <el-button icon="el-icon-minus" type="danger" circle size="mini"></el-button>
        </el-form>
        <svg :id="$options.name" width="420" height="300"></svg>
    </div>
</template>

<script>
    import * as d3 from 'd3'
    export default {
        name: 'd3Gantt',
        data () {
            return {
                dataForm: {
                    data: [
                        {start: '1/26/2020', end: '1/24/2025', text: '5 Year Cycle - Patrol'},
                        {start: "1/26/2020", end: "2/10/2032", text: '12 Year - Assigned Vehicle'},
                        {start: "1/26/2020", end: "1/26/2022", text: '1-2 Years Command'},
                        {start: "1/26/2022", end: "1/26/2026", text: '4-5 Years Patrol'},
                        {start: "1/26/2026", end: "1/26/2029", text: '3 Years Sergeant'},
                        {start: "1/26/2029", end: "1/26/2032", text: 'End of Life'}
                    ]
                },
                eugColors: {
                    eugene_blue: "#418FDE",
                    eugene_green: "#789D4A",
                    rain: "#7A99AC",
                    fenders_blue: "#0033A0",
                    police_blue: "#00205B",
                    butter: "#ECD898",
                    golden_sun: "#FED141",
                    moss: "#B7BF10",
                    forest: "#4E5B31",
                    fire: "#AF272F",
                    pumpkin: "#E87722",
                    hazelnut: "#8B5B29",
                    bark: "#5E4B3C"
                }
            }
        },
        methods: {
            getDataX () {
                return this.dataForm.data.map(d => {
                    d.start = new Date(d.start)
                    d.end = new Date(d.end)
                    return d
                })
            },
            getData () {
                return d3.nest()
                    .key(d => d.key.slice(1))
                    .entries(
                        Object.keys(this.dataForm.data).map(d => {
                            let r = {}
                            r.key = d
                            r.data = this.dataForm.data[d]
                            return r
                        })
                    ).map(d => {
                        let r = {}
                        r.text = d.values.filter(f => f.key.slice(0, 1) === 'x')[0].data
                        r.start = new Date(d.values.filter(f => f.key.slice(0, 1) === 'f')[0].data.getTime())
                        r.start.setDate(r.start.getDate() + 1)
                        r.end = new Date(d.values.filter(f => f.key.slice(0, 1) === 't')[0].data.getTime())
                        r.end.setDate(r.end.getDate() + 1)
                        return r
                    })
            },
            getUnData () {
                return this.dataForm.data.map(d => {
                    d.start = new Date(d.start)
                    d.end = new Date(d.end)
                    return d
                })
            },
            init () {
                //
                let data = this.getData()
                let margin = {
                    top: 70,
                    bottom: 10,
                    left: 215,
                    right: 50
                }
                let eug_colors = this.eugColors
                let row_height = 40
                let height = row_height * data.length + margin.top + margin.bottom
                let max = new Date(`${d3.max(data, d => d.end).getFullYear()+1}-01-01`)
                let min = new Date(`${d3.min(data, d => d.start).getFullYear()-1}-01-01`)
                let years = () => {
                    let data = []
                    let tgt = new Date(min.getTime())
                    while(tgt <= max) {
                        data.push(new Date(tgt.getTime()))
                        tgt.setYear(tgt.getFullYear() + 1)
                    }
                    return data
                }
                d3.nest()
                    .key(d => d.key.slice(1))
                    .entries(
                        Object.keys(input).map(d => {
                            let r = {}
                            r.key = d
                            r.data = input[d]
                            return r
                        })
                    )
                let x = d3.scaleTime()
                    .domain([min, max])
                    .range([margin.left, width - margin.right])
            }
        },
        mounted () {
            // this.init()
            // console.log(this.getData())

            console.log((() => {
                let arr = this.dataForm.data
                let max = new Date(`${d3.max(arr, d => d.end).getFullYear()+1}-01-01`)
                let min = new Date(`${d3.min(arr, d => d.start).getFullYear()-1}-01-01`)
                let data = []
                let tgt = new Date(min.getTime())
                while(tgt <= max) {
                    data.push(new Date(tgt.getTime()))
                    tgt.setYear(tgt.getFullYear() + 1)
                }
                return data
            })())
        }
    }
</script>

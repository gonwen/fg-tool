<!-- 二进制占位标识 -->
<template>
    <div>
        <el-table :data="info" height="900">
            <el-table-column type="index" label="序号" width="40" fixed="left" />
            <el-table-column v-for="(item, index) in bit" :key="index" :label="(index + 1) + ''" :min-width="50">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" :content="scope.$index * bit + index + 1 + '位'" placement="top">
                        <div>
                            <span v-if="scope.row[statusKey] !== 'T'">{{scope.row[index]}}</span>
                            <el-switch
                                v-else
                                v-model="scope.row[index]"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-value="1"
                                inactive-value="0"
                                :width="30"
                            />
                        </div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="Binary" width="90" fixed="right">
                <template slot-scope="scope">
                    {{scope.row.join('')}}
                </template>
            </el-table-column>
            <el-table-column label="Decimal" width="60" fixed="right">
                <template slot-scope="scope">
                    {{getDecimal(scope.row.join(''))}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="50" fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleEdite(scope)">
                        {{scope.row[statusKey] !== 'T' ? '编辑' : '取消'}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button @click="getBigIntInfo">获取</el-button>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Watch,
    Vue
} from 'nuxt-property-decorator'
@Component({
    head () {
        return {
            title: 'BIGINT FRONT-END-TOOL'
        }
    }
})
export default class PageBigint extends Vue {
    bit: number = 32
    num: number = 16
    origin: string[] = []
    info: string[][] = []
    statusKey: string = 'editorStatus'
    @Watch('origin', {immediate: true, deep: true})
    getInfo (origin: string[]) {
        origin.forEach(item => {
            let binary: string = this.getBinary(item)
            const dur = this.bit - binary.length
            if (dur > 0) {
                binary = new Array(dur + 1).join('0') + binary
            }
            this.info.push(binary.split(''))
        })
    }
    getBinary (decimal: string | number): string {
        return Number(decimal).toString(2)
    }
    getDecimal (binary: string | number): number {
        return parseInt(binary + '', 2)
    }
    handleEdite (scope: any) {
        this.$set(scope.row, this.statusKey, scope.row[this.statusKey] === 'T' ? 'F' : 'T')
    }
    getBigIntInfo () {
        const arr: string[] = this.info.map(item => (this.getDecimal(item.join('')) +  ''))
        this.$message.info(`${arr.join(',')}`)
    }
    // mock origin data
    getMockData (bit: number = 32, num: number = 16): string[] {
        const mocks: string[] = []
        for (let i = 0; i < num; i ++) {
            const data: string = this.mockBitnumber(bit)
            mocks.push(this.getDecimal(data) + '')
        }
        return mocks
    }
    mockBitnumber (bit: number = 32): string {
        let n: string = ''
        for (let i = 0; i < bit; i ++) {
            n += this.randomNand()
        }
        return n
    }
    randomNand (): number {
        return Math.round(Math.random())
    }
    created () {
        this.origin = this.getMockData(this.bit, this.num)
    }
}
</script>

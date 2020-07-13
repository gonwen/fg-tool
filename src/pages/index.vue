<template>
    <div class="cb-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>工具列表</span>
            </div>
            <template v-for="(item, index) in nav">
                <router-link
                    v-if="item.path && item.name"
                    :key="index"
                    :to="item.path"
                    class="index-nav-item"
                >
                    <el-button type="primary">
                        {{item.name}}
                    </el-button>
                </router-link>
            </template>
            <div v-if="!(isShow || key === ckey)" class="box-card-ceng el-loading-mask"></div>
        </el-card>
        <el-input v-if="!(isShow || key === ckey)" v-model="key" placeholder="请输入通行CODE"></el-input>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'nuxt-property-decorator'
interface Navlist {
    path: string
    name: string
}
@Component({
    head () {
        return {
            title: 'INDEX FRONT-END-TOOL'
        }
    },
    asyncData ({query: {show}}) {
        const isShow: boolean = !!show
        return {isShow}
    }
})
export default class PageIndex extends Vue {
    key: string = ''
    ckey: string = '321'
    isShow: boolean = false
    nav: Navlist[] = [
        {
            path: '/code',
            name: 'CODE EDT'
        },
        {
            path: '/request',
            name: 'REQUEST'
        },
        {
            path: '/code/fileview',
            name: 'CODE FILE VIEW'
        },
        {
            path: '/code/share',
            name: 'SHARE CODE'
        },
        {
            path: '/imagecompress',
            name: 'IMAGE COMPRESS'
        }
    ]
}
</script>

<style scoped lang="scss">
    .index-nav-item {
        margin-right: 10px;

        .el-button {
            padding: 7px 16px;
        }
    }

    .box-card {
        position: relative;
    }
</style>

<!-- 首页 -->
<template>
    <div class="cb-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>工具列表</span>
            </div>
            <template v-for="(item, index) in nav">
                <router-link class="index-nav-item" v-if="item.path && item.name" :to="item.path">
                    <el-button type="primary">{{item.name}}</el-button>
                </router-link>
            </template>
            <div class="box-card-ceng el-loading-mask" v-if="!(isShow || key === ckey)"></div>
        </el-card>
        <el-input v-if="!(isShow || key === ckey)" v-model="key" placeholder="请输入通行CODE"></el-input>
    </div>
</template>
<script>
export default {
    data () {
        return {
            key: '',
            ckey: '321',
            isShow: !!(this.$route.query.show),
            nav: [
                {
                    path: '/code',
                    name: 'CODE EDT'
                },
                {
                    path: '/request',
                    name: 'REQUEST'
                },
                {
                    path: '/codefileview',
                    name: 'CODE FILE VIEW'
                },
                {
                    path: '/share/index',
                    name: 'SHARE CODE'
                },
                {
                    path: '/imagecompress',
                    name: 'IMAGE COMPRESS'
                }
            ]
        }
    }
}
</script>
<style scoped lang="scss">
    .index-nav-item{
        margin-right: 10px;
        .el-button{
            padding: 7px 16px;
        }
    }
    .box-card{
        position: relative;
    }
</style>

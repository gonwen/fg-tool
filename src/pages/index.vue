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
        <audio
            ref="audio"
            controls
            src="https://resource.ciip.com/common/mp3/5a5852903068d.mp3"
            style="width: 600px;height: 30px;opacity: 0.1"
        ></audio>
        <span @mouseover="playAudio('I')" @mouseleave="playAudio('O')">测试区域</span>
    </div>
</template>
<script>
// style="width: 0;height: 0;position: relative;z-index: 0;opacity: 0;"
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
    },
    mounted () {
        this.$refs.audio.muted = true
    },
    methods: {
        playAudio (type) {
            if (type === 'I') {
                this.$refs.audio.play()
            } else {
                this.$refs.audio.pause()
                this.$refs.audio.load()
            }
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

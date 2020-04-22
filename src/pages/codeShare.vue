<!-- 代码分享 -->
<template>
    <div class="cb-container">
        <code-editor ref="codeEditor" :show-menu="true"></code-editor>
        <el-button @click="handelShare">分享</el-button>
        <!--<span v-if="shareMd5"></span>-->
        <el-input v-if="shareMd5" v-model="shareMd5" readonly></el-input>
    </div>
</template>

<script>
import codeEditor from '../components/codeEditor'
import {requestResponse} from '../config/axiosconfig'
import vmMd5 from 'md5'
export default {
    name: 'codeShare',
    components: {
        codeEditor
    },
    data () {
        return {
            sid: '',
            shareMd5: '',
            serUrl: 'http://172.10.10.176:3093/api/'
        }
    },
    created () {
        console.log(this.$route)
        let sid = this.$route.params.id
        if (sid && sid !== 'index') {
            this.sid = sid
            this.getShareInfo(sid)
        }
    },
    methods: {
        handelShare () {
            let code = this.$refs.codeEditor.getEditotValue()
            if (code) this.setShareInfo(code)
            else {
                this.$notify({
                    title: '提示',
                    message: '无内容可分享',
                    type: 'error'
                })
            }
        },
        async setShareInfo (code) {
            let md5 = vmMd5(code)
            let mode = this.$refs.codeEditor.codeConfig.mode
            let res = await requestResponse('post', this.serUrl + 'sharecode/add', {name: md5, code: code, mode: mode})
            if (res.data && res.data.flag) this.shareMd5 = window.location.origin + '/#/share/' + md5
            else {
                this.$notify({
                    title: '提示',
                    message: '分享失败',
                    type: 'error'
                })
            }
        },
        async getShareInfo (sid) {
            let res = await requestResponse('get', this.serUrl + 'sharecode/info', {name: sid})
            if (res.data && res.data.data && res.data.data.name) {
            // if (res.data && res.data.flag) {
                let data = res.data.data
                this.$refs.codeEditor.setEditotValue(data.code)
                this.$refs.codeEditor.codeConfig.mode = data.mode
            } else {
                this.$notify({
                    title: '提示',
                    message: '获取数据错误',
                    type: 'error'
                })
            }
        }
    }
}
</script>

<style scoped>

</style>

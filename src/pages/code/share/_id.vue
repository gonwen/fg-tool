<!-- 代码分享 -->
<template>
    <div class="cb-container">
        <code-editor ref="codeEditor" :show-menu="true"></code-editor>
        <el-button @click="handelShare">
            分享
        </el-button>
        <!--<span v-if="shareMd5"></span>-->
        <el-input v-if="shareMd5" v-model="shareMd5" readonly></el-input>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'nuxt-property-decorator'
import codeEditor from '~/components/codeEditor.vue'
import {requestResponse} from '~/../config/axios.conf'
const vmMd5 = require('md5')

@Component({
    components: {codeEditor},
    head () {
        return {
            title: 'CODE SHARE FRONT-END-TOOL'
        }
    },
    mounted () {
        (this as any).init()
    }
})
export default class PageCodeShare extends Vue {
    sid: string = ''
    shareMd5: string = ''
    serUrl: string = 'http://172.10.10.176:3093/api/'
    init () {
        const sid = this.$route.params.id
        if (sid && sid !== 'index') {
            this.sid = sid
            this.getShareInfo(sid)
        }
    }
    handelShare () {
        const code = (this.$refs.codeEditor as any).getEditotValue()
        if (code) {
            this.setShareInfo(code)
        } else {
            this.$notify({
                title: '提示',
                message: '无内容可分享',
                type: 'error'
            })
        }
    }
    async setShareInfo (code: string) {
        const md5 = vmMd5(code)
        const mode = (this.$refs.codeEditor as any).codeConfig.mode
        const res: any = await requestResponse('post', this.serUrl + 'sharecode/add', {name: md5, code, mode})
        if (res.data && res.data.flag) {
            this.shareMd5 = window.location.origin + '/code/share/' + md5
        } else {
            this.$notify({
                title: '提示',
                message: '分享失败',
                type: 'error'
            })
        }
    }
    async getShareInfo (sid: string) {
        const res: any = await requestResponse('get', this.serUrl + 'sharecode/info', {name: sid})
        if (res.data && res.data.data && res.data.data.name) {
            // if (res.data && res.data.flag) {
            const data = res.data.data
            const codeEditor = this.$refs.codeEditor as any
            codeEditor.setEditotValue(data.code)
            codeEditor.codeConfig.mode = data.mode
        } else {
            this.$notify({
                title: '提示',
                message: '获取数据错误',
                type: 'error'
            })
        }
    }
}
</script>

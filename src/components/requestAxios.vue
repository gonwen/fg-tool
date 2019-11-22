<!-- 接口请求调试面板 -->
<template>
    <div class="panl-ax">
        <div class="panl-header">
            <h5>接口请求调试面板</h5>
            <p>
                说明：目前支持
                <!--GET 、POST、PUT-->
                <el-radio v-model="form.method" label="GET">GET</el-radio>
                、
                <el-radio v-model="form.method" label="POST">POST</el-radio>
                、
                <el-radio v-model="form.method" label="PUT">PUT</el-radio>
                类型的请求
            </p>
        </div>
        <el-form :model="form" ref="submitForm" label-width="140px" :rules="formRules" v-loading="loading">
            <el-form-item label="BASEURL" prop="baseurl">
                <el-row>
                    <el-col :span="12">
                        <el-input v-model="form.baseurl" maxlength="100"></el-input>
                    </el-col>
                    <el-col :span="12">
                        <p class="panl-eq">EQ: http://localhost:3000</p>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="URL" prop="url">
                <el-row>
                    <el-col :span="12">
                        <el-input v-model="form.url" maxlength="100"></el-input>
                    </el-col>
                    <el-col :span="12">
                        <p class="panl-eq">EQ: /api/find/person</p>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="METHOD" prop="method">
                <el-select v-model="form.method" placeholder="请选择">
                    <el-option label="GET" value="GET"></el-option>
                    <el-option label="POST" value="POST"></el-option>
                    <el-option label="PUT" value="PUT"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="HEADER" prop="header">
                <div class="panl-body">
                    <el-button type="primary" icon="el-icon-plus" plain @click="handleBtn('A', form.header.length - 1, 'header')">ADD</el-button>
                    <span class="panl-eq">EQ: x-ho-token</span>
                    <el-row v-for="(item, index) in form.header" :key="index">
                        <el-col :span="5">
                            <el-form-item label="key" prop="key" label-width="40px">
                                <el-input v-model="form.header[index].key" maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="13">
                            <el-form-item label="value" prop="value" label-width="80px">
                                <el-input v-model="form.header[index].value"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" :offset="2">
                            <el-button type="primary" icon="el-icon-plus" circle @click="handleBtn('A', index, 'header')"></el-button>
                            <el-button type="danger" icon="el-icon-close" circle @click="handleBtn('D', index, 'header')"></el-button>
                        </el-col>
                    </el-row>
                </div>
            </el-form-item>
            <el-form-item label="PRAMS/BODY" prop="data">
                <div class="panl-body">
                    <el-button type="primary" icon="el-icon-plus" plain @click="handleBtn('A', form.data.length - 1)">ADD</el-button>
                    <el-row v-for="(item, index) in form.data" :key="index">
                        <el-col :span="5">
                            <el-form-item label="key" prop="key" label-width="40px">
                                <el-input v-model="form.data[index].key" maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="13">
                            <el-form-item label="value" prop="value" label-width="80px">
                                <el-input v-model="form.data[index].value"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" :offset="2">
                            <el-button type="primary" icon="el-icon-plus" circle @click="handleBtn('A', index)"></el-button>
                            <el-button type="danger" icon="el-icon-close" circle @click="handleBtn('D', index)"></el-button>
                        </el-col>
                    </el-row>
                </div>
            </el-form-item>
            <!--            <el-form-item label="SIGIN [key*md5]" prop="sign">-->
            <!--                <el-input v-model="form.sign" disabled></el-input>-->
            <!--            </el-form-item>-->
            <el-form-item label="SIGN" prop="sign">
                <div class="panl-body">
                    <el-button type="primary" :icon="`el-icon-${isSettingSignModel ? 'close' : 'setting'}`" plain @click="handleBtnSetting">{{isSettingSignModel ? 'CLOSE' : 'SETTING'}}</el-button>
                    <el-row v-if="isSettingSignModel">
                        <el-form-item label="Encryption Mode" prop="sign.encryption" label-width="180px">
                            MD5
                        </el-form-item>
                        <el-form-item label="PASS SECRET" prop="sign.secret" label-width="180px">
                            <el-input v-model="form.sign.secret" maxlength="200"></el-input>
                        </el-form-item>
                        <el-form-item label="PASS ID" prop="sign.passId" label-width="180px">
                            <el-input v-model="form.sign.passId" maxlength="200"></el-input>
                        </el-form-item>
                        <el-row>
                            <el-col :span="16">
                                <el-form-item label="HEADER SIGN KEY" prop="sign.signkey" label-width="180px">
                                    <el-input v-model="form.sign.signkey" maxlength="50"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <p class="panl-eq">DEFAULT: [sign]</p>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="16">
                                <el-form-item label="HEADER TIME KEY" prop="sign.timekey" label-width="180px">
                                    <el-input v-model="form.sign.timekey" maxlength="50"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <p class="panl-eq">DEFAULT: [timestamp]</p>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="16">
                                <el-form-item label="HEADER PASS ID KEY" prop="sign.idkey" label-width="180px">
                                    <el-input v-model="form.sign.idkey" maxlength="50"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <p class="panl-eq">DEFAULT: [passId]</p>
                            </el-col>
                        </el-row>
                    </el-row>
                </div>
            </el-form-item>
            <el-button type="primary" @click="handleSumit">SEND</el-button>
            <el-button @click="handleSumit('R')">RESETTING</el-button>
        </el-form>
        <code-editor init-mode="application/json" init-theme="idea" :show-menu="true" :code-value="result.data" v-show="result.data"></code-editor>
        <!--<div class="panl-pre" v-if="result.data" :class="{'is-error': !result.flag}"><pre>{{result.data}}</pre></div>-->
    </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import md5 from 'md5'
import codeEditor from './codeEditor'

export default {
    name: 'requestAxios',
    components: {
        codeEditor
    },
    data () {
        return {
            exWebsite: /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/, // eslint-disable-line no-useless-escape
            loading: false,
            form: {
                baseurl: 'http://jiaapi.ciip.com',
                url: '/jyj/api/v1/ProductCenter/product/findId?id=101',
                method: 'GET',
                sign: {
                    secret: 'a0ny1099ec8yek4wa1pi3l4cf2h86wptorv6o3einn79u',
                    passId: 'z7gcawmtu4g1blzgnzftns5435638tdl',
                    encryption: 'md5',
                    signkey: '',
                    timekey: '',
                    idkey: ''
                },
                data: [
                    // {key: '', value: ''}
                ],
                header: []
            },
            formRules: {
                baseurl: [
                    {required: true, message: '请输入baseurl地址 ', trigger: 'blur'},
                    {validator: (rule, value, callback) => {
                            if (!value || this.exWebsite.test(value)) {
                                callback()
                            } else {
                                callback(new Error('请输入正确的baseurl地址'))
                            }
                        },
                        trigger: 'blur'}
                ],
                url: [
                    {required: true, message: '请输入url地址 ', trigger: 'blur'}
                ],
                method: [
                    {required: true, message: '请选择请求method', trigger: 'change'}
                ]
            },
            result: {
                flag: false,
                data: ''
            },
            withCredentials: true,
            isSettingSignModel: false
        }
    },
    methods: {
        handleBtn (type, index, ky) {
            let sign = ky || 'data'
            if (type === 'A') this.form[sign].splice(index + 1, 0, {key: '', value: ''})
            else this.form[sign].splice(index, 1)
        },
        async handleSumit (str) {
            if (str === 'R') {
                this.$refs.submitForm.resetFields()
                this.result.data = ''
            } else {
                this.$refs.submitForm.validate((vid, opt) => {
                    if (vid) this.sendAxios()
                    else {
                        let oa = []
                        for (let ot in opt) oa.push(ot)
                        this.$notify({
                            title: '提示',
                            message: opt[oa[0]][0].message,
                            type: 'error',
                            position: 'top-left',
                            duration: 0
                        })
                    }
                })
            }
        },
        async sendAxios () {
            this.loading = true
            this.result.data = ''
            let data = {}
            try {
                let res = await this.requestResponse()
                data = res.data
                this.result.flag = true
            } catch (e) {
                data = e
                this.result.flag = false
            }
            data = JSON.stringify(data, null, 4)
            this.result.data = data
            // this.changeCodeMode('application/json')
            // this.setEditotValue(data)
            this.loading = false
        },
        requestResponse () {
            let form = {...this.form}
            let url = form.baseurl + form.url
            let type = form.method || 'GET'
            let data = this.setData(form.data)
            axios.defaults.withCredentials = this.withCredentials
            let headerInfo = form.header
            if (this.isSettingSignModel) headerInfo = [...this.getSign(data), ...headerInfo]
            this.setHeader(headerInfo)
            if (type === 'GET') return axios.get(url, {params: data})
            if (type === 'PUT') return axios.put(url, qs.stringify(data))
            if (type === 'POST') return axios.post(url, qs.stringify(data))
        },
        // 解析设置请求参数
        setData (data) {
            let json = {}
            if (data.constructor === Array && data.length > 0) {
                data.forEach(item => {
                    if (item.key) json[item.key] = item.value
                })
            }
            return json
        },
        // 设置header
        setHeader (data) {
            if (data.constructor === Array && data.length > 0) {
                axios.interceptors.request.use(
                    config => {
                        data.forEach(item => {
                            if (item.key) config.headers[item.key] = item.value
                        })
                        return config
                    },
                    err => {
                        return Promise.reject(err)
                    }
                )
            }
        },
        // 获取签名
        getSign (json) {
            let signInfo = this.form.sign
            let signpass = signInfo.secret || 'ahr0cdovl3rlc3ryzxnvdxjjzs5qaw55b3vqaweubmv0l3r'
            let timekey = signInfo.timekey || 'timestamp'
            let signkey = signInfo.signkey || 'sign'
            let idkey = signInfo.idkey || 'passId'
            let signJson = this.getSignInfo(json, signpass, timekey)
            return [
                {key: signkey, value: signJson.s},
                {key: idkey, value: signInfo.passId},
                {key: timekey, value: signJson.t}
            ]
        },
        getSignInfo (json, secret, timekey) {
            let signpass = secret
            let data = {...json} || {}
            let sign = ''
            let str = ''
            let times = ''
            times = new Date().getTime()
            data[timekey] = times
            let newKey = Object.keys(data).sort()
            for (let j = 0; j < newKey.length; j++) {
                if (data[newKey[j]] !== '') str += newKey[j] + data[newKey[j]]
            }
            sign = signpass + str + signpass
            // console.log('**** md5 before ****', sign)
            sign = md5(sign)
            // console.log('**** md5 after ****', sign)
            // console.log('**** times ****', times)
            return {
                s: sign.toUpperCase(),
                t: times
            }
        },
        handleBtnSetting () {
            this.isSettingSignModel = !this.isSettingSignModel
        }
    }
}
</script>

<style lang="scss">
    .panl-ax{
        .panl-header{
            margin-bottom: 30px;
            h5 {
                font-size: 32px;
            }
            p{
                font-size: 16px;
                line-height: 24px;
                color: #999;
                .el-radio{
                    margin-right: 0;
                    .el-radio__input{
                        display: none;
                    }
                    .el-radio__label{
                        padding-left: 0;
                        color: #999;
                    }
                    &.is-checked{
                        .el-radio__label{
                            color: $blue;
                        }
                    }
                }
            }
        }
        .panl-eq{
            font-size: 14px;
            color: #999;
            padding-left: 20px;
        }
        .panl-body{
            background-color: #f4f4f4;
            padding: {
                top: 20px;
                left: 20px;
                right: 20px;
            };
            &>.el-button{
                margin-bottom: 20px;
            }
        }
        .panl-pre{
            margin-top: 30px;
            padding: 20px;
            color: $white;
            line-height: 18px;
            font-size: $default-font-size;
            background-color: #3e4a51;
            word-wrap:break-word;
            pre{
                white-space:pre-wrap;
            }
            &.is-error{
                color: #f5a49e;
            }
        }
    }
</style>

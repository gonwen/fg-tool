<template>
    <div class="cb-container" style="padding: 10px;">
        <h3 style="margin-top: 30px; margin-bottom: 20px;"><b>图片压缩<span style="font-size: 12px;margin-left: 10px;">[Canvas]</span></b></h3>
        <el-row>
            <el-col :span="2"><span style="line-height: 38px;">压缩层级</span></el-col>
            <el-col :span="6">
                <el-slider v-model="quality" :max="max" :min="min" :step="step"></el-slider>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="2"><span style="line-height: 38px;">上传图片</span></el-col>
            <el-col :span="6" style="padding-top: 6px;">
                <input type="file" @change="handleChange" ref="files" accept="image/jpg,image/gif,image/png,image/jpeg,image/bmp"/>
            </el-col>
            <el-col :span="4">
                <a v-if="newFileUrl" :href="newFileUrl" download="newImage">
                    <el-button>下载</el-button>
                </a>
                <el-button type="primary" @click="handleAgin">重新压缩</el-button>
            </el-col>
        </el-row>
        <div v-if="newFile" class="img-view">
            <div class="img-item">
                <h6>原图效果：<i>[ {{getFileSize(originFile)}} ]</i></h6>
                <el-image :src="getFileUrl(originFile)" :preview-src-list="[getFileUrl(originFile)]" fit="contain"></el-image>
            </div>
            <div class="img-item">
                <h6>压缩效果：<i>[ {{getFileSize(newFile)}} ]</i> ————<span> {{getPoint()}} </span></h6>
                <el-image :src="newFileUrl" :preview-src-list="[newFileUrl]" fit="contain"></el-image>
            </div>
        </div>
	</div>
</template>

<script>
import Compressor  from 'compressorjs'
export default {
	data () {
		return {
            quality: 0.8,
            originFileUrl: '',
            originFile: null,
            newFileUrl: '',
            newFile: null,
            max: 1,
            min: 0.2,
            step: 0.1,
            fileValue: ''
		}
	},
    methods: {
	    compressoring (file) {
            this.originFile = file
            this.originFileUrl = this.getFileUrl(file)
            /*console.log('****originFile*******', this.originFile)*/
            new Compressor(file, {
                quality: this.quality,
                // mimeType: 'image/jpeg',
                convertSize: 5000,
                success: res => {
                    /*console.log('****res*******', res)*/
                    this.newFile = res
                    this.newFileUrl = this.getFileUrl(res)
                },
                error: err => {
                    console.log('***err***', err)
                }
            })
        },
        handleChange (e) {
            let file = e.path[0].files[0]
            this.compressoring(file)
        },
        handleAgin () {
            this.compressoring(this.originFile)
        },
        cleanFileValue () {
            //
        },
        getFileUrl (file) {
            return window.URL.createObjectURL(file)
        },
        getFileSize (file) {
	        return this.parseFileSize(file.size)
        },
        parseFileSize (num) {
            let n = Number(num)
            let kb = 1024
            let mb = 1024 * 1024
            let gb = 1024 * 1024 * 1024
            let tb = 1024 * 1024 * 1024 * 1024
            let str = ''
            switch (true) {
                case n < kb :
                    str = 'B'
                    break
                case n < mb && n >= kb :
                    str = 'KB', n = n / kb
                    break
                case n < gb && n >= mb :
                    str = 'MB', n = n / mb
                    break
                case n < tb && n >= gb :
                    str = 'GB', n = n / gb
                    break
                case n >= tb :
                    str = 'TB', n = n / tb
                    break
            }
            return Math.round(n * 10) / 10 + str
        },
        getPoint () {
            let pt = 1 - (this.newFile.size / this.originFile.size)
	        return `${Math.round(pt * 100 * 10) / 10}%`
        }
    }
}
</script>

<style lang="scss">
.img-view{
    margin-top: 20px;
    .img-item{
        float: left;
        margin-right: 20px;
        h6{
            margin-bottom: 10px;
            font-size: 14px;
            i{
                font-size: 12px;
                color: #f93;
                font-style: normal;
            }
            span{
                color: $blue;
            }
        }
    }
    .el-image{
        width: 300px;
        height: 300px;
        border: 1px solid #ccc;
    }
}
</style>

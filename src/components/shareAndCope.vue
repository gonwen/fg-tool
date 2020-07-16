<!-- 分享二维码、 复制内容 -->
<template>
    <el-tooltip :placement="placement" popper-class="share-tooltip" effect="light">
        <div slot="content">
            <span v-if="isCopy" @click="clipboardData">点击复制</span>
            <div class="qscode-img">
                <img :src="qrCode" alt="">
                <span v-if="isShareIcon" class="icon-img">
                    <img :src="shareIcon" alt="">
                </span>
            </div>
        </div>
        <slot name="button">
            <span class="share-btn"><i class="el-icon-share"></i>分享</span>
        </slot>
    </el-tooltip>
</template>

<script lang="ts">
import {
    Vue,
    Watch,
    Prop,
    Component
} from 'nuxt-property-decorator'
const QRCode = require('qrcode')
const clipboard = require('clipboard-polyfill')

@Component({
    name: 'shareAndCope',
    components: {}
})
export default class ShareAndCope extends Vue {
    @Prop({
        default: 'H'
    }) shareType !: string
    @Prop({
        default: ''
    }) shareLink !: string
    @Prop({
        default: 'bottom-start'
    }) placement !: string
    @Prop({
        default: '120'
    }) codeWidth !: string
    @Prop({
        default: true
    }) isShareIcon !: boolean
    @Prop({
        default: '/favicon.ico'
    }) shareIcon !: string
    // 是否开启copy模式
    @Prop({
        default: false
    }) isCopy !: boolean
    qrCode: any = ''
    link: any = ''
    // 生成二维码
    createQRCode () {
        if (!this.link) {
            return false
        }
        QRCode.toDataURL(this.link, {width: this.codeWidth, margin: 2})
            .then((url: any) => {
                this.qrCode = url
            })
    }
    // 复制链接地址
    clipboardData () {
        clipboard.writeText(this.link)
        this.$notify({
            title: '提示',
            message: '链接地址复制成功',
            type: 'success',
            position: 'bottom-right'
        })
    }
    @Watch('shareLink', {immediate: true})
    shareLinkFn (val: any) {
        this.link = val || ''
        try {
            if (window) {
                if (!val) {
                    this.link = window.location.href
                }
                this.createQRCode()
            }
        } catch (e) {}
    }
}
</script>

<style scoped lang="scss">
    $white: #fff;
    $default-font-size: 14px;
    $black: #333;
    $hoverColor: #ddd;

    .qscode-img {
        position: relative;

        .icon-img {
            position: absolute;
            width: 20%;
            height: 20%;
            left: 40%;
            top: 40%;
            padding: 2px;
            background-color: $white;
            border-radius: 4px;
            box-sizing: border-box;

            img {
                border-radius: 4px;
                width: 100%;
                height: 100%;
            }
        }
    }

    .share-btn {
        font-size: $default-font-size;
        color: $black;
        cursor: pointer;

        i {
            font-size: 18px;
            margin-right: 5px;
        }

        &:hover {
            color: $hoverColor;
        }
    }
</style>

<style lang="scss">
    $shareTooltipBoderColor: #d9d9d9;

    .el-tooltip__popper {
        &.is-light {
            &.share-tooltip {
                z-index: 999999 !important;
                padding: 0;
                border-radius: 0;
                border: 1px solid $shareTooltipBoderColor;
                box-shadow: 0 3px 3px $shareTooltipBoderColor;

                &[x-placement^=bottom] .popper__arrow {
                    border-bottom-color: $shareTooltipBoderColor;
                }

                &[x-placement^=top] .popper__arrow {
                    border-top-color: $shareTooltipBoderColor;
                }
            }
        }
    }
</style>

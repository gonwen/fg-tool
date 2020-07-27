<template>
    <div
        class="edt"
        :style="{width: width}"
    >
        <div class="edt-tool">
            <span v-for="(item, index) in toolNav" :key="index">{{item.name}}</span>
        </div>
        <div
            class="edt-main"
            :style="{height: height}"
            contenteditable="true"
        >
            <!---->
        </div>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Prop,
    Vue
} from 'nuxt-property-decorator'

@Component({
    head () {
        return {}
    }
})
export default class PageEditor extends Vue {
    @Prop({
        default: (n: string | number = 900) => n.constructor === Number ? n + 'px' : n
    })
    width!: number | string
    @Prop({
        default: (n: string | number = 600) => n.constructor === Number ? n + 'px' : n
    })
    height!: number | string
    toolNav: any = [
        {
            name: 'font-size',
            icon: '',
            dec: '',
            mdc: ''
        },
        {
            name: 'color',
            icon: '',
            dec: '',
            mdc: ''
        }
    ]
}
</script>

<style lang="scss" scoped>
    .edt {
        position: relative;
        width: 100%;
        border-radius: 4px;
        margin: 0 auto;
        overflow: hidden;
    }

    .edt-tool {
        width: 100%;
        min-height: 30px;
        line-height: 30px;
        background-color: #fafafa;

        span {
            font-size: 14px;
            color: #999;
            margin: 0 5px;
            cursor: pointer;

            &:hover {
                color: #11a9e8;
            }
        }
    }

    .edt-main {
        font-size: 12px;
        line-height: 18px;
        padding: 5px;
        border: 1px solid #eee;

        &:focus {
            border: 1px solid #ddd;
            outline: none;
        }
    }
</style>

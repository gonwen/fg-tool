<template>
    <div id="app">
        <router-view/>
        <div v-if="!isAuth" class="loading">
            <div class="el-loading-mask"></div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                isAuth: false,
                sign: 's-w-a-h'
            }
        },
        created () {
            let s = this.sign
            let val = localStorage.getItem(s)
            if (val === 'pass') this.isAuth = true
        },
        watch: {
            '$route.query.sw' (val) {
                if (!this.isAuth && val) {
                    if (val === '321') localStorage.setItem(this.sign, 'pass')
                    this.isAuth = true
                }
            }
        }
    }
</script>

<style lang="scss">
@import "./assets/common";
</style>

<style lang="scss" scoped>
    .loading{
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 9999999;
        .el-loading-mask{
            background-color: rgba(0, 0, 0, 0.27);
        }
    }
</style>

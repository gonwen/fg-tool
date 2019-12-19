<!-- 首页 -->
<template>
    <div class="cb-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>工具列表</span>
            </div>
            <router-link to="/code"><el-button type="primary">CODE EDT</el-button></router-link>
            <router-link to="/request"><el-button type="primary">REQUEST</el-button></router-link>
            <router-link to="/codefileview"><el-button type="primary">CODE FILE VIEW</el-button></router-link>
        </el-card>
    </div>
</template>
<script>
export default {}
</script>

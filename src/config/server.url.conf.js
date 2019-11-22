/**
 * 全局配置信息
 * DEV => npm run dev
 * PRO => npm run build
 * TST => npm run testBuild
 * ser: 服务地址域
 * */
const configWebpackBaseInfo = {
    // 本地环境（根据实际需要改动）
    DEV: {
        ser: ''
    },
    // 生产环境（勿动）
    PRO: {
        ser: ''
    },
    // 测试环境（勿动）
    TST: {
        ser: ''
    }
}
const PATH_NODE_ENV = process.env.NODE_ENVINGS
const serUrl = configWebpackBaseInfo[PATH_NODE_ENV].ser

export {serUrl}

const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        open: false,
        proxy: {
            '/api': {
                target: process.env.VUE_APP_API_URL + 'admin', //后台服务器地址
                ws: false,
                changeOrigin: true, //target为域名时必须设置此项
                secure: false, //设置支持 https 协议的代理
                pathRewrite: {
                    '^/api': ''
                },
            },
            '/comm': {
                target: process.env.VUE_APP_API_URL + 'common', //common服务器地址
                changeOrigin: true, //target为域名时必须设置此项
                ws: false,
                secure: false, //设置支持 https 协议的代理
                pathRewrite: {
                    '^/comm': ''
                }
            }
        },

    }
})

const compose = require('koa-compose')
const path = require('path')
const fs = require('fs')

// 读取所有api路由文件，添加至全局路由，并统一增加前缀'/api/文件夹'
let registerRouter = () => {
    let routers = []
    let apiDir = path.resolve(__dirname, 'api')
    fs.readdirSync(apiDir).forEach(subDir => {
        let fileDir = path.resolve(apiDir, subDir, 'controller.js')
        if (fs.existsSync(fileDir)) {
            let route = require(fileDir)
            if (!route.opts.prefix) {
                route.prefix(`/api/${subDir.replace('-', '').toLowerCase()}`)
            }
            routers.push(route.routes())
            routers.push(route.allowedMethods())
        }
    })
    return compose(routers)
}

module.exports = registerRouter;
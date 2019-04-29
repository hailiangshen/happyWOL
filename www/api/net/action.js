const netUtil = require('../../net.util')

module.exports = {
    async netinfo(ctx, next) {
        try {
            let ip = ctx.ip.replace('::ffff:', '')
            let hostInfo = await netUtil.ping(ip)
            let macArr = await netUtil.findMACByIP(ip)
            let mac = (macArr && macArr.length) ? macArr[0].mac : ''

            ctx.body = new ctx.Model.Response({
                ip,
                mac,
                hostName: hostInfo.hostName
            })
        } catch (err) {
            ctx.body = new ctx.Model.Response().fail(err)
        }
    },

    async getMyList(ctx, next) {
        let list = await ctx.DB.Models.MacConfig.find({ userName: ctx.query.userName }).exec();
        // 查询是否在线，太耗时间，放在单个接口查
        // await Promise.all(list.map(x => {
        //     return ping.promise.probe(x.ip)
        //     .then(function (res) {
        //         x.alive = res.alive
        //     })
        // }))
        ctx.body = new ctx.Model.Response(list)
    },

    async getPCStatus(ctx, next) {
        let config = await ctx.DB.Models.MacConfig.findOne({ ip: ctx.request.body.ip }).exec();
        if (config) {
            try {
                let data = await netUtil.ping(config.ip)
                ctx.body = new ctx.Model.Response(data.alive)
            } catch (err) {
                ctx.body = new ctx.Model.Response(false).fail(err)
            }

        } else {
            ctx.body = new ctx.Model.Response().fail('数据未找到')
        }
    },

    async createMacConfig(ctx, next){
        let ip = ctx.request.body.ip, userName = ctx.request.body.userName, hostName = ctx.request.body.hostName
        let macArr = await netUtil.findMACByIP(ip)
        let mac = (macArr && macArr.length) ? macArr[0].mac : ''
        if (!mac) {
            ctx.body = new ctx.Model.Response().fail('无法获取MAC地址，请确保在内网访问')
        } else {
            let model = new ctx.DB.Models.MacConfig({
                userName,
                ip,
                mac,
                hostName,
                createdAt: new Date()
            })

            let validateError = model.validateSync()
            if (validateError) {
                return ctx.body = new ctx.Model.Response().fail(Object.values(validateError.errors)[0].message)
            }

            let res = await ctx.DB.Models.MacConfig.create(model)
            ctx.body = new ctx.Model.Response(null, res.id)
        }
    },

    async wakeOnLan(ctx, next) {
        let config = await ctx.DB.Models.MacConfig.findOne({ mac: ctx.request.body.mac }).exec();
        if (config) {
            let result = await netUtil.wakeOnLan(config.mac.replace(/\-/g, ''))
            ctx.body = new ctx.Model.Response(null, 'success')
        } else {
            ctx.body = new ctx.Model.Response().fail('数据未找到')
        }
    },
}
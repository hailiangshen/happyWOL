const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const registerRouter = require('./routes')
const serve = require('koa-static')
const path = require('path')
const open = require('open')
const logger = require('./logger') // 简单日志
const argvs = require('./process.args')
const os = require('os')
const dbHelper = require('./db/index')
const Response = require('./response')
const authBasic = require('./auth.basic')

const app = new Koa()
app.use(bodyParser())
app.use(serve(
    path.join( __dirname, '../www')
))
app.use(serve(path.resolve(__dirname, "../static"), {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    index: 'index.html',
}));
app.use(async (ctx, next) => {
    ctx.argvs = argvs
    ctx.logger = logger
    ctx.DB = dbHelper
    ctx.Model = {
        Response
    }
    await next()
})
app.use(authBasic)

app.use(registerRouter())

app.listen(argvs.port || 7777)
    .on("error", err => {
        logger.error(err)
    })
    .on("listening", function () {
        let host = `127.0.0.1:${this.address().port}`
        logger.log(`start successed at ${host}`)
        if(argvs.mode === 'dev') {
            open(host, {app: [os.platform().indexOf('win') === 0 ? 'chrome' : 'google chrome']});
        }
    });
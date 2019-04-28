let auth = async (ctx, next) => {
    let auth = ctx.request.headers['authorization'] || ''
    let parts = auth.split(' ')
    let method = parts[0] || ''
    let decoded = Buffer.from((parts[1] || ''), 'base64').toString('utf-8').split(':')
    let user = decoded[0], pass = decoded[1]
    if (user == 'admin' && pass == "12345") {
        await next()
    } else {
        ctx.respond = false
        ctx.res.writeHead(401, 'Bad Authorization header.', {
            'WWW-Authenticate': 'Basic realm="Secure Area"'
        })
        ctx.res.end()
    }
}

module.exports = auth
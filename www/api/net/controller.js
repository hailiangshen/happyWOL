const Router = require('koa-router')
const router = new Router()
const action = require('./action')

router.get('/netinfo', action.netinfo)
router.get('/getMyList', action.getMyList)
router.post('/createMacConfig', action.createMacConfig)
router.post('/wakeOnLan', action.wakeOnLan)

module.exports = router
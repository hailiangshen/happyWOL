const mongoose = require('../db')

let HookConfigSchema = mongoose.Schema({
    userName: String,
    hostName: String,
    mac: {
        type: String,
        required: [true, 'mac地址必填']
    },
    aliveStatus: {
        type: Number,
        default: -1,
    },
    ip: String,
    icon: String,
    comment: String,
    createdAt: Date
})

module.exports = HookConfigSchema;
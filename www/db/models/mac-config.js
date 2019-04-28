const mongoose = require('../db')

let HookConfigSchema = mongoose.Schema({
    userName: String,
    mac: {
        type: String,
        required: [true, 'mac名称必填']
    },
    ip: {
        type: String,
        required: [true, 'ip必填']
    },
    icon: String,
    comment: String,
    createdAt: Date
})

module.exports = HookConfigSchema;
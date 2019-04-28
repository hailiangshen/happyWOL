const mongoose = require('mongoose');

let conn = mongoose.connect('mongodb://localhost:27017/huisuo', { useNewUrlParser: true }).connection;

// conn.on('error', console.error.bind(console, '连接数据库失败'));

module.exports = mongoose;
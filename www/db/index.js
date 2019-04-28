const fs = require('fs')
const path = require('path')
const mongoose = require('./db')

let srcDir = path.resolve(__dirname, './models')

let toPascal = str => str.split('-').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join('')
let toCamelCase = str => str.charAt(0).toLowerCase() + str.slice(1)

// 读取schema创建model
let getModels = () => {
    return fs.readdirSync(srcDir, )
        .filter(sub => fs.statSync(path.join(srcDir, sub)).isFile())
        .reduce((data, file) => {
            let schema = require(path.resolve(srcDir, file))
            let modelName = toPascal(path.basename(file, '.js'))

            data[modelName] = mongoose.model(modelName, schema, toCamelCase(modelName))
            return data;
    }, {})
}

module.exports = {
    mongoose,
    Models: getModels()
};
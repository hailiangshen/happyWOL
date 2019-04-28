let argvs = process.argv
    .slice(2).map(x => x.split('='))
    .reduce((data, val) => {
    data[val[0]] = val[1]
    return data
}, {})

module.exports = argvs;
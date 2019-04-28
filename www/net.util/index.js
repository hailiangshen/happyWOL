// https://www.jianshu.com/p/15012027cbbb

const dgram = require('dgram')
const { exec } = require('child_process')
const iconv = require('iconv-lite')

let makeMagicPacket = (mac) => {
    let hex = "".padEnd(12, 'F')

    for (let i = 0; i < 16; i++){
        hex += mac;
    }

    return new Buffer.from(hex, "hex")
}

let initSocket = (mac) => {
    return new Promise((res, rej) => {
        try {
            let packet = makeMagicPacket(mac)
            let socket = dgram.createSocket("udp4")
            if (socket) {
                socket.on('listening', () => {
                    console.log(packet)
                    socket.setBroadcast(true)
                    socket.send(packet, 9, "255.255.255.255", (err, bytes) => {
                        if (err) {
                            console.error(err)
                        }
                        socket.close()
                        res()
                    })
                })
                socket.bind(0)
            }
        } catch (err) {
            rej(err)
        }
    })
}

// initSocket("B083FE86EB87")
// initSocket("54E1AD9DF696")

let findMacByIP = (ip) => {

    let ipReg = /((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/
    let ipFullReg = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/
    let macReg = /(([\da-f]{2}\-){5}[\da-f]{2})/

    return new Promise((res, rej) => {
        if (ip && !ipFullReg.test(ip)) {
            return rej(`<${ip}> ip地址不合法`)
        }
        exec(`arp -a ${ip}`, {
            encoding: 'buffer'
        }, (err, stdout, stderr) => {
                if (err) {
                    console.error(err)
                    rej(err)
                } else {
                    let data = iconv.decode(stdout, 'gbk').split('\r\n')
                    let lists = data.reduce((group, val) => {
                        if (val) {
                            if (val.startsWith('接口')) {
                                // 多网卡时每个网卡一个分组
                                // let ip = val.match(ipReg)[0]
                                // console.log(`分组：${val.match(ipReg)[0]}`)
                            } else {
                                let _ip = val.match(ipReg), _mac = val.match(macReg)
                                if (_ip && _mac) {
                                    group.push({
                                        ip: _ip[0],
                                        mac: _mac[0]
                                    })
                                }
                            }
                        }
                        return group
                    }, [])
                    res(lists)
                }
        })
    })
}

module.exports = {
    wakeOnLan(macAddr) {
        return initSocket(macAddr)
    },
    findMACByIP(address) {
        return findMacByIP(address)
    }
}

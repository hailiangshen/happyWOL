var http = axios.create();
http.interceptors.response.use(function (response) {
    return response.data.state == 0 ? response.data.data : Promise.reject(response.data);
}, function (error) {
    return Promise.reject(error);
})

new Vue({
    el: '#app',
    data: {
        macList: [],
        myNetInfo: {},
    },
    computed: {

    },
    methods: {
        createCurrent() {
            http.post('api/net/createMacConfig', {
                ip: this.myNetInfo.ip,
                userName: 'anonymous',
                hostName: this.myNetInfo.hostName
            }).then((data) => {
                alert('success')
            }).catch(err => {
                alert(err.message)
            })
        },
        wakeOnLan(pc) {
            http.post('api/net/wakeOnLan', {
                mac: pc.mac,
            }).then((data) => {
                alert('success')
            }).catch(err => {
                alert(err.message)
            })
        },
        getPCStatus(pc) {
            if (pc.$statusTimer || pc.aliveStatus == 1 || (pc.$lastGetTime && (pc.$lastGetTime + 1000 * 30 > new Date().getTime()))) {
                return;
            }
            pc.$statusTimer = setTimeout(() => {
                http.post('api/net/getPCStatus', {
                    ip: pc.ip,
                }).then((data) => {
                    pc.aliveStatus = data ? 1 : 0
                }).catch(err => {
                    // alert(err.message)
                    pc.aliveStatus = 0;
                }).then(() => {
                    pc.$statusTimer = null
                })
            }, 300)
            pc.$lastGetTime = new Date().getTime();
        },
        removePCStatus(pc) {
            if (pc.$statusTimer) {
                window.clearTimeout(pc.$statusTimer)
                pc.$statusTimer = null
            }
        },
        queryData() {
            return http.get('api/net/getMyList', {
                params: {
                    userName: 'anonymous'
                }
            }).then(data => {
                data.forEach(x => x.aliveStatus = -1)
                this.macList = data;
            })
        },
        getNetinfo() {
            return http.get('api/net/netinfo').then((data) => {
                if (!this.macList.some(x => x.id == data.ip)) {
                    this.myNetInfo = data;
                    // this.myNetInfo = {
                    //     ip: '192.168.3.3',
                    //     mac: 'asdasfasfasf',
                    //     hostName: 'greedy'
                    // }
                }
            })
        }
    },
    created() {
        this.queryData().then(() => {
            this.getNetinfo()
        })
    }
})
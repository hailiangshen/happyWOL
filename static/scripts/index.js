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
    methods: {
        createCurrent() {
            http.post('api/net/createMacConfig', {
                ip: this.myNetInfo.ip,
                userName: 'anonymous',
                hostName: 'greedyPC'
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
        }
    },
    created() {
        http.get('api/net/netinfo').then((data) => {
            this.myNetInfo = data;
        })
        http.get('api/net/getMyList', {
            params: {
                userName: 'anonymous'
            }
        }).then(data => {
            this.macList = data;
        })
    }
})
class Response{
    /**
     *
     * @param {数据} data
     * @param {消息} message
     * @param {状态<成功0，错误1>：默认0} state
     */
    constructor(data, message = 'success', state = 0) {
        this.state = state;
        this.data = data;
        this.message = message;
    }

    fail(message) {
        this.state = 1;
        this.message = message;
        return this;
    }
}

module.exports = Response;
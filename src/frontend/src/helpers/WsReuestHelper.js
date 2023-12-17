class WsReuestHelper {


    constructor(url) {
        // const { host, url } = config;
        this.wssocket = null;
        this.serverUrl = url;
        // `ws://${host}/${url}`;
    }

    init() {
        if (!this.wssocket) {
            this.wssocket = new WebSocket(this.serverUrl);
        }

        this.wssocket.onopen = this.onConnect.bind(this);
        this.wssocket.onclose = this.onClose.bind(this);
        this.wssocket.onerror = this.onError.bind(this);
        this.wssocket.onmessage = this.onMessage.bind(this);
    }

    onConnect() {

    }

    onClose() {

    }

    onMessage() {

    }

    onError(e) {
        console.log("WS_ERROR::", e.message);
    }

    addEventLister() {

    }

    removeEventLister() {

    }
}


export default WsReuestHelper;

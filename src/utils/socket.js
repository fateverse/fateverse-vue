class Socket {
  constructor(url) {
    this.wx = new WebSocket(url)
    this.state = false
  }

  open() {
    this.wx.onopen = (e) => {
      console.log('连接服务器成功');
      this.state = true
    }
  }

  close() {
    this.wx.onclose = (e) => {
      console.log('服务器关闭');
      this.state = false
    }
  }

  _error() {
    this.wx.onerror = (e) => {
      console.log('连接出错');
      this.state = false
      this.close()
      this.open()
    }
  }

  message() {
    this.wx.onmessage = (e) => {
      // 接收服务器发送的消息
      return e.data
    }
  }

  send(data) {
    let sendMsg
    if(data && data instanceof Object || data instanceof Array) {
      sendMsg = JSON.stringify(data)
    } else {
      sendMsg = data.toString()
    }
    this.wx.send(sendMsg)
  }
}
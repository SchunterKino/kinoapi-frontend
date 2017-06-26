const callbacks = {} // type - callback
var socket
var openCallback
var closeCallback
var errorCallback
module.exports = {
  onmessage: (type, callback) => callbacks[type] = callback,
  send: (msg) => socket.send(msg),
  onopen: (callback) => openCallback = callback,
  onclose: (callback) => closeCallback = callback,
  onerror: (callback) => errorCallback = callback,
  connect: function connect(retry) {
    socket = new WebSocket('ws://remote.schunterkino.de:8641')

    socket.onopen = () => {
      console.log("WS opened")
      openCallback()
    }

    socket.onclose = (evt) => {
      console.log("WS closed")
      closeCallback()
      // try to reconnect
      if (retry) {
        setTimeout(() => connect(retry), 2000);
      }
    }

    // allow registering multiple handlers
    socket.onmessage = (evt) => {
      console.log(evt)
      const data = JSON.parse(evt.data)
      if (data.msg_type === 'error') {
        errorCallback(data.error)
      } else if (data.msg_type in callbacks) {
        callbacks[data.msg_type](data)
      }
    }
  }
}

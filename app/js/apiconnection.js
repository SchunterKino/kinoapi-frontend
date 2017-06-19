const callbacks = {} // type - callback
var socket
var openCallback
var closeCallback
module.exports = {
  onmessage: (type, callback) => callbacks[type] = callback,
  send: (msg) => socket.send(msg),
  onopen: (callback) => openCallback = callback,
  onclose: (callback) => closeCallback = callback
}

function connect() {
  socket = new WebSocket('ws://localhost:8641')

  socket.onopen = () => {
    console.log("WS opened")
    openCallback()
  }

  socket.onclose = (evt) => {
    console.log("WS closed")
    closeCallback(evt.reason)
    // try to reconnect
    setTimeout(connect, 2000);
  }

  // allow registering multiple handlers
  socket.onmessage = (evt) => {
    console.log(evt)
    if (evt.msg_type in callbacks) {
      callbacks[evt.msg_type]()
    }
  }




}

$(connect())

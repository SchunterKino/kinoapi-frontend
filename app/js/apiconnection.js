const callbacks = {} // type : listener
const socket = new WebSocket('ws://localhost:8641')
// add helper method to websocket, to allow registering multiple handlers
socket.onApiMessage = (type, callback) => callbacks[type] = callback
socket.onmessage = (evt) => {
  console.log(evt)
  if (evt.msg_type in callbacks) {
    callbacks[evt.msg_type]()
  }
}
module.exports = socket

const callbacks = []
const socket = new WebSocket('wss://kinoapi.schunterkino.de/')
// add helper method to websocket, to allow registering multiple handlers
socket.onApiMessage = (callback) => callbacks.push(callback)
socket.onmessage = (evt) => {
  for (let i in callbacks) {
    callbacks[i](evt.data)
  }
}
module.exports = socket

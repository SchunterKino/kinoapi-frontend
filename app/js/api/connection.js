import token from './token'

const callbacks = {} // type - callback
var socket
var openCallback
var closeCallback
var errorCallback
var unauthorizedCallback
module.exports = {
  onmessage: (type, callback) => callbacks[type] = callback,
  send: (msg) => socket.send(msg),
  onOpen: (callback) => openCallback = callback,
  onClose: (callback) => closeCallback = callback,
  onError: (callback) => errorCallback = callback,
  onUnauthorized: (callback) => unauthorizedCallback = callback,
  connect: connect
}

function connect(user, password) {
  console.log('WS connecting...')
  var userString = ''
  if (typeof user !== 'undefined' && typeof password !== 'undefined') {
    userString = user + ':' + password + '@'
  }
  socket = new WebSocket('wss://' + userString + 'remote.schunterkino.de:8641')

  socket.onopen = () => {
    console.log('WS opened')
    openCallback()
  }

  socket.onclose = (evt) => {
    console.log('WS closed')
    closeCallback()
    if (evt.code === 4401) {
      token.delete()
      unauthorizedCallback()
    } else {
      // try to reconnect
      setTimeout(() => connect(), 2000)
    }
  }

  // allow registering multiple handlers
  socket.onmessage = (evt) => {
    console.log(evt)
    const data = JSON.parse(evt.data)
    if (data.msg_type === 'error') {
      errorCallback(data.error)
    } else if (data.msg_type === 'authorization') {
      token.save(msg.token)
    } else if (data.msg_type in callbacks) {
      callbacks[data.msg_type](data)
    }
  }
}

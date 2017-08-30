const callbacks = {} // type - callback
const storageKey = 'de.schunterkino.remote'
var token = localStorage.getItem(storageKey);
var socket
var openCallback
var closeCallback
var errorCallback
var authCallback
module.exports = {
  onmessage: (type, callback) => callbacks[type] = callback,
  send: (msg) => socket.send(msg),
  onOpen: (callback) => openCallback = callback,
  onClose: (callback) => closeCallback = callback,
  onError: (callback) => errorCallback = callback,
  onAuthRequired: (callback) => authCallback = callback,
  login: login,
  connect: connect
}

function login(user, password) {
  // TODO hash token or get token from api?
  // TODO use token as query parameter, cookie or in data?
  // TODO success/failure callback?
  token = user + password
  localStorage.setItem(storageKey, token);
  connect()
}

function connect(retry = true) {
  console.log('WS connecting...')
  socket = new WebSocket('wss://remote.schunterkino.de:8641')

  socket.onopen = () => {
    console.log('WS opened')
    openCallback()
  }

  socket.onclose = (evt) => {
    console.log('WS closed')
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

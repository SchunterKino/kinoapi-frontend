import connection from './connection'
connection.onmessage('curtain', (msg) => {
  switch (msg.action) {
    case 'open':
      openedCallback()
      break
    case 'close':
      closedCallback()
      break
    default:
      console.warn('unsupported action: ' + msg.action)
  }
})

var openedCallback
var closedCallback
export default {
  open: () => send('open'),
  close: () => send('close'),
  onOpened: (callback) => openedCallback = callback,
  onClosed: (callback) => closedCallback = callback
}

function send(action) {
  connection.send(JSON.stringify({
    msg_type: 'curtain',
    action: action
  }))
}

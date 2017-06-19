import apiConnection from './apiconnection'
apiConnection.onmessage('curtain', (msg) => {
  if (msg.action === 'open') {
    openedCallback()
  } else if (msg.action === 'close') {
    closedCallback()
  }
})

var openedCallback;
var closedCallback;
module.exports = {
  open: () => {
    apiConnection.send(JSON.stringify({
      msg_type: 'curtain',
      action: 'open',
    }))
  },
  close: () => {
    apiConnection.send(JSON.stringify({
      msg_type: 'curtain',
      action: 'close',
    }))
  },
  onOpened: (callback) => openedCallback = callback,
  onClosed: (callback) => closedCallback = callback
}

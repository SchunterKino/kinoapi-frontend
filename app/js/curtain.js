import apiConnection from './apiconnection'
apiConnection.onmessage('curtain', (msg) => {
  if (msg.action === 'open') {
    openedCallback()
  } else if (msg.action === 'close') {
    closedCallback()
  }
})

var openedCallback
var closedCallback
module.exports = {
  open: () => send('open'),
  close: () => send('close'),
  onOpened: (callback) => openedCallback = callback,
  onClosed: (callback) => closedCallback = callback
}

function send(action) {
  apiConnection.send(JSON.stringify({
    msg_type: 'curtain',
    action: action
  }))
}

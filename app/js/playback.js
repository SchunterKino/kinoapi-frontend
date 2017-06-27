import apiConnection from './apiconnection'
apiConnection.onmessage('playback', (msg) => {
  if (msg.action == 'projector_connection') {
    msg.connected ? availableCallback() : unavailableCallback()
  } else {
    console.log('unsupported action ' + msg.action)
  }
})

var playbackCallback
var availableCallback
var unavailableCallback
module.exports = {
  play: () => send('play'),
  pause: () => send('pause'),
  stop: () => send('stop'),
  turnOnLamp: () => send('lamp_on'),
  turnOffLamp: () => send('lamp_off'),
  openDouser: () => send('douser_open'),
  closeDouser: () => send('douser_close'),
  setInput: (mode) => send('set_input_mode', 'mode', mode),
  onAvailable: (callback) => availableCallback = callback,
  onUnavailable: (callback) => unavailableCallback = callback
}

function send(action, dataKey, dataValue) {
  const msg = {
    msg_type: 'playback',
    action: action
  }
  if (dataKey) {
    msg[dataKey] = dataValue
  }
  apiConnection.send(JSON.stringify(msg))
}

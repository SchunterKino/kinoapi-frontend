import connection from './connection'
connection.onmessage('playback', (msg) => {
  switch (msg.action) {
    case 'projector_connection':
      msg.connected ? availableCallback() : unavailableCallback()
      break
    case 'lamp_off':
      lampCallback(msg.timestamp)
      break
    default:
      console.log('unsupported action: ' + msg.action)
  }
})

var lampCallback
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
  onLampOff: (callback) => lampCallback = callback,
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
  connection.send(JSON.stringify(msg))
}
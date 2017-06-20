import apiConnection from './apiconnection'
apiConnection.onmessage('lights', (msg) => {
  if (msg.action == 'lights_connection') {
    msg.connected ? availableCallback() : unavailableCallback()
  } else {
    console.log('unsupported action ' + msg.action)
  }
})

var availableCallback
var unavailableCallback
module.exports = {
  setLightLevel: (level) => {
    apiConnection.send(JSON.stringify({
      msg_type: 'lights',
      action: 'set_light_level',
      level: level
    }))
  },
  onAvailable: (callback) => availableCallback = callback,
  onUnavailable: (callback) => unavailableCallback = callback
}

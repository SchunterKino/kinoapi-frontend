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
  play: () => {
    apiConnection.send(JSON.stringify({
      msg_type: 'playback',
      action: 'play'
    }))
  },
  pause: () => {
    apiConnection.send(JSON.stringify({
      msg_type: 'playback',
      action: 'pause'
    }))
  },
  stop: () => {
    apiConnection.send(JSON.stringify({
      msg_type: 'playback',
      action: 'stop'
    }))
  },
  turnOnLamp: () => {
    apiConnection.send(JSON.stringify({
      msg_type: 'playback',
      action: 'lamp_on'
    }))
  },
  turnOffLamp: () => {
    apiConnection.send(JSON.stringify({
      msg_type: 'playback',
      action: 'lamp_off'
    }))
  },
  openDouser: () => {
    apiConnection.send(JSON.stringify({
      msg_type: 'playback',
      action: 'douser_open'
    }))
  },
  closeDouser: () => {
    apiConnection.send(JSON.stringify({
      msg_type: 'playback',
      action: 'douser_close'
    }))
  },
  setInput: (source) => {
    apiConnection.send(JSON.stringify({
      msg_type: 'playback',
      action: 'set_input_mode',
      mode: source
    }))
  },
  onAvailable: (callback) => availableCallback = callback,
  onUnavailable: (callback) => unavailableCallback = callback
}

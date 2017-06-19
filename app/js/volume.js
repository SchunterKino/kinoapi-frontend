import apiConnection from './apiconnection'
apiConnection.onmessage('volume', (msg) => {
  switch (msg.action) {
    case 'volume_changed':
      volumeCallback(msg.volume)
      break
    case 'mute_status_changed':
      msg.muted ? muteCallback() : unmuteCallback()
      break
    case 'dolby_connection':
      msg.connected ? availableCallback() : unavailableCallback()
      break
    default:
      console.log('unsupported action: ' + msg.action)
  }
})

var volumeCallback
var unmuteCallback
var muteCallback
var availableCallback
var unavailableCallback
module.exports = {
  setVolume: (value) => {
    apiConnection.send(JSON.stringify({
      msg_type: 'volume',
      action: 'set_volume',
      volume: parseInt(value * 10) // 4.0 -> 40
    }))
  },
  increase: () => {
    apiConnection.send(JSON.stringify({
      msg_type: 'volume',
      action: 'increase_volume',
    }))
  },
  decrease: () => {
    apiConnection.send(JSON.stringify({
      msg_type: 'volume',
      action: 'decrease_volume',
    }))
  },
  mute: () => {
    apiConnection.send(JSON.stringify({
      msg_type: 'volume',
      action: 'set_mute_status',
      muted: true
    }))
  },
  unmute: () => {
    apiConnection.send(JSON.stringify({
      msg_type: 'volume',
      action: 'set_mute_status',
      muted: false
    }))
  },
  onVolumeChanged: (callback) => volumeCallback = callback,
  onUnmute: (callback) => unmuteCallback = callback,
  onMute: (callback) => muteCallback = callback,
  onAvailable: (callback) => availableCallback = callback,
  onUnavailable: (callback) => unavailableCallback = callback
}

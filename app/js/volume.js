import apiConnection from './apiconnection'
apiConnection.onmessage('volume', (msg) => {
  if (msg.action === 'volume_changed') {
    volumeCallback(msg.volume)
  }
})

var volumeCallback
var unmuteCallback
var muteCallback
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
      action: 'increase',
    }))
  },
  decrease: () => {
    apiConnection.send(JSON.stringify({
      msg_type: 'volume',
      action: 'decrease',
    }))
  },
  mute: () => {
    apiConnection.send(JSON.stringify({
      msg_type: 'volume',
      action: 'mute',
    }))
  },
  unmute: () => {
    apiConnection.send(JSON.stringify({
      msg_type: 'volume',
      action: 'unmute',
    }))
  },
  onVolumeChanged: (callback) => volumeCallback = callback,
  onUnmute: (callback) => unmuteCallback = callback,
  onMute: (callback) => muteCallback = callback
}

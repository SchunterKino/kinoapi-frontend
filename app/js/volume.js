import apiConnection from './apiconnection'
apiConnection.onmessage('volume', (msg) => {
  if (msg.action === 'volume_changed') {
    volumeCallback(msg.volume)
  }
})

var volumeCallback
module.exports = {
  setVolume: (value) => {
    apiConnection.send(JSON.stringify({
      msg_type: 'volume',
      action: 'set_volume',
      volume: parseInt(value*10) // 4.0 -> 40
    }))
  },
  onVolumeChanged: (callback) => volumeCallback = callback
}

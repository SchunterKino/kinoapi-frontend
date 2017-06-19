import apiConnection from './apiconnection'
apiConnection.onApiMessage('volume', (msg) => {
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
      volume: value
    }))
  },
  onVolumeChanged: (callback) => {
    volumeCallback = callback
  }
}

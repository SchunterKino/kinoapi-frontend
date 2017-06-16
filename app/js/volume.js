import apiConnection from './apiconnection'
apiConnection.onApiMessage((msg) => {
  // TODO call volumeCallback if applicable
})

var volumeCallback
module.exports = {
  setVolume: (value) => {
    // TODO apiConnection.send("...")
  },
  onVolumeChanged: (callback) => {
    volumeCallback = callback
  }
}

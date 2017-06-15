import apiConnection from './apiconnection'

var volumeCallback
module.exports = {
  setVolume: (value) => {

  },
  onVolumeChanged: (callback) => {
    volumeCallback = callback
  }
}

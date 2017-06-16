import apiConnection from './apiconnection'
apiConnection.onApiMessage((msg) => {
  // TODO call playbackCallback if applicable
})

var playbackCallback
module.exports = {
  PLAY: 'PLAY',
  PAUSE: 'PAUSE',
  STOP: 'STOP',
  play: () => {
    // TODO apiConnection.send("...")
  },
  pause: () => {
    // TODO apiConnection.send("...")
  },
  stop: () => {
    // TODO apiConnection.send("...")
  },
  onPlaybackChanged: (callback) => {
    playbackCallback = callback
  }
}

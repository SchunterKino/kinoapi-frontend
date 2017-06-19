import apiConnection from './apiconnection'
apiConnection.onmessage('playback', (msg) => {
  playbackCallback(msg.action)
})

var playbackCallback
module.exports = {
  PLAY: 'play',
  PAUSE: 'pause',
  STOP: 'stop',
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
  onPlaybackChanged: (callback) => playbackCallback = callback
}

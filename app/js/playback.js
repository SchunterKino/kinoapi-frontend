import apiConnection from './apiconnection'

var playbackCallback
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
}

import apiConnection from './apiconnection'

const PLAY = 'PLAY'
const PAUSE = 'PAUSE'
const STOP = 'STOP'
var playbackCallback
module.exports = {
  PLAY: PLAY,
  PAUSE: PAUSE,
  STOP: STOP,
  play: () => {

  },
  pause: () => {

  },
  stop: () => {

  },
  onPlaybackChanged: (callback) => {
    playbackCallback = callback
  }
}

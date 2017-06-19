import '../css/frontend.css'
import 'babel-polyfill'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-toggle'
import 'bootstrap-toggle/css/bootstrap-toggle.css'
import 'bootstrap-slider'
import 'bootstrap-slider/dist/css/bootstrap-slider.css'
import $ from 'jquery'
import apiConnection from './apiconnection'
import connectingDialog from './dialog'
import playback from './playback'
import volume from './volume'
import curtain from './curtain'
import lights from './lights'

var playbackState = playback.PAUSE
const connectionMessage = 'Verbinde mit Server…'

$(() => {
  initDialog()
  initPlaybackControl()
  initVolumeControl()
  initLightControl()
  initCurtainControl()
})

function initDialog() {
  connectingDialog.show(connectionMessage)
  apiConnection.onopen = () => connectingDialog.hide()
  apiConnection.onclose = (evt) => connectingDialog.show(evt.reason)
}

function initPlaybackControl() {
  $('#play-pause-button').click(() => {
    playbackState === playback.PLAY ? playback.pause() : playback.play()
  })

  $('#stop-button').click(() => {
    playback.stop()
  })

  playback.onPlaybackChanged((state) => {
    playbackState = state
    if (playbackState === playback.PLAY) {
      $('#play-pause-glyph').addClass('glyphicon-pause').removeClass('glyphicon-play')
    } else {
      $('#play-pause-glyph').addClass('glyphicon-play').removeClass('glyphicon-pause')
    }
  })
}

function initVolumeControl() {
  $('#volume-slider').change((evt) => {
    volume.setVolume(evt.value.newValue)
  })
  volume.onVolumeChanged((volume) => {
    $('#volume-slider').slider({ value: volume })
  })
}

function initLightControl() {
  const levels = [0, 33, 66, 100]
  for (let i in levels) {
    $('#light-button-' + levels[i]).click(() => {
      lights.setLightLevel(i)
    })
  }
}

function initCurtainControl() {
  $('#curtain-switch').change(() => {
    $('#curtain-switch').prop('checked') ? curtain.open() : curtain.close()
  })

  curtain.onOpened(() => {
    $('#curtain-switch').bootstrapToggle('on')
  })

  curtain.onClosed(() => {
    $('#curtain-switch').bootstrapToggle('off')
  })
}

import 'babel-polyfill'
import $ from 'jquery'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-toggle'
import 'bootstrap-toggle/css/bootstrap-toggle.css'
import 'bootstrap-slider'
import 'bootstrap-slider/dist/css/bootstrap-slider.css'
import toastr from 'toastr'
import 'toastr/build/toastr.css'
import '../css/frontend.css'
import '../css/bootstrap-toasts.css'
import apiConnection from './apiconnection'
import connectingDialog from './dialog'
import playback from './playback'
import volume from './volume'
import curtain from './curtain'
import lights from './lights'

var playbackState = playback.PAUSE
const connectionMessage = 'Verbinde mit Server…'

$(() => {
  apiConnection.connect(true)
  initDialog()
  initToasts()
  initPlaybackControl()
  initVolumeControl()
  initLightControl()
  initCurtainControl()
})

function initDialog() {
  connectingDialog.show(connectionMessage)
  apiConnection.onopen(() => connectingDialog.hide())
  apiConnection.onclose(() => connectingDialog.show(connectionMessage))
}

function initToasts() {
  toastr.options = {
    toastClass: 'alert',
    positionClass: 'toast-bottom-full-width',
    preventDuplicates: true,
    iconClasses: {
      error: 'alert-danger',
      info: 'alert-info',
      success: 'alert-success',
      warning: 'alert-warning'
    }
  }
  apiConnection.onerror((msg) => toastr.error(msg))
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
    $('#volume-slider').slider({
      value: volume
    })
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

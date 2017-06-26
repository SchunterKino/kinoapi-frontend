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
import apiConnection from './apiconnection'
import connectingDialog from './dialog'
import playback from './playback'
import volume from './volume'
import curtain from './curtain'
import lights from './lights'

const connectionMessage = 'Verbinde mit Server…'
$(() => {
  initDialog()
  initToasts()
  initPlaybackControl()
  initVolumeControl()
  initLightControl()
  initCurtainControl()
  apiConnection.connect(true)
})

function initDialog() {
  connectingDialog.show(connectionMessage)
  apiConnection.onopen(() => connectingDialog.hide())
  apiConnection.onclose(() => connectingDialog.show(connectionMessage))
}

function initToasts() {
  toastr.options = {
    positionClass: 'toast-bottom-full-width',
    preventDuplicates: true
  }
  apiConnection.onerror((msg) => toastr.error(msg))
}

function initPlaybackControl() {
  $('#play-button').click(() => {
    playback.play()
  })
  $('#pause-button').click(() => {
    playback.pause()
  })
  $('#stop-button').click(() => {
    playback.stop()
  })
}

function initVolumeControl() {
  $('#volume-slider').change((evt) => {
    volume.setVolume(evt.value.newValue)
  })
  volume.onVolumeChanged((volume) => {
    $('#volume-slider').slider('setValue', volume, true);
  })

  $('#volume-up-button').click(() => {
    volume.increase()
  })
  $('#volume-down-button').click(() => {
    volume.decrease()
  })

  $('#volume-mute-button').click(() => {
    $('#volume-mute-button').hasClass('active') ? volume.unmute() : volume.mute()
  })
  volume.onMute(() => $('#volume-mute-button').addClass('active'))
  volume.onUnmute(() => $('#volume-mute-button').removeClass('active'))

  volume.onAvailable(() => {
    $('#volume-up-button,#volume-down-button,#volume-mute-button').attr('disabled', false)
    $('#volume-slider').slider('enable')
  })
  volume.onUnavailable(() => {
    $('#volume-up-button,#volume-down-button,#volume-mute-button').attr('disabled', true)
    $('#volume-slider').slider('disable')
  })
}

function initLightControl() {
  const levels = [0, 33, 66, 100]
  for (let i in levels) {
    $('#light-button-' + levels[i]).click(() => {
      lights.setLightLevel(i)
    })
  }
  lights.onAvailable(() => {
    $('[id^=light-button-]').attr('disabled', false)
  })
  lights.onUnavailable(() => {
    $('[id^=light-button-]').attr('disabled', true)
  })
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

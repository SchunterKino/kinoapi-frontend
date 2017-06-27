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
  initInputControl()
  initAvailability()
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
  $('#play-button').click(() => playback.play())
  $('#pause-button').click(() => playback.pause())
  $('#stop-button').click(() => playback.stop())
}

function initVolumeControl() {
  $('#volume-slider').change((evt) => volume.setVolume(evt.value.newValue))
  volume.onVolumeChanged((volume) => {
    $('#volume-slider').slider('setValue', volume, true)
  })

  $('#volume-mute-button').click(() => {
    $('#volume-mute-button').hasClass('active') ? volume.unmute() : volume.mute()
  })
  volume.onMute(() => $('#volume-mute-button').addClass('active'))
  volume.onUnmute(() => $('#volume-mute-button').removeClass('active'))

  $('#volume-up-button').click(() => volume.increase())
  $('#volume-down-button').click(() => volume.decrease())
}

function initLightControl() {
  const levels = [0, 33, 66, 100]
  for (let i in levels) {
    $('#light-button-' + levels[i]).click(() => lights.setLightLevel(i))
  }
}

function initCurtainControl() {
  $('#curtain-switch').change(() => {
    $('#curtain-switch').prop('checked') ? curtain.open() : curtain.close()
  })
  curtain.onOpened(() => $('#curtain-switch').bootstrapToggle('on'))
  curtain.onClosed(() => $('#curtain-switch').bootstrapToggle('off'))
}

function initInputControl() {
  $('input[name="sound-mode"]:radio').change((e) => volume.setInput(e.target.value))
  volume.onInputChanged((inputMode) => $('input[name="sound-mode"]').val([inputMode]))
  $('#image-mode-pc-scope').click(() => playback.setInput('pc_scope'))
  $('#image-mode-pc-flat').click(() => playback.setInput('pc_flat'))
  $('#image-mode-projector-scope').click(() => playback.setInput('cinema_scope'))
  $('#image-mode-projector-flat').click(() => playback.setInput('cinema_flat'))
}

function initAvailability() {
  volume.onAvailable(() => {
    $('#volume-up-button,#volume-down-button,#volume-mute-button').attr('disabled', false)
    $('input[name="sound-mode"]:radio').attr('disabled', false)
    $('#volume-slider').slider('enable')
  })
  volume.onUnavailable(() => {
    $('#volume-up-button,#volume-down-button,#volume-mute-button').attr('disabled', true)
    $('input[name="sound-mode"]:radio').attr('disabled', true)
    $('#volume-slider').slider('disable')
  })

  lights.onAvailable(() => $('[id^=light-button-]').attr('disabled', false))
  lights.onUnavailable(() => $('[id^=light-button-]').attr('disabled', true))

  playback.onAvailable(() => {
    $('#play-button,#pause-button,#stop-button,[id^=image-mode-]').attr('disabled', false)
  })
  playback.onUnavailable(() => {
    $('#play-button,#pause-button,#stop-button,[id^=image-mode-]').attr('disabled', true)
  })
}

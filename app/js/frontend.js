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

$(() => {
  var playbackState = playback.PAUSE
  const connectionMessage = 'Verbinde mit Server…'
  const playPauseButton = $('#play_pause')
  const playPauseGlyph = $('#play_pause_glyph')
  const stopButton = $('#stop')
  const curtainToggle = $('#curtain')
  const volumeSlider = $('volume')

  initApiConnection()
  initPlaybackControl()
  initVolumeControl()
  initLightControl()
  initCurtainControl()

  function initApiConnection() {
    connectingDialog.show(connectionMessage)
    apiConnection.onDisconnected(() => connectingDialog.show(connectionMessage))
    apiConnection.onConnected(() => connectingDialog.hide())
    apiConnection.connect()
  }

  function initPlaybackControl() {
    playPauseButton.click(() => {
      if (playbackState === playback.PLAY) {
        playback.pause()
      } else {
        playback.play()
      }
    })
    stopButton.click(() => {
      playback.stop()
    })
    playback.onPlaybackChanged((state) => {
      playbackState = state
      if (playbackState === playback.PLAY) {
        playPauseGlyph.addClass('glyphicon-play')
        playPauseGlyph.removeClass('glyphicon-pause')
      } else {
        playPauseGlyph.addClass('glyphicon-pause')
        playPauseGlyph.removeClass('glyphicon-play')
      }
    })
  }

  function initVolumeControl() {

  }

  function initLightControl() {
    for (let i in [0, 33, 66, 100]) {
      const button = $('#light_' + i)
      button.click(() => {
        lights.setLightLevel(i)
      })
    }
  }

  function initCurtainControl() {
    curtainToggle.click(() => {
      curtainToggle.prop('checked') ? curtain.open() : curtain.close()
      curtain.onOpened(() => {
        curtainToggle.bootstrapToggle('on')
      })
      curtain.onClosed(() => {
        curtainToggle.bootstrapToggle('off')
      })
    })
  }
})

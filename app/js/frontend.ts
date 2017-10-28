import "bootstrap";
import "bootstrap-slider";
import "bootstrap-toggle";
import * as Notify from "notifyjs";
import * as Toastr from "toastr";
import "../css/frontend";
import apiConnection from "./api/connection";
import curtain from "./api/curtain";
import lights from "./api/lights";
import playback from "./api/playback";
import volume from "./api/volume";
import loginDialog from "./dialog/login";
import progressDialog from "./dialog/progress";

const connectionMessage = "Verbinde mit Server…";
const lampMessage = "Projektorlampe ist aus!";
const lampMessageBody = "Ausgeschaltet um ";
$(() => {
  initDialogs();
  initToasts();
  initPlaybackControl();
  initVolumeControl();
  initLightControl();
  initProjectorControl();
  initCurtainControl();
  initInputControl();
  initAvailability();
  progressDialog.show(connectionMessage);
  apiConnection.connect();
});

function initDialogs() {
  apiConnection.onOpen(progressDialog.hide);
  apiConnection.onClose(() => progressDialog.show(connectionMessage));
  apiConnection.onUnauthorized(() => loginDialog.show());
  loginDialog.onLogin((user, password) => {
    apiConnection.connect(user, password);
    loginDialog.hide();
  });
}

function initToasts() {
  Toastr.options = {
    positionClass: "toast-bottom-full-width",
    preventDuplicates: true
  };
  apiConnection.onError((msg) => Toastr.error(msg));
}

function initPlaybackControl() {
  $("#play-button").click(playback.play);
  $("#pause-button").click(playback.pause);
  $("#stop-button").click(playback.stop);
}

function initVolumeControl() {
  $("#volume-slider").change((e: any) => volume.setVolume(e.value.newValue));
  volume.onVolumeChanged((vol) => {
    $("#volume-slider").slider("setValue", vol, true);
  });

  $("#volume-mute-button").click(() => {
    $("#volume-mute-button").hasClass("active") ? volume.unmute() : volume.mute();
  });
  volume.onMute(() => $("#volume-mute-button").addClass("active"));
  volume.onUnmute(() => $("#volume-mute-button").removeClass("active"));

  $("#volume-up-button").click(volume.increase);
  $("#volume-down-button").click(volume.decrease);
}

function initLightControl() {
  const levels = [0, 33, 66, 100];
  for (const i of levels) {
    $("#light-button-" + levels[i]).click(() => lights.setLightLevel(i));
  }
}

function initProjectorControl() {
  $("#lamp-on-button").click(playback.turnOnLamp);
  $("#lamp-off-button").click(playback.turnOffLamp);
  $("#douser-open-button").click(playback.openDouser);
  $("#douser-close-button").click(playback.closeDouser);
  if (Notify.needsPermission && Notify.isSupported()) {
    Notify.requestPermission();
  }
  playback.onLampOff((timestamp) => {
    const minutes = 1000 * 60;
    const t = new Date(timestamp);
    const interval = +new Date() - +t;
    if (interval < 20 * minutes) {
      new Notify(lampMessage, {
        body: lampMessageBody + t.getHours() + ":" + t.getMinutes(),
        closeOnClick: true
      }).show();
      Toastr.info(lampMessage);
    }
  });
}

function initCurtainControl() {
  $("#curtain-switch").change(() => {
    $("#curtain-switch").prop("checked") ? curtain.open() : curtain.close();
  });
  curtain.onOpened(() => ($("#curtain-switch") as any).bootstrapToggle("on"));
  curtain.onClosed(() => ($("#curtain-switch") as any).bootstrapToggle("off"));
}

function initInputControl() {
  $("#image-mode-pc-scope").click(() => playback.setInput("pc_scope"));
  $("#image-mode-pc-flat").click(() => playback.setInput("pc_flat"));
  $("#image-mode-projector-scope").click(() => playback.setInput("cinema_scope"));
  $("#image-mode-projector-flat").click(() => playback.setInput("cinema_flat"));
  $('input[name="sound-mode"]:radio').change((e: any) => volume.setInput(e.target.value));
  volume.onInputChanged((inputMode) => $('input[name="sound-mode"]').val([inputMode]));
  $('input[name="decode-mode"]:radio').change((e: any) => volume.setDecoding(e.target.value));
  volume.onDecodingChanged((decodeMode) => $('input[name="decode-mode"]').val([decodeMode]));
}

function initAvailability() {
  disableVolumeControls(true);
  disableLightControls(true);
  disableProjektorControls(true);
  volume.onAvailable(() => disableVolumeControls(false));
  volume.onUnavailable(() => disableVolumeControls(true));
  lights.onAvailable(() => disableLightControls(false));
  lights.onUnavailable(() => disableLightControls(true));
  playback.onAvailable(() => disableProjektorControls(false));
  playback.onUnavailable(() => disableProjektorControls(true));
}

function disableVolumeControls(disabled) {
  $("#volume-up-button,#volume-down-button,#volume-mute-button").attr("disabled", disabled);
  $('input[name="sound-mode"]:radio').attr("disabled", disabled);
  $('input[name="decode-mode"]:radio').attr("disabled", disabled);
  $(".sound-mode-label").toggleClass("disabled", disabled);
  $("#volume-slider").slider(disabled ? "disable" : "enable");
}

function disableLightControls(disabled) {
  $("[id^=light-button-]").attr("disabled", disabled);
}

function disableProjektorControls(disabled) {
  $("#play-button,#pause-button,#stop-button").attr("disabled", disabled);
  $("#lamp-on-button,#lamp-off-button,#douser-open-button,#douser-close-button").attr("disabled", disabled);
  $("[id^=image-mode-]").attr("disabled", disabled);
}

import "bootstrap";
import "bootstrap-slider";
import "bootstrap-toggle";
import * as $ from "jquery";
import * as Toastr from "toastr";
import "../css/frontend";
import * as icon from "../ic_launcher.png";
import { connection, curtain, lights, playback, volume } from "./api";
import { confirmationDialog, loginDialog, progressDialog } from "./dialog";
import { Notify } from "./notify";

const connectionMessage = "Verbinde mit Server…";
const lampOffMessage = "Lampe wirklich ausschalten?";
const lampOnMessage = "Lampe wirklich einschalten?";
const lampMessage = "Projektorlampe ist aus!";
const lampMessageBody = "Ausgeschaltet um";
let firstLogin = true;
let isSliding = false;
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
  connection.connect();
});

function initDialogs() {
  connection.onOpen(() => {
    progressDialog.hide();
    loginDialog.hide();
    confirmationDialog.hide();
  });
  connection.onClose(() => {
    if (!loginDialog.isVisible()) {
      progressDialog.show(connectionMessage);
      confirmationDialog.hide();
    }
  });
  connection.onUnauthorized(() => {
    progressDialog.hide();
    confirmationDialog.hide();
    loginDialog.show(!firstLogin, (password) => {
      confirmationDialog.hide();
      progressDialog.show(connectionMessage);
      connection.login(password);
      firstLogin = false;
    });
  });
}

function initToasts() {
  Toastr.options = {
    positionClass: "toast-bottom-full-width",
    preventDuplicates: true
  };
  connection.onError((msg) => Toastr.error(msg));
}

function initPlaybackControl() {
  $("#play-button").click(playback.play);
  $("#pause-button").click(playback.pause);
  $("#stop-button").click(playback.stop);
}

function initVolumeControl() {
  $("#volume-slider").on("change", (e: any) => volume.setVolume(e.value.newValue));
  $("#volume-slider").on("slideStart", () => isSliding = true);
  $("#volume-slider").on("slideStop", () => isSliding = false);
  volume.onVolumeChanged((vol) => {
    if (!isSliding) {
      $("#volume-slider").slider("setValue", vol, false, false);
    }
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
  for (let i = 0; i < 4; i++) {
    $(`#light-button-${i}`).click(() => lights.setLightLevel(i));
  }
}

function initProjectorControl() {
  $("#lamp-on-button").click(() => {
    confirmationDialog.show(lampOnMessage, playback.turnOnLamp);
  });
  $("#lamp-off-button").click(() => {
    confirmationDialog.show(lampOffMessage, playback.turnOffLamp);
  });
  $("#douser-open-button").click(playback.openDouser);
  $("#douser-close-button").click(playback.closeDouser);
  Notify.requestPermission();
  playback.onLampOff((timestamp) => {
    const minutes = 1000 * 60;
    const t = new Date(timestamp);
    const interval = +new Date() - +t;
    if (interval < 20 * minutes) {
      if (Notify.permissionGranted) {
        new Notify(lampMessage, {
          body: `${lampMessageBody} ${t.getHours()}:${t.getMinutes()}`,
          icon,
          tag: "projector1"
        }).show();
      } else {
        Toastr.info(lampMessage);
      }
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

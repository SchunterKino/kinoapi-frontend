import "bootstrap";
import "bootstrap-slider";
import "bootstrap-toggle";
import * as $ from "jquery";
import * as Toastr from "toastr";
import "../css/frontend";
import * as icon from "../ic_launcher.png";
import { connection, curtain, lights, playback, projector, volume } from "./api";
import { AudioInputMode, DecodeMode, ErrorCode, PowerState, VideoInputMode } from "./api";
import { confirmationDialog, loginDialog, progressDialog } from "./dialog";
import { Notify } from "./notify";

const connectingMessage = "Verbinde mit Server…";
const lampOffMessage = "Lampe wirklich ausschalten?";
const lampOnMessage = "Lampe wirklich einschalten?";
const lampMessage = "Projektorlampe ist aus!";
const lampMessageBody = "Projektorlampe schaltet aus in";
let isSliding = false;

$(() => {
  initDialogs();
  initToasts();
  initCurtainControl();
  initLightControl();
  initPlaybackControl();
  initProjectorControl();
  initVolumeControl();
  initInputControl();
  initAvailability();
  progressDialog.show(connectingMessage);
  connection.connect();
});

function initDialogs() {
  connection.onOpen(() => {
    progressDialog.hide();
    loginDialog.hide();
    confirmationDialog.hide();
  });
  connection.onClose(() => {
    confirmationDialog.hide();
    if (!loginDialog.isVisible()) {
      progressDialog.show(connectingMessage);
    }
  });
  connection.onUnauthorized((errorCode: ErrorCode) => {
    progressDialog.hide();
    confirmationDialog.hide();
    loginDialog.show(errorCode, (password: string) => {
      confirmationDialog.hide();
      progressDialog.show(connectingMessage);
      connection.login(password);
    });
  });
}

function initToasts() {
  Toastr.options = {
    positionClass: "toast-bottom-full-width",
    preventDuplicates: true
  };
  connection.onError((msg: string) => Toastr.error(msg));
}

function initCurtainControl() {
  $("#curtain-switch").change(() => {
    $("#curtain-switch").prop("checked") ? curtain.open() : curtain.close();
  });
  curtain.onOpened(() => ($("#curtain-switch") as any).bootstrapToggle("on"));
  curtain.onClosed(() => ($("#curtain-switch") as any).bootstrapToggle("off"));
}

function initLightControl() {
  for (let i = 0; i < 4; i++) {
    $(`#light-button-${i}`).click(() => lights.setLightLevel(i));
  }
}

function initPlaybackControl() {
  $("#play-button").click(() => playback.play());
  $("#pause-button").click(() => playback.pause());
  $("#stop-button").click(() => playback.stop());
}

function initProjectorControl() {
  $("#lamp-on-button").click(() => {
    confirmationDialog.show(lampOnMessage, () => projector.turnOnLamp());
  });
  $("#lamp-off-button").click(() => {
    confirmationDialog.show(lampOffMessage, () => projector.turnOffLamp());
  });
  $("#douser-open-button").click(() => projector.openDouser());
  $("#douser-close-button").click(() => projector.closeDouser());
  projector.onPowerChanged((state: PowerState, timestamp?: Date) => {
    // TODO implement
  });
  projector.onLampChanged((isOn: boolean, timestamp?: Date, cooldown?: number) => {
    // TODO implement
  });
  projector.onDouserChanged((isOpen: boolean) => {
    // TODO implement
  });
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

  $("#volume-up-button").click(() => volume.increase());
  $("#volume-down-button").click(() => volume.decrease());
}

function initInputControl() {
  $("#image-mode-pc-scope").click(() => playback.setInput(VideoInputMode.PC_SCOPE));
  $("#image-mode-pc-flat").click(() => playback.setInput(VideoInputMode.PC_FLAT));
  $("#image-mode-projector-scope").click(() => playback.setInput(VideoInputMode.CINEMA_SCOPE));
  $("#image-mode-projector-flat").click(() => playback.setInput(VideoInputMode.CINEMA_FLAT));
  $('input[name="sound-mode"]:radio').change((e: any) => volume.setInput(e.target.value));
  volume.onInputChanged((mode: AudioInputMode) => $('input[name="sound-mode"]').val(mode));
  $('input[name="decode-mode"]:radio').change((e: any) => volume.setDecoding(e.target.value));
  volume.onDecodingChanged((mode: DecodeMode) => $('input[name="decode-mode"]').val(mode));
}

function initAvailability() {
  disableCurtainControls(true);
  disableLightsControls(true);
  disablePlaybackControls(true);
  disableProjectorControls(true);
  disableVolumeControls(true);
  curtain.onAvailable(() => disableCurtainControls(false));
  curtain.onUnavailable(() => disableCurtainControls(true));
  lights.onAvailable(() => disableLightsControls(false));
  lights.onUnavailable(() => disableLightsControls(true));
  playback.onAvailable(() => disablePlaybackControls(false));
  playback.onUnavailable(() => disablePlaybackControls(true));
  projector.onAvailable(() => disableProjectorControls(false));
  projector.onUnavailable(() => disableProjectorControls(true));
  volume.onAvailable(() => disableVolumeControls(false));
  volume.onUnavailable(() => disableVolumeControls(true));
}

function disableCurtainControls(disabled: boolean) {
  $("#curtain-switch").attr("disabled", disabled.toString());
}

function disableLightsControls(disabled: boolean) {
  $("[id^=light-button-]").attr("disabled", disabled.toString());
}

function disablePlaybackControls(disabled: boolean) {
  $("#play-button,#pause-button,#stop-button").attr("disabled", disabled.toString());
  $("[id^=image-mode-]").attr("disabled", disabled.toString());
}

function disableProjectorControls(disabled: boolean) {
  $("#lamp-on-button,#lamp-off-button,#douser-open-button,#douser-close-button").attr("disabled", disabled.toString());
}

function disableVolumeControls(disabled: boolean) {
  $("#volume-up-button,#volume-down-button,#volume-mute-button").attr("disabled", disabled.toString());
  $('input[name="sound-mode"]:radio').attr("disabled", disabled.toString());
  $('input[name="decode-mode"]:radio').attr("disabled", disabled.toString());
  $(".sound-mode-label").toggleClass("disabled", disabled);
  $("#volume-slider").slider(disabled ? "disable" : "enable");
}

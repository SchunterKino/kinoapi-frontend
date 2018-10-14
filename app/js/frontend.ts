import "bootstrap";
import "bootstrap-slider";
import * as $ from "jquery";
import * as Toastr from "toastr";
import "../css/frontend";
import * as icon from "../ic_launcher.png";
import { connection, curtain, lights, playback, projector, volume } from "./api";
import { AudioInputMode, DecodeMode, ErrorCode, PowerState, VideoInputMode } from "./api";
import { confirmationDialog, loginDialog, progressDialog } from "./dialog";
import { lampNotify, Notify } from "./notify";

const connectingMessage = "Verbinde mit Server…";
const lampOffConfirmMessage = "Lampe wirklich ausschalten?";
const lampOnConfirmMessage = "Lampe wirklich einschalten?";
const imbOffConfirmMessage = "IMB wirklich ausschalten?";
const imbOnConfirmMessage = "IMB wirklich einschalten?";
const seconds = 1000;
const maxMessageAge = 30 * seconds;
let isSliding = false;
let sliderMax: number;
let sliderMin: number;

$(() => {
  initLogout();
  initDialogs();
  initToasts();
  initNotifications();
  initLightControl();
  initPlaybackControl();
  initProjectorControl();
  initVolumeControl();
  initInputControl();
  initAvailability();
  progressDialog.show(connectingMessage);
  connection.connect();
});

function initLogout() {
  $("#logout").click(() => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + location.hostname;
    connection.close();
  });
}

function initDialogs() {
  connection.onOpen(() => {
    progressDialog.hide();
    loginDialog.hide();
    confirmationDialog.hide();
    $("#status-bar").removeClass("d-none");
  });
  connection.onClose(() => {
    $("#status-bar").addClass("d-none");
    confirmationDialog.hide();
    if (!loginDialog.isVisible()) {
      progressDialog.show(connectingMessage);
    }
  });
  connection.onUnauthorized((errorCode: ErrorCode) => {
    $("#status-bar").addClass("d-none");
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

function initNotifications() {
  Notify.requestPermission();
  projector.onLampChanged((isOn: boolean, timestamp?: Date, cooldown?: number) => {
    const isCoolingDown = cooldown !== null;
    disableLampControls(isCoolingDown);
    const isRecentEnough = (+Date.now() - +timestamp) < maxMessageAge;
    if (isCoolingDown || (!isOn && isRecentEnough)) {
      lampNotify.set(isOn, timestamp, cooldown);
    }

    $('input[name="lamp-state"]').val([isOn ? "1" : "0"]);
    $('input[name="lamp-state"]:checked').parent().addClass("active").siblings().removeClass("active");
  });
  projector.onDouserChanged((isOpen: boolean) => {
    $('input[name="douser-state"]').val([isOpen ? "1" : "0"]);
    $('input[name="douser-state"]:checked').parent().addClass("active").siblings().removeClass("active");
    // douserNotify.set(isOpen);
  });
  projector.onPowerChanged((state: PowerState, timestamp: Date) => {
    const isIMBOff = state !== PowerState.ON;
    disableDouserControls(isIMBOff);
    disableVideoInputControls(isIMBOff);
    // powerNotify.set(state, timestamp);

    $('input[name="imb-power"]').val([!isIMBOff ? "1" : "0"]);
    $('input[name="imb-power"]:checked').parent().addClass("active").siblings().removeClass("active");
  });
  projector.onContentIngestionChanged((isIngesting: boolean, timestamp: Date) => {
    // TODO
  });
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
  $('input[name="imb-power"]:radio').change((e: any) => {
    if (e.target.value === "1") {
      confirmationDialog.show(imbOnConfirmMessage, () => projector.turnOn());
    } else {
      confirmationDialog.show(imbOffConfirmMessage, () => projector.turnOff());
    }
  });

  $('input[name="lamp-state"]:radio').change((e: any) => {
    if (e.target.value === "1") {
      confirmationDialog.show(lampOnConfirmMessage, () => projector.turnOnLamp());
    } else {
      confirmationDialog.show(lampOffConfirmMessage, () => projector.turnOffLamp());
    }
  });

  $('input[name="douser-state"]:radio').change((e: any) => {
    if (e.target.value === "1") {
      projector.openDouser();
    } else {
      projector.closeDouser();
    }
  });
}

function initVolumeControl() {
  sliderMax = parseFloat($("#volume-slider").data("sliderMax"));
  sliderMin = parseFloat($("#volume-slider").data("sliderMin"));
  $("#volume-slider").on("change", (e: any) => volume.setVolume(e.value.newValue));
  $("#volume-slider").on("slideStart", () => isSliding = true);
  $("#volume-slider").on("slideStop", () => isSliding = false);
  volume.onVolumeChanged((vol) => {
    if (!isSliding) {
      $("#volume-slider").slider("setAttribute", "max", Math.max(vol, sliderMax));
      $("#volume-slider").slider("setAttribute", "min", Math.min(vol, sliderMin));
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
  $('input[name="image-mode"]:radio').change((e: any) => projector.setChannel(e.target.value));
  projector.onChannelChanged((channel: VideoInputMode) => $('input[name="image-mode"]').val([channel.toString()]));
  $('input[name="sound-mode"]:radio').change((e: any) => volume.setInput(e.target.value));
  volume.onInputChanged((mode: AudioInputMode) => $('input[name="sound-mode"]').val([mode.toString()]));
  $('input[name="decode-mode"]:radio').change((e: any) => volume.setDecoding(e.target.value));
  volume.onDecodingChanged((mode: DecodeMode) => $('input[name="decode-mode"]').val([mode.toString()]));
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
  $("#curtain-switch").prop("disabled", disabled);
}

function disableLightsControls(disabled: boolean) {
  $("[id^=light-button-]").prop("disabled", disabled);
}

function disablePlaybackControls(disabled: boolean) {
  $("#play-button,#pause-button,#stop-button").prop("disabled", disabled);
}

function disableProjectorControls(disabled: boolean) {
  if (disabled) {
    disableDouserControls(true);
    disableLampControls(true);
    disableVideoInputControls(true);
  }
  disableImbControls(disabled);
}

function disableLampControls(disabled: boolean) {
  $('input[name="lamp-state"]:radio').prop("disabled", disabled);
  $('input[name="lamp-state"]:radio').parent("label").toggleClass("disabled", disabled);
}

function disableDouserControls(disabled: boolean) {
  $('input[name="douser-state"]:radio').prop("disabled", disabled);
  $('input[name="douser-state"]:radio').parent("label").toggleClass("disabled", disabled);
}

function disableImbControls(disabled: boolean) {
  $('input[name="imb-power"]:radio').prop("disabled", disabled);
  $('input[name="imb-power"]:radio').parent("label").toggleClass("disabled", disabled);
}

function disableVideoInputControls(disabled: boolean) {
  $('input[name="image-mode"]:radio').prop("disabled", disabled);
  $('input[name="image-mode"]:radio').parent("label").toggleClass("disabled", disabled);
}

function disableVolumeControls(disabled: boolean) {
  $("#volume-up-button,#volume-down-button,#volume-mute-button").prop("disabled", disabled);
  $('input[name="sound-mode"]:radio').prop("disabled", disabled);
  $('input[name="sound-mode"]:radio').parent("label").toggleClass("disabled", disabled);
  $('input[name="decode-mode"]:radio').prop("disabled", disabled);
  $('input[name="decode-mode"]:radio').parent("label").toggleClass("disabled", disabled);
  $("#volume-slider").slider(disabled ? "disable" : "enable");
}

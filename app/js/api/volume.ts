import connection from "./connection";
connection.onmessage("volume", (msg) => {
  switch (msg.action) {
    case "volume_changed":
      volumeCallback(msg.volume / 10.0);
      break;
    case "mute_status_changed":
      msg.muted ? muteCallback() : unmuteCallback();
      break;
    case "dolby_connection":
      msg.connected ? availableCallback() : unavailableCallback();
      break;
    case "input_mode_changed":
      inputCallback(msg.mode);
      break;
    case "decode_mode_changed":
      decodingCallback(msg.mode);
      break;
    default:
      console.warn("unsupported action: " + msg.action);
  }
});

let volumeCallback;
let unmuteCallback;
let muteCallback;
let inputCallback;
let decodingCallback;
let availableCallback;
let unavailableCallback;
export default {
  setVolume: (value) => send("set_volume", "volume", value * 10), // 4.0 -> 40
  increase: () => send("increase_volume"),
  decrease: () => send("decrease_volume"),
  mute: () => send("set_mute_status", "muted", true),
  unmute: () => send("set_mute_status", "muted", false),
  setInput: (mode) => send("set_input_mode", "mode", mode),
  setDecoding: (mode) => send("set_decode_mode", "mode", mode),
  onVolumeChanged: (callback) => volumeCallback = callback,
  onUnmute: (callback) => unmuteCallback = callback,
  onMute: (callback) => muteCallback = callback,
  onInputChanged: (callback) => inputCallback = callback,
  onDecodingChanged: (callback) => decodingCallback = callback,
  onAvailable: (callback) => availableCallback = callback,
  onUnavailable: (callback) => unavailableCallback = callback
};

function send(action, dataKey?, dataValue?) {
  const msg = {
    msg_type: "volume",
    action
  };
  if (dataKey) {
    msg[dataKey] = dataValue;
  }
  connection.send(JSON.stringify(msg));
}
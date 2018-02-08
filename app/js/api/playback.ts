import connection from "./connection";

export enum InputMode {
  CINEMA_FLAT = "cinema_flat",
  CINEMA_SCOPE = "cinema_scope",
  PC_FLAT = "pc_flat",
  PC_SCOPE = "pc_scope",
}

connection.onmessage("playback", (msg) => {
  switch (msg.action) {
    case "connection":
      msg.connected ? availableCallback() : unavailableCallback();
      break;
    default:
      console.warn("unsupported action", msg.action);
  }
});

let availableCallback;
let unavailableCallback;
export default {
  play: () => send("play"),
  pause: () => send("pause"),
  stop: () => send("stop"),
  onAvailable: (callback) => availableCallback = callback,
  onUnavailable: (callback) => unavailableCallback = callback
};

function send(action) {
  const msg = {
    msg_type: "playback",
    action
  };
  connection.send(JSON.stringify(msg));
}

import connection from "./connection";

export enum PowerState {
  OFF = 0,
  WARM_UP = 1,
  ON = 2,
}

connection.onmessage("projector", (msg) => {
  switch (msg.action) {
    case "connection":
      msg.connected ? availableCallback() : unavailableCallback();
      break;
    case "power_changed":
      powerCallback(msg.state, msg.timestamp);
      break;
    case "lamp_changed":
      lampCallback(msg.is_on, msg.timestamp, msg.cooldown);
      break;
    case "douser_changed":
      douserCallback(msg.is_open);
      break;
    default:
      console.warn("unsupported action", msg.action);
  }
});

let lampCallback;
let powerCallback;
let availableCallback;
let unavailableCallback;
let douserCallback;
export default {
  turnOn: () => send("power_on"),
  turnOff: () => send("power_on"),
  turnOnLamp: () => send("lamp_on"),
  turnOffLamp: () => send("lamp_off"),
  openDouser: () => send("douser_open"),
  closeDouser: () => send("douser_close"),
  powerCallback: (callback) => powerCallback = callback,
  onLampChanged: (callback) => lampCallback = callback,
  onDouserChanged: (callback) => douserCallback = callback,
  onAvailable: (callback) => availableCallback = callback,
  onUnavailable: (callback) => unavailableCallback = callback
};

function send(action, dataKey?, dataValue?) {
  const msg = {
    msg_type: "projector",
    action
  };
  if (dataKey) {
    msg[dataKey] = dataValue;
  }
  connection.send(JSON.stringify(msg));
}

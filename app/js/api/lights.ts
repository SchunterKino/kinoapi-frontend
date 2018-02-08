import connection from "./connection";

export enum LightLevel {
  OFF = 0,
  LOW = 1,
  HIGH = 2,
  MAX = 3,
}

connection.onmessage("lights", (msg) => {
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
  setLightLevel: (level) => {
    connection.send(JSON.stringify({
      msg_type: "lights",
      action: "set_light_level",
      level
    }));
  },
  onAvailable: (callback) => availableCallback = callback,
  onUnavailable: (callback) => unavailableCallback = callback
};

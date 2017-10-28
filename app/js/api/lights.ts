import connection from "./connection";
connection.onmessage("lights", (msg) => {
  switch (msg.action) {
    case "lights_connection":
      msg.connected ? availableCallback() : unavailableCallback();
      break;
    default:
      console.warn("unsupported action: " + msg.action);
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

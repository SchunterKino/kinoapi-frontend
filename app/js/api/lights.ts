import { Connection, default as apiconnection } from "./connection";

export enum LightLevel {
  OFF = 0,
  LOW = 1,
  HIGH = 2,
  MAX = 3,
}

export class Lights {
  private availableCallback: () => void;
  private unavailableCallback: () => void;

  public constructor(private connection: Connection) {
    this.connection.onmessage("lights", (msg) => {
      switch (msg.action) {
        case "connection":
          msg.connected
            ? this.availableCallback()
            : this.unavailableCallback();
          break;
        default:
          console.warn("unsupported action", msg.action);
      }
    });
  }

  public onAvailable(callback: () => void) {
    this.availableCallback = callback;
  }

  public onUnavailable(callback: () => void) {
    this.unavailableCallback = callback;
  }

  public setLightLevel(level: LightLevel) {
    this.connection.send(JSON.stringify({
      msg_type: "lights",
      action: "set_light_level",
      level
    }));
  }
}

export default new Lights(apiconnection);

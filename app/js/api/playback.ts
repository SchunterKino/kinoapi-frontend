import { Connection, default as apiconnection } from "./connection";

export enum InputMode {
  CINEMA_FLAT = "cinema_flat",
  CINEMA_SCOPE = "cinema_scope",
  PC_FLAT = "pc_flat",
  PC_SCOPE = "pc_scope",
}

export class Playback {
  private availableCallback: () => void;
  private unavailableCallback: () => void;

  public constructor(private connection: Connection) {
    this.connection.onmessage("playback", (msg) => {
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

  public play() {
    this.send("play");
  }

  public pause() {
    this.send("pause");
  }

  public stop() {
    this.send("stop");
  }

  public setInput(mode: InputMode) {
    this.send("set_input_mode", mode);
  }

  private send(action: string, dataKey?: string, dataValue?: any) {
    const msg = {
      msg_type: "playback",
      action
    };
    if (dataKey) {
      msg[dataKey] = dataValue;
    }
    this.connection.send(JSON.stringify(msg));
  }
}

export default new Playback(apiconnection);

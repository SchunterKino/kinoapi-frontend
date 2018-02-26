import { Connection, default as apiconnection } from "./connection";

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

  private send(action: string) {
    const msg = {
      msg_type: "playback",
      action
    };
    this.connection.send(JSON.stringify(msg));
  }
}

export default new Playback(apiconnection);

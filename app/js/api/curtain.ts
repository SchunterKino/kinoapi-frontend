import { Connection, default as apiconnection } from "./connection";

export class Curtain {
  private availableCallback: () => void;
  private unavailableCallback: () => void;
  private openedCallback: () => void;
  private closedCallback: () => void;

  public constructor(private connection: Connection) {
    this.connection.onmessage("curtain", (msg) => {
      switch (msg.action) {
        case "connection":
          msg.connected
            ? this.availableCallback()
            : this.unavailableCallback();
          break;
        case "open":
          this.openedCallback();
          break;
        case "close":
          this.closedCallback();
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

  public onClosed(callback: () => void) {
    this.closedCallback = callback;
  }

  public onOpened(callback: () => void) {
    this.openedCallback = callback;
  }

  public open() {
    this.send("open");
  }

  public close() {
    this.send("close");
  }

  private send(action: string) {
    this.connection.send(JSON.stringify({
      msg_type: "curtain",
      action
    }));
  }
}

export default new Curtain(apiconnection);

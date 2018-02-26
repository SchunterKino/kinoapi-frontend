import * as $ from "jquery";

export enum ErrorCode {
  UNAUTHORIZED = 401,
  INVALID_TOKEN = 4401,
  SESSION_EXPIRED = 4402,
  AUTH_ERROR = 0,
}

export class Connection {
  private callbacks: { [type: string]: (data) => void } = {};
  private socket: WebSocket;
  private openCallback: () => void;
  private closeCallback: () => void;
  private errorCallback: (error: string) => void;
  private unauthorizedCallback: (error: ErrorCode) => void;

  public constructor(private websocketUrl: URL, private tokenServerUrl: URL) { }

  // TODO use rxjs for callbacks?
  public onmessage(type: string, callback: (data) => void) {
    this.callbacks[type] = callback;
  }

  public send(msg: string) {
    console.log("[WS] send", msg);
    this.socket.send(msg);
  }

  public onClose(callback: () => void) {
    this.closeCallback = callback;
  }

  public onOpen(callback: () => void) {
    this.openCallback = callback;
  }

  public onError(callback: (error: string) => void) {
    this.errorCallback = callback;
  }

  public onUnauthorized(callback: (error: ErrorCode) => void) {
    this.unauthorizedCallback = callback;
  }

  public login(password: string) {
    $.ajax({
      method: "POST",
      url: this.tokenServerUrl.toString(),
      data: { password }
    })
      .done(() => {
        this.connect();
      })
      .fail((jqXHR, textStatus, error) => {
        console.log("[login] failed", jqXHR.status);
        if (jqXHR.status === ErrorCode.UNAUTHORIZED) {
          this.unauthorizedCallback(ErrorCode.UNAUTHORIZED);
        } else {
          this.unauthorizedCallback(ErrorCode.AUTH_ERROR);
          this.errorCallback(jqXHR.responseText);
        }
      });
  }

  public connect() {
    console.log("[WS] connecting...");
    this.socket = new WebSocket(this.websocketUrl.toString());

    this.socket.onopen = () => {
      console.log("[WS] opened");
      this.openCallback();
    };

    this.socket.onclose = (evt) => {
      console.log("[WS] closed", evt.code);
      this.closeCallback();
      if (evt.code === ErrorCode.INVALID_TOKEN || evt.code === ErrorCode.SESSION_EXPIRED) {
        this.unauthorizedCallback(evt.code);
      } else {
        // try to reconnect
        setTimeout(() => this.connect(), 2000);
      }
    };

    this.socket.onmessage = (evt) => {
      console.log("[WS] message", evt);
      const data = JSON.parse(evt.data);
      if (data.msg_type === "error") {
        this.errorCallback(data.error);
      } else if (data.msg_type in this.callbacks) {
        this.callbacks[data.msg_type](data);
      }
    };
  }

  public close() {
    this.socket.close(1000);
    this.socket = null;
  }
}

export default new Connection(
  new URL("wss://remote.schunterkino.de:8641"),
  new URL("https://remote.schunterkino.de/token.php")
);

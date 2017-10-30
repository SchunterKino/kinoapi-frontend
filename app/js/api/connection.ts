const websocketUrl = new URL("wss://remote.schunterkino.de:8641");
const tokenServerUrl = new URL("https://remote.schunterkino.de:1234"); // FIXME
export class Connection {
  private callbacks: { [type: string]: (data) => void } = {};
  private socket: WebSocket;
  private openCallback: () => void;
  private closeCallback: () => void;
  private errorCallback: (error: string) => void;
  private unauthorizedCallback: () => void;

  public constructor(private url: URL) { }

  // TODO use rxjs for callbacks?
  public onmessage(type: string, callback: (data) => void) {
    this.callbacks[type] = callback;
  }

  public send(msg: string) {
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

  public onUnauthorized(callback: () => void) {
    this.unauthorizedCallback = callback;
  }

  public login(password: string) {
    $.ajax({
      method: "POST",
      url: tokenServerUrl.toString(),
      data: { password }
    })
      .done(() => {
        this.connect();
      })
      .fail((jqXHR, textStatus, error) => {
        this.unauthorizedCallback();
        if (jqXHR.status !== 401) {
          this.errorCallback(jqXHR.responseText);
        }
      });
  }

  public connect() {
    console.log("[WS] connecting...");
    this.socket = new WebSocket(this.url.toString());

    this.socket.onopen = () => {
      console.log("[WS] opened");
      this.openCallback();
    };

    this.socket.onclose = (evt) => {
      console.log("[WS] closed");
      this.closeCallback();
      if (evt.code === 4401) {
        this.unauthorizedCallback();
      } else {
        // try to reconnect
        setTimeout(() => this.connect(), 2000);
      }
    };

    this.socket.onmessage = (evt) => {
      console.log(evt);
      const data = JSON.parse(evt.data);
      if (data.msg_type === "error") {
        this.errorCallback(data.error);
      } else if (data.msg_type in this.callbacks) {
        this.callbacks[data.msg_type](data);
      }
    };
  }
}

export default new Connection(websocketUrl);

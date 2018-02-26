import { Connection, default as apiconnection } from "./connection";

export enum PowerState {
  OFF = 0,
  WARM_UP = 1,
  ON = 2,
}

export enum InputMode {
  UNKNOWN = 0,
  CINEMA_FLAT = 1,
  CINEMA_SCOPE = 2,
  PC_FLAT = 3,
  PC_SCOPE = 4,
}

export class Projector {
  private availableCallback: () => void;
  private unavailableCallback: () => void;
  private powerCallback: (state: PowerState, timestamp: Date) => void;
  private lampCallback: (isOn: boolean, timestamp: Date, cooldown?: number) => void;
  private douserCallback: (isOpen: boolean) => void;
  private channelCallback: (channel: InputMode) => void;
  private ingestionCallback: (isIngesting: boolean, timestamp: Date) => void;

  public constructor(private connection: Connection) {
    connection.onmessage("projector", (msg) => {
      switch (msg.action) {
        case "connection":
          msg.connected
            ? this.availableCallback()
            : this.unavailableCallback();
          break;
        case "power_changed":
          this.powerCallback(
            msg.state,
            new Date(msg.timestamp)
          );
          break;
        case "lamp_changed":
          this.lampCallback(
            msg.is_on,
            new Date(msg.timestamp),
            msg.cooldown ? msg.cooldown * 1000 : null
          );
          break;
        case "douser_changed":
          this.douserCallback(msg.is_open);
          break;
        case "channel_changed":
          this.channelCallback(msg.channel);
          break;
        case "ingest_state_changed":
          this.ingestionCallback(
            msg.is_ingesting,
            new Date(msg.timestamp)
          );
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

  public onPowerChanged(callback: (state: PowerState, timestamp?: Date) => void) {
    this.powerCallback = callback;
  }

  public onLampChanged(callback: (isOn: boolean, timestamp?: Date, cooldown?: number) => void) {
    this.lampCallback = callback;
  }

  public onDouserChanged(callback: (isOpen: boolean) => void) {
    this.douserCallback = callback;
  }

  public onChannelChanged(callback: (channel: InputMode) => void) {
    this.channelCallback = callback;
  }

  public onContentIngestionChanged(callback: (isIngesting: boolean, timestamp: Date) => void) {
    this.ingestionCallback = callback;
  }

  public turnOn() {
    this.send("power_on");
  }

  public turnOff() {
    this.send("power_off");
  }

  public turnOnLamp() {
    this.send("lamp_on");
  }

  public turnOffLamp() {
    this.send("lamp_off");
  }

  public openDouser() {
    this.send("douser_open");
  }

  public closeDouser() {
    this.send("douser_close");
  }

  public setChannel(channel: InputMode) {
    this.send("set_channel", "channel", channel);
  }

  private send(action: string, dataKey?: string, dataValue?: any) {
    const msg = {
      msg_type: "projector",
      action
    };
    if (dataKey) {
      msg[dataKey] = dataValue;
    }
    this.connection.send(JSON.stringify(msg));
  }
}

export default new Projector(apiconnection);

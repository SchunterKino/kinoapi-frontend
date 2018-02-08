import { Connection, default as apiconnection } from "./connection";

export enum InputMode {
  DIGITAL_1 = 0,
  DIGITAL_2 = 1,
  DIGITAL_3 = 2,
  DIGITAL_4 = 3,
  ANALOG = 4,
  NON_SYNC = 5,
  MICROPHONE = 6,
  LAST = 7,
}

export enum DecodeMode {
  AUTO = 0,
  INVALID = 1,
  N_A = 2,
  SURROUND_5_1 = 3,
  DOLBY_PRO_LOGIC = 4,
  DOLBY_PRO_LOGIC_2 = 5,
  MICROPHONESURROUND_7_1 = 6,
}

export class Volume {
  private availableCallback: () => void;
  private unavailableCallback: () => void;
  private volumeCallback: (volume: number) => void;
  private muteCallback: () => void;
  private unmuteCallback: () => void;
  private inputCallback: (mode: InputMode) => void;
  private decodingCallback: (mode: DecodeMode) => void;

  public constructor(private connection: Connection) {
    this.connection.onmessage("volume", (msg) => {
      switch (msg.action) {
        case "connection":
          msg.connected
            ? this.availableCallback()
            : this.unavailableCallback();
          break;
        case "volume_changed":
          this.volumeCallback(msg.volume / 10.0);
          break;
        case "mute_status_changed":
          msg.muted
            ? this.muteCallback()
            : this.unmuteCallback();
          break;
        case "input_mode_changed":
          this.inputCallback(msg.mode);
          break;
        case "decode_mode_changed":
          this.decodingCallback(msg.mode);
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

  public onVolumeChanged(callback: (volume: number) => void) {
    this.volumeCallback = callback;
  }

  public onMute(callback: () => void) {
    this.muteCallback = callback;
  }

  public onUnmute(callback: () => void) {
    this.unmuteCallback = callback;
  }

  public onInputChanged(callback: (mode: InputMode) => void) {
    this.inputCallback = callback;
  }

  public onDecodingChanged(callback: (mode: DecodeMode) => void) {
    this.decodingCallback = callback;
  }

  public setVolume(value: number) {
    this.send("set_volume", "volume", value * 10); // 4.0 -> 40
  }

  public increase() {
    this.send("increase_volume");
  }

  public decrease() {
    this.send("decrease_volume");
  }

  public mute() {
    this.send("set_mute_status", "muted", true);
  }

  public unmute() {
    this.send("set_mute_status", "muted", false);
  }

  public setInput(mode: DecodeMode) {
    this.send("set_input_mode", "mode", mode);
  }

  public setDecoding(mode: DecodeMode) {
    this.send("set_decode_mode", "mode", mode);
  }

  private send(action: string, dataKey?: string, dataValue?: any) {
    const msg = {
      msg_type: "volume",
      action
    };
    if (dataKey) {
      msg[dataKey] = dataValue;
    }
    this.connection.send(JSON.stringify(msg));
  }
}

export default new Volume(apiconnection);

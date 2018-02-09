import * as Toastr from "toastr";
import * as icon from "../../ic_launcher.png";
import { Notify } from "./notify";

const lampOffMessage = "Projektorlampe ausgeschaltet.";
const lampCooldownMessage = "Projektorlampe kühlt ab.";
const lampOnMessage = "Projektorlampe angeschaltet.";

export class LampNotify {
    private static interval: number = null;
    private message;
    private body;
    public constructor(isOn: boolean, timestamp?: Date, cooldown?: number) {
        if (cooldown == null) {
            this.message = isOn ? lampOnMessage : lampOffMessage;
            this.body = `Um ${timestamp.toLocaleTimeString()}`;
        } else if (cooldown > 0) {
            this.message = lampCooldownMessage;
            const m = Math.floor(cooldown / 60);
            const s = cooldown;
            if (m === 1) {
                this.body = `Noch eine Minute.`;
            } else if (m > 1) {
                this.body = `Noch ${m} Minuten.`;
            } else if (s === 1) {
                this.body = `Noch eine Sekunde.`;
            } else {
                this.body = `Noch ${s} Sekunden.`;
            }
        } else {
            this.message = lampOffMessage;
            this.body = `Um ${timestamp.toLocaleTimeString()}`;
        }
    }

    public show() {
        if (Notify.permissionGranted) {
            new Notify(this.message, {
                body: this.body,
                icon,
                tag: "projector_lamp"
            }).show();
        } else {
            Toastr.info(this.message, this.body);
        }
    }
}

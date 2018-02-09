import * as Toastr from "toastr";
import * as icon from "../../ic_launcher.png";
import { PowerState } from "../api";
import { Notify } from "./notify";

const powerStateMessages: { [powerState: number]: string } = {};
powerStateMessages[PowerState.OFF] = "Projektor heruntergefahren.";
powerStateMessages[PowerState.ON] = "Projektor hochgefahren.";
powerStateMessages[PowerState.WARM_UP] = "Projektor fährt hoch.";

export class PowerNotify {
    private message: string;
    private body: string;
    public constructor(state: PowerState, timestamp?: Date) {
        const message = powerStateMessages[state];
        const body = `Um ${timestamp.toLocaleTimeString()}`;
    }

    public show() {
        if (Notify.permissionGranted) {
            new Notify(this.message, {
                body: this.body,
                icon,
                tag: "projector_power"
            }).show();
        } else {
            Toastr.info(this.message, this.body);
        }
    }
}

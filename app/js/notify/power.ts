import * as Toastr from "toastr";
import * as icon from "../../ic_launcher.png";
import { PowerState } from "../api";
import { Notify } from "./notify";

export class PowerNotify {
    private message: string;
    private body: string;

    public constructor(
        private powerStateMessages: { [powerState: number]: string } = {}
    ) { }

    public set(state: PowerState, timestamp: Date) {
        this.message = this.powerStateMessages[state];
        this.body = `Um ${timestamp.toLocaleTimeString()}`;
        this.show();
    }

    private show() {
        if (Notify.permissionGranted) {
            new Notify(this.message, { body: this.body, icon, tag: "projector_power" }).show();
        }
        Toastr.info(this.body, this.message);
    }
}

export default new PowerNotify({
    [PowerState.OFF]: "Projektor heruntergefahren.",
    [PowerState.ON]: "Projektor hochgefahren.",
    [PowerState.WARM_UP]: "Projektor fährt hoch.",
});

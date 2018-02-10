import * as Toastr from "toastr";
import * as icon from "../../ic_launcher.png";
import { Notify } from "./notify";

export class DouserNotify {
    private message: string;

    public constructor(
        private douserOpenedMessage: string,
        private douserClosedMessage: string,
    ) { }

    public set(isOpen: boolean) {
        this.message = isOpen ? this.douserOpenedMessage : this.douserClosedMessage;
        this.show();
    }

    private show() {
        if (Notify.permissionGranted) {
            new Notify(this.message, { icon, tag: "projector_douser" }).show();
        }
        Toastr.info(this.message);
    }
}

export default new DouserNotify(
    "Projektorklappe geöffnet.",
    "Projektorklappe geschlossen."
);

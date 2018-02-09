import * as Toastr from "toastr";
import * as icon from "../../ic_launcher.png";
import { Notify } from "./notify";

const douserOpenedMessage = "Projektorklappe geöffnet.";
const douserClosedMessage = "Projektorklappe geschlossen.";

export class DouserNotify {
    private message;
    public constructor(isOpen: boolean) {
        this.message = isOpen ? douserOpenedMessage : douserClosedMessage;
    }

    public show() {
        if (Notify.permissionGranted) {
            new Notify(this.message, {
                icon,
                tag: "projector_douser"
            }).show();
        } else {
            Toastr.info(this.message);
        }
    }
}

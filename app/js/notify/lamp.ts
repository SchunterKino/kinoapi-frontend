import * as Toastr from "toastr";
import * as icon from "../../ic_launcher.png";
import { Notify } from "./notify";

export class LampNotify {
    private refreshTimeoutId: number = null;
    private isOn: boolean;
    private cooldown?: number;
    private timestamp: Date;

    public constructor(
        private autoRefresh: boolean,
        private lampOffMessage: string,
        private lampCooldownMessage: string,
        private lampOnMessage: string,
    ) { }

    public set(isOn: boolean, timestamp: Date, cooldown?: number) {
        this.isOn = isOn;
        this.timestamp = timestamp;
        this.cooldown = cooldown;
        this.show(false);
        if (this.autoRefresh) {
            this.clearPreviousRefresh();
            if (this.cooldown != null) {
                this.refreshAfterDelay(1000);
            }
        }
    }

    private clearPreviousRefresh() {
        if (this.refreshTimeoutId !== null) {
            clearTimeout(this.refreshTimeoutId);
            this.refreshTimeoutId = null;
        }
    }

    private refreshAfterDelay(delay: number) {
        if (this.cooldown > 0) {
            this.refreshTimeoutId = window.setTimeout(() => {
                this.refreshTimeoutId = null;
                this.show(true);
                this.cooldown -= delay / 1000;
                this.refreshAfterDelay(delay);
            }, this.cooldown % delay);
        }
    }

    private show(update: boolean) {
        let message: string;
        let body: string;
        let seconds;
        let minutes;
        if (this.cooldown === null) {
            message = this.isOn ? this.lampOnMessage : this.lampOffMessage;
            body = `Um ${this.timestamp.toLocaleTimeString()}`;
        } else {
            seconds = Math.round(this.cooldown / 1000);
            minutes = Math.floor(seconds / 60);
            if (minutes > 1) {
                message = this.lampCooldownMessage;
                body = `Noch ${minutes} Minuten.`;
            } else if (minutes === 1) {
                message = this.lampCooldownMessage;
                body = `Noch eine Minute.`;
            } else if (seconds > 0) {
                message = this.lampCooldownMessage;
                body = `Noch ${seconds} Sekunden.`;
            } else if (seconds === 1) {
                message = this.lampCooldownMessage;
                body = `Noch eine Sekunde.`;
            } else {
                message = this.lampCooldownMessage;
                body = `Jeden Moment fertig!`;
            }
        }

        if (Notify.permissionGranted) {
            const renotify = update ? true : undefined;
            const options: any = { body, icon, renotify, tag: "projector" };
            new Notify(message, options).show(() => this.clearPreviousRefresh());
        } else if (seconds !== null) {
            Toastr.info(body, message, { progressBar: true, timeout: seconds });
        } else {
            Toastr.info(body, message);
        }
    }
}

export default new LampNotify(
    true,
    "Projektorlampe ausgeschaltet.",
    "Projektorlampe kühlt ab.",
    "Projektorlampe angeschaltet.",
);

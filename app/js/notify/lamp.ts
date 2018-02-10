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
        this.show();
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
        const cooldownFromNow = this.getCooldownFromNow(this.timestamp, this.cooldown);
        if (cooldownFromNow > 0) {
            this.refreshTimeoutId = window.setTimeout(() => {
                this.refreshTimeoutId = null;
                this.show();
                this.refreshAfterDelay(delay);
            }, cooldownFromNow % delay);
        }
    }

    private getCooldownFromNow(timestamp: Date, cooldown: number): number {
        const timestampAge = (+Date.now() - +timestamp);
        return cooldown - timestampAge;
    }

    private show() {
        let message: string;
        let body: string;
        let timeOut = null;
        if (this.cooldown === null) {
            message = this.isOn ? this.lampOnMessage : this.lampOffMessage;
            body = `Um ${this.timestamp.toLocaleTimeString()}`;
        } else {
            timeOut = this.getCooldownFromNow(this.timestamp, this.cooldown);
            const seconds = Math.round(timeOut / 1000);
            const minutes = Math.floor(seconds / 60);
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
                message = this.isOn ? this.lampOffMessage : this.lampOnMessage;
                body = `Um ${this.timestamp.toLocaleTimeString()}`;
            }
        }

        if (Notify.permissionGranted) {
            new Notify(message, { body, icon, tag: "projector_lamp" }).show();
        } else if (timeOut !== null) {
            Toastr.info(null, message, { progressBar: true, timeOut });
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

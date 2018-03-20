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
                this.refreshAfterDelay();
            }
        }
    }

    private clearPreviousRefresh() {
        if (this.refreshTimeoutId !== null) {
            clearTimeout(this.refreshTimeoutId);
            this.refreshTimeoutId = null;
        }
    }

    private refreshAfterDelay() {
        if (this.cooldown > 0) {
            const delay = this.getDelay();
            this.refreshTimeoutId = window.setTimeout(() => {
                this.refreshTimeoutId = null;
                this.cooldown -= delay;
                this.show(true);
                this.refreshAfterDelay();
            }, delay);
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
            const silent = update ? true : undefined;
            const options: any = { body, icon, silent, requireInteraction: true, tag: "projector" };
            new Notify(
                message,
                options,
                () => this.clearPreviousRefresh()
            ).show();
        } else if (seconds !== null) {
            Toastr.info(message, body, {
                progressBar: true,
                timeOut: seconds * 1000,
                extendedTimeOut: 0,
                onHidden: () => this.clearPreviousRefresh()
            });
        } else {
            Toastr.info(body, message);
        }
    }

    private getDelay() {
        const seconds = Math.round(this.cooldown / 1000);
        const minutes = Math.floor(seconds / 60);
        if (minutes >= 2) {
            return 60 * 1000;
        }
        if (seconds > 30) {
            return 15 * 1000;
        }
        return 5 * 1000;
    }
}

export default new LampNotify(
    true,
    "Projektorlampe ausgeschaltet.",
    "Projektorlampe kühlt ab.",
    "Projektorlampe angeschaltet.",
);

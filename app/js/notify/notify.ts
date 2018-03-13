import * as runtime from "serviceworker-webpack-plugin/lib/runtime";

export class Notify {
    public static permissionGranted: boolean = false;
    public static requestPermission(): void {
        if (!("Notification" in window) || !("serviceWorker" in navigator)) {
            console.warn("Notifications not supported");
            return;
        }
        if (Notification.prototype.permission === "granted") {
            Notify.permissionGranted = true;
            return;
        }
        Notification.requestPermission((result) => {
            if (result === "granted") {
                runtime.register().then((registration) => {
                    Notify.registration = registration;
                    Notify.permissionGranted = true;
                });
            } else {
                console.warn("Notification permission not granted");
            }
        });
    }
    private static registration: ServiceWorkerRegistration;

    constructor(private message: string, private options?: NotificationOptions) { }

    public show(dismissCallback?: () => void) {
        if (dismissCallback) {
            this.onNotificationClosed(dismissCallback);
        }
        if (!Notify.permissionGranted) {
            console.warn("[notification] permission not granted");
        } else {
            Notify.registration.showNotification(this.message, this.options);
        }
    }

    private onNotificationClosed(dismissCallback: () => void) {
        const listener = (event) => {
            if (event.data[1] === this.options.tag) {
                window.navigator.serviceWorker.removeEventListener("message", listener);
                dismissCallback();
            }
        };
        window.navigator.serviceWorker.addEventListener("message", listener);
    }
}

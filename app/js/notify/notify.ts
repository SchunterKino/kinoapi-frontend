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

    public show() {
        if (Notify.permissionGranted) {
            Notify.registration.showNotification(this.message, this.options);
        } else {
            console.warn("Could not show Notification");
        }
    }
}

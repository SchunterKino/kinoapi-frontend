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
        if (!Notify.permissionGranted) {
            console.warn("[notification] permission not granted");
        } else {
            Notify.registration
                .showNotification(this.message, this.options)
                .then(() => Notify.registration.getNotifications({ tag: this.options.tag }))
                .then((notifications: Notification[]) => {
                    if (notifications.length === 0) {
                        console.error("[notification] not found");
                    } else if (dismissCallback) {
                        console.log("[notification] dismissed");
                        notifications[0].onclose = () => dismissCallback();
                    }
                });
        }
    }
}

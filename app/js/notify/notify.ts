import * as runtime from "serviceworker-webpack-plugin/lib/runtime";

export class Notify {
    public static permissionGranted: boolean = false;
    public static requestPermission(): void {
        if (!("Notification" in window) || !("serviceWorker" in navigator)) {
            console.warn("Notifications not supported");
            return;
        }
        if (Notification.permission === "granted") {
            Notify.permissionGranted = true;
            return;
        }
        // TODO typescript doesn't support new notification api yet
        (Notification as any).requestPermission()
            .then((result: NotificationPermission) => {
                if (result === "granted") {
                    return runtime.register();
                } else {
                    return Promise.reject("Notification permission not granted");
                }
            })
            .then((registration: ServiceWorkerRegistration) => {
                Notify.registration = registration;
                Notify.permissionGranted = true;
                window.navigator.serviceWorker.addEventListener("message", Notify.onNotificationClosed);
            })
            .catch((reason) => {
                console.warn(reason);
            });
    }

    private static registration: ServiceWorkerRegistration;
    private static dismissListeners: { [tag: string]: () => void; } = {};
    private static onNotificationClosed(event) {
        const tag = event.data[0];
        if (tag in Notify.dismissListeners) {
            Notify.dismissListeners[tag]();
        }
    }

    constructor(
        private message: string,
        private options?: NotificationOptions,
        dismissCallback?: () => void
    ) {
        if (dismissCallback) {
            Notify.dismissListeners[this.options.tag] = dismissCallback;
        }
    }

    public show() {
        if (!Notify.permissionGranted) {
            console.warn("[notification] permission not granted");
        } else {
            Notify.registration.showNotification(this.message, this.options);
        }
    }
}

// hacky workaround to use service worker typings
import { } from ".";
declare var self: ServiceWorkerGlobalScope;

/*** notifcations ***/
self.addEventListener("push", (event) => {
    console.log("[SW] push", event);
    const notificationPromise = self.registration.showNotification(event.data.text());
    event.waitUntil(notificationPromise);
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
});

/*** caching ***/
const { assets } = global.serviceWorkerOption;
const CACHE_NAME = new Date().toISOString();
let assetsToCache = [...assets, "./"];
assetsToCache = assetsToCache.map((path) => new URL(path, global.location).toString());

self.addEventListener("install", (event) => {
    // become active immediately, even if old service-wroker exists
    self.skipWaiting();
    // cache assets
    event.waitUntil(
        global.caches
            .open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(assetsToCache);
            })
            .then(() => {
                console.log("[SW] installed", assetsToCache);
            })
            .catch((error) => {
                console.error(error);
                throw error;
            })
    );
});

self.addEventListener("activate", (event) => {
    // replace old service worker
    event.waitUntil(self.clients.claim());
    // clean old caches
    event.waitUntil(
        global.caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName.indexOf(CACHE_NAME) === 0) {
                        return null;
                    }
                    return global.caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener("fetch", (event) => {
    const request = event.request;
    const requestUrl = new URL(request.url);
    const resource = global.caches.match(request).then((response) => {
        // try cache
        if (response) {
            console.log("[SW] fetched from cache", requestUrl.href);
            return response;
        }

        // try network
        return fetch(request)
            .then((responseNetwork) => {
                if (!responseNetwork || !responseNetwork.ok) {
                    console.error("[SW] invalid response", responseNetwork);
                    return responseNetwork;
                }
                console.log("[SW] fetched from network", requestUrl.href);
                // cache response
                const responseCache = responseNetwork.clone();
                global.caches
                    .open(CACHE_NAME)
                    .then((cache) => {
                        return cache.put(request, responseCache);
                    });
                return responseNetwork;
            })
            .catch(() => {
                // user is landing on our page
                if (event.request.mode === "navigate") {
                    return global.caches.match("./");
                }
                return null;
            });
    });
    event.respondWith(resource);
});

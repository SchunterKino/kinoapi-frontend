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
    // become active immediately, even if old service-worker exists
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
                console.error("[SW] cache install error", error);
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
    const url = new URL(event.request.url);
    event.respondWith(
        fetch(event.request).then((response) => {
            // network first
            if (response && response.ok) {
                return response;
            } else {
                throw new Error("Invalid response");
            }
        }).then((response) => {
            // cache response
            console.log("[SW] fetched from network", url.href);
            return caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, response.clone());
                return response;
            });
        }).catch(() => {
            // fallback to cache
            console.log("[SW] fetched from cache", url.href);
            return caches.match(event.request);
        })
    );
});

// Minimal service worker so the portal can be installed as an app.
// It does not cache anything: the portal always loads fresh from the network.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});

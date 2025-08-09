const VERSION = "v1.0.1";
const CACHE = `guardei-${VERSION}`;
const BASE = self.registration.scope;

const ASSETS = ["index.html","style.css","script.js","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png"]
  .map(p => new URL(p, BASE).toString());

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request)));
});

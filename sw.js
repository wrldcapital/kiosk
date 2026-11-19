/* Home Court by WRLD — service worker: keeps the app installable and opens offline with the last version */
const CACHE = 'homecourt-v1';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './manifest.webmanifest', './icon-192.png', './icon-512.png']).catch(() => {}))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url); if (u.origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => { if (res.ok && (r.mode === 'navigate' || /\.(png|webmanifest)$/.test(u.pathname))) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r.mode === 'navigate' ? './' : r, cp)); } return res; })
    .catch(() => caches.match(r).then(m => m || caches.match('./'))));
});

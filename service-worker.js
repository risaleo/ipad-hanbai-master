const CACHE='ipad-hanbai-master-v1-1-2';
const ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./icon-180.png','./icon-512.png','./ipad-lineup.svg','./chips.svg','./accessories.svg','./capacity.svg'];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(event.request, {cache: 'no-store'});
        const cache = await caches.open(CACHE);
        cache.put('./index.html', fresh.clone());
        return fresh;
      } catch (_) {
        return (await caches.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    try {
      const fresh = await fetch(event.request, {cache: 'no-store'});
      const cache = await caches.open(CACHE);
      cache.put(event.request, fresh.clone());
      return fresh;
    } catch (_) {
      return (await caches.match(event.request)) || Response.error();
    }
  })());
});

const CACHE_NAME = 'jeongs-travel-log-v2.0.0';
const BASE_URL = new URL('./', self.location.href).pathname;
const OFFLINE_PAGE = `${BASE_URL}index.html`;
const APP_SHELL = [
  BASE_URL,
  OFFLINE_PAGE,
  `${BASE_URL}manifest.webmanifest`,
  `${BASE_URL}favicon.svg`,
  `${BASE_URL}pwa-icon.svg`,
  `${BASE_URL}pwa-192.png`,
  `${BASE_URL}pwa-512.png`,
  `${BASE_URL}apple-touch-icon.png`,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const requestUrl = new URL(request.url);

  if (request.method !== 'GET' || requestUrl.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(OFFLINE_PAGE, copy));
          return response;
        })
        .catch(() => caches.match(OFFLINE_PAGE)),
    );
    return;
  }

  if (requestUrl.pathname.startsWith(`${BASE_URL}data/`)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request)),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const fresh = fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
      return cached ?? fresh;
    }),
  );
});

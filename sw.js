const CACHE_NAME = 'mejia-foto-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/img/logo.png' // Añade aquí todos los assets críticos
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

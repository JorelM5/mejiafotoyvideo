const CACHE_NAME = 'mejia-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/img/logo.png',
  'https://i.imgur.com/DjRBE3g.png' // Favicon externo
];

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

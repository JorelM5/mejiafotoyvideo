const CACHE_NAME = 'mejia-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  // Solo incluye rutas que existan
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Error al cachear:', error);
        });
      })
  );
});

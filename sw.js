const CACHE_NAME = 'mejia-cache-v4'; // Incrementa la versión
const OFFLINE_URL = '/offline.html'; // Página de respaldo
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/img/logo.png',
  '/img/icon-192.png',
  '/img/icon-512.png',
  OFFLINE_URL
];

// Instalación: Cachea recursos críticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // Fuerza la activación
  );
});

// Activación: Elimina cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Limpia versiones anteriores
          }
        })
      );
    })
  );
});

// Fetch: Estrategia "Cache First" con fallback a red + offline
self.addEventListener('fetch', event => {
  // Ignora solicitudes no-GET o externas (como Imgur)
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // 1. Devuelve la respuesta en caché si existe
        if (cachedResponse) return cachedResponse;

        // 2. Intenta cargar desde la red
        return fetch(event.request)
          .then(networkResponse => {
            // Cachea la respuesta para futuras solicitudes
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));
            return networkResponse;
          })
          .catch(() => {
            // 3. Fallback offline para HTML o imagen genérica
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match(OFFLINE_URL);
            } else if (event.request.headers.get('accept').includes('image')) {
              return caches.match('/img/offline-placeholder.png');
            }
          });
      })
  );
});

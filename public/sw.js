const CACHE_NAME = '2data-brasil-v2';
const urlsToCache = [
  '/',
  '/favicon.png',
  '/manifest.json'
];

// Install event
self.addEventListener('install', function(event) {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache opened');
        return cache.addAll(urlsToCache).catch(err => {
          console.log('Cache addAll failed:', err);
          // Continue mesmo se alguns recursos falharem
          return Promise.resolve();
        });
      })
      .then(() => {
        console.log('Service Worker installed successfully');
        return self.skipWaiting();
      })
      .catch(err => {
        console.log('Service Worker install failed:', err);
      })
  );
});

// Fetch event
self.addEventListener('fetch', function(event) {
  // Apenas cache para navegação (GET requests)
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // Se falhar, retorna uma resposta padrão para navegação
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
      .catch(err => {
        console.log('Fetch error:', err);
        return fetch(event.request);
      })
  );
});

// Activate event
self.addEventListener('activate', function(event) {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Message event para controle do app
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
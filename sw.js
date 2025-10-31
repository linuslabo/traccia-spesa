// IMPORTANT: Increment this version number each time you deploy changes
// This ensures the cache is invalidated and users get the latest version
const CACHE_VERSION = '3';
const CACHE_NAME = `traccia-spesa-cache-v${CACHE_VERSION}`;

// Static assets to cache on install
const URLS_TO_CACHE = [
  '/',
  '/index.html'
];

// Install event - cache static assets and skip waiting
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker, cache version:', CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(err => {
        console.error('[SW] Failed to cache static assets:', err);
      })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      // Delete all old caches
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Claim all clients to use new service worker immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - Stale-While-Revalidate strategy for better updates
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension requests
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Skip external CDN requests (like React from aistudiocdn.com)
  if (new URL(event.request.url).origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        // Always fetch from network in parallel
        const fetchPromise = fetch(event.request).then(response => {
          // Only cache successful responses
          if (response && response.status === 200) {
            // Clone the response before caching
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(err => {
          console.error('[SW] Fetch failed:', err);
          // If fetch fails and we have cached version, return it
          return cachedResponse || new Response('Network error', { status: 503 });
        });

        // Return cached version immediately if available, otherwise wait for network
        return cachedResponse || fetchPromise;
      });
    })
  );
});

// Listen for messages from the client to force update
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

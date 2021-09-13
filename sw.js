
// Progressive Web Apps Training - Caching Files with Service Worker
// https://developers.google.com/web/ilt/pwa/lab-caching-files-with-service-worker



// Note: Service workers only work with https

  
const staticCacheName = 'svg-cache';

// Choose files to be added to the cache
const filesToCache = [
    '/',
    'index.html',
    'index2.html',
    'pages/404.html',
    'pages/offline.html'
  ];

// Add files to the cache
self.addEventListener('install', event => {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
        return cache.addAll(filesToCache);
    })
    );
})

// Fetch data from the cache
self.addEventListener('fetch', event => {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if (response) {
            console.log('Found ', event.request.url, ' in cache');
            return response;
            }
            console.log('Network request for ', event.request.url);
            return fetch(event.request)

            .then(response => {
                // Respond with custom 404 page
                if (response.status === 404) {
                    return caches.match('pages/404.html');
                }

                // Save new requests to the cache
                return caches.open(staticCacheName).then(cache => {
                cache.put(event.request.url, response.clone());
                return response;
                });
            });
        }).catch(error => {
            // Respond with custom offline page
            console.log('Error, ', error);
            return caches.match('pages/offline.html');
        })
    );
});

// Deletes outdated caches
self.addEventListener('activate', event => {
    console.log('Activating new service worker...');
  
    const cacheAllowlist = [staticCacheName];
  
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheAllowlist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
});

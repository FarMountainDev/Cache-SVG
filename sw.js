// https://developers.google.com/web/ilt/pwa/lab-caching-files-with-service-worker
// Note: caches.match() must be called from an http or https URL scheme or it will return a TypeError
//  Service workers only work with https

const filesToCache = [
    '/',
    'index.html',
    'index2.html'
  ];
  
const staticCacheName = 'static-svg-cache';
  
// Add files to the cache
self.addEventListener('install', event => {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
        return cache.addAll(filesToCache);
    })
    );
});

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

            // Save new requests to the cache
            .then(response => {
                // TODO 5 - Respond with custom 404 page
                return caches.open(staticCacheName).then(cache => {
                cache.put(event.request.url, response.clone());
                return response;
                });
            });
    
        }).catch(error => {
    
            // TODO 6 - Respond with custom offline page
    
        })
    );
});
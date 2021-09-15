

  
const staticCacheName = 'svg-cache';


// Choose files to be added to the cache
const filesToCache = [
    '/',
    'images/coffee.svg',
    'images/spider.svg',
    'images/pumpkin-grunge.svg',
    'images/pumpkin-pi.svg',
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

// Retrieve files from cache or fallback to network
self.addEventListener('fetch', function(event) {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
      caches.match(event.request).then(function(response) {
          // return response || fetch(event.request);
          if (response) {
              console.log("Found '" + event.request.url + " in the cache'");
              return response;
          }
          else {
              console.log("Network request for '" + event.request.url + "'");
              return fetch(event.request)

              .then(response => {
                var filename = event.request.url;
                var fileExtension = filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
                console.log('Requested File Extension: ' + fileExtension);

                if (fileExtension == "svg") {
                  // Save new requests to the cache
                  console.log("Adding " + event.request.url + " to the cache.");
                  return caches.open(staticCacheName).then(cache => {
                    cache.put(event.request.url, response.clone());
                    return response;
                  });
                }

                return response;
            });
          }
      })
    );
});

// Delete unused caches
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
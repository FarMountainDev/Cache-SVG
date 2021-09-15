

  
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
self.addEventListener('fetch', event => {
    console.log("Fetch event for '" + event.request.url + "'");
    event.respondWith(
      caches.match(event.request, {ignoreVary: true}) // Without 'ignoreVary: true' this did not work when hosted
      .then(response => {
          // return response || fetch(event.request);
          if (response) {
              console.log("Found '" + event.request.url + "' in the cache");
              return response;
          }
          
          console.log("Network request for '" + response + "' -- '" + event.request.url + "'");
          return fetch(event.request)

          .then(response => {
              // Check if the request is for an SVG
              var fileName = event.request.url;
              var fileExtension = fileName.substring(fileName.lastIndexOf('.')+1, fileName.length) || fileName;
              console.log('Requested File Extension: ' + fileExtension);

              // Save SVG requests to the cache
              if (fileExtension == "svg") {
                console.log("Adding " + event.request.url + " to the cache.");
                return caches.open(staticCacheName).then(cache => {
                  cache.put(event.request.url, response.clone());
                  return response;
                });
              }
              
              return response;
          });
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
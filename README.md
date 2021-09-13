# Cache-SVG
Caching SVGs with a service worker

***

#### "sw.js" - Simple Version: only returns request matches from the cache
```js

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

```

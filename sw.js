var staticCacheName = 'currency-converter';

var allCaches = [
staticCacheName
];

self.addEventListener('install', function(event) {
 event.waitUntil(
   caches.open(staticCacheName).then(function(cache) {
     return cache.addAll([
       './',
       'curr.css',
       'calc.js',
       'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css',
       'https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css',
       'https://fonts.googleapis.com/css?family=Montserrat|Playfair+Display'
     ]);
   })
 );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('currency-') && !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === './') {
      event.respondWith(caches.match('./'));
      return;
    }
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});


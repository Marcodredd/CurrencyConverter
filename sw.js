var staticCacheName = 'currency-converter';

const cacheFiles = [
  'curr.css',
  'index.html',
  'public/css/styles.min.css',
  'public/css/styles.min.css.map',
  'public/css/normalize.min.css',
  'public/js/app.min.js',
  'public/js/app.min.js.map',
];

self.addEventListener('install', function(event) {
 event.waitUntil(
   caches.open(staticCacheName).then(function(cache) {
     return cache.addAll(cacheFiles);
   }),
 );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== cacheName) {
          return caches.delete(key);
        }
      }),
    ),
  ),
 );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches
      .match(event.request)
      .then(response => response || fetch(event.request)),
  );
});
	


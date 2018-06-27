var staticCacheName = 'currency-converter';

self.addEventListener('install', function(event) {
 event.waitUntil(
   caches.open(staticCacheName).then(function(cache) {
     return cache.addAll([
       'index.html',
       'index.html?homescreen=1',
       '?homescreen=1',
       'curr.css',
       'curr.js',
       'calc.js'
     ]);
   })
 );
});

self.addEventListener('fetch', function(event) {

console.log(event.request.url);

});
var staticCacheName = 'currency-converter';

self.addEventListener('install', function(event) {
 event.waitUntil(
   caches.open(staticCacheName).then(function(cache) {
     return cache.addAll([
       'index.html',
       'curr.css',
   	   'calc.js',
       'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css',
       'https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css',
       'https://free.currencyconverterapi.com/api/v5/countries',
       'https://marcodredd.github.io/CurrencyConverter/'
     ]);
   })
 );
});

self.addEventListener('fetch', function(event) {
	event.respondWith(async function() {
		const cachedResponse = await caches.match(event.request);
		if (cachedResponse) return cachedResponse;
		return fetch(event.request);
	}());
});


var staticCacheName = 'currency-converter';

self.addEventListener('install', function(event) {
 event.waitUntil(
   caches.open(staticCacheName).then(function(cache) {
     return cache.addAll([
       'index.html',
       'curr.css',
   	   'calc.js',
       'public/css/styles.min.css',
       'public/css/normalize.min.css',
       'https://free.currencyconverterapi.com/api/v5/countries',
       'https://marcodredd.github.io/CurrencyConverter/',
       'https://fonts.googleapis.com/css?family=Montserrat|Playfair+Display'
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


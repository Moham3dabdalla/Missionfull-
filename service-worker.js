
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/pages/index.html',
        '/pages/names.html',
        '/pages/subha.html',
        '/assets/logo.png',
        '/assets/style.css',
        '/scripts/script.js',
        '/databases/quran_database.json',
        '/databases/namesdb.json'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

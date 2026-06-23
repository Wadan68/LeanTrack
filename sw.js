const CACHE_NAME = 'leantrack-v1';

self.addEventListener('install', event => {
event.waitUntil(
caches.open(CACHE_NAME)
.then(cache => cache.addAll([
'/',
'/index.html',
'/app.js',
'/supabase.js'
]))
);
});

self.addEventListener('fetch', event => {
event.respondWith(
caches.match(event.request)
.then(response =>
response || fetch(event.request)
)
);
});

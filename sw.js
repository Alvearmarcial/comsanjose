// ─── sw.js ───────────────────────────────────────────────────
// NO necesitás cambiar la versión manualmente.
// Cada vez que subas un index.html nuevo a GitHub, el SW detecta
// el cambio automáticamente y muestra el banner de actualización.

const CACHE = 'csj-cache';
const ASSETS = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  // Precachear assets y activar inmediatamente
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
});

self.addEventListener('activate', e => {
  // Eliminar caches viejos
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', e => {
  // API siempre va a la red
  if (e.request.url.includes('script.google.com')) return;
  // Resto: cache primero, red como fallback
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// Activar nueva versión cuando el index lo solicita
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

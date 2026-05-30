const CACHE = 'miginoua-v2';
const ASSETS = [
  './',
  './index.html',
  './admin.html',
  './print.html',
  './manifest.json',
  './admin-manifest.json',
  './css/style.css',
  './css/print.css',
  './css/admin.css',
  './js/data.js',
  './js/storage.js',
  './js/app.js',
  './js/flashcard.js',
  './js/dots.js',
  './js/recitation.js',
  './js/memorychip.js',
  './js/miginoukun.js',
  './js/admin.js',
  './icons/icon.jpg',
  './icons/admin-icon.jpg',
  'https://fonts.googleapis.com/css2?family=Kosugi+Maru&family=Zen+Maru+Gothic:wght@500;700&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      // 存在しないアセット（admin-icon等）があっても失敗しないよう個別に追加
      Promise.allSettled(ASSETS.map(url => c.add(url).catch(() => {})))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

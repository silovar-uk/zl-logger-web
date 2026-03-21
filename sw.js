/**
 * Zero-Latency Logger - Service Worker
 * オフライン動作をサポートし、静的アセットをキャッシュします。
 */

const CACHE_NAME = 'zl-logger-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html'
];

// インストール時にアセットをキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 古いキャッシュのクリーンアップ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// フェッチリクエストの処理（ネットワーク優先、失敗時にキャッシュ）
self.addEventListener('fetch', (event) => {
  // POST リクエスト（GAS 同期など）はキャッシュしない
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
const CACHE_NAME = "block-game-cache-v10";
const URLS_TO_CACHE = [
  "/onet/",
  "/onet/index.html",
  "/onet/manifest.json",
  "/onet/favicon.ico",
  "/onet/icons/icon-192.png",
  "/onet/icons/icon-512.png",
];

// Установка и кэширование базовых файлов
self.addEventListener("install", (event) => {
  self.skipWaiting(); // ⚡️ активируем сразу после установки
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Активация и очистка старых кэшей
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== "block-game-images")
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // ⚡️ новый SW управляет всеми вкладками
});

// Перехват запросов
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/img/")) {
    // 🔹 Кэшируем картинки из папки /img при первом обращении
    event.respondWith(
      caches.open("block-game-images").then((cache) =>
        fetch(event.request)
          .then((response) => {
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => caches.match(event.request)) // если офлайн, берем из кэша
      )
    );
  } else {
    // 🔹 Остальные запросы: сначала из кэша, иначе — из сети
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).catch(() => caches.match("/index.html"))
        );
      })
    );
  }
});











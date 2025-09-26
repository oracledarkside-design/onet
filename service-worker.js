const CACHE_NAME = "block-game-cache-v1";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
    "/img/1.png",
      "/img/2.png",
        "/img/3.png",
          "/img/4.png",
            "/img/5.png",
              "/img/6.png",
                "/img/7.png",
                  "/img/8.png",
                    "/img/9.png",
                      "/img/10.png",
                        "/img/11.png",
                          "/img/12.png",
                            "/img/13.png",
                              "/img/14.png",
                                "/img/15.png",
                                  "/img/16.png",
                                    "/img/17.png",
                                      "/img/18.png",
                                        "/img/19.png",
                                          "/img/20.png",
                                            "/img/21.png",
];

// Установка и кэширование базовых файлов
self.addEventListener("install", (event) => {
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

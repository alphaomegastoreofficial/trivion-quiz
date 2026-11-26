
const CACHE_NAME = "trivion-cache-v1";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./src/css/style.css",
  "./src/js/app.js",
  "./data/questions.json"
];

// Install: simpan file utama aplikasi.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_FILES);
    })
  );

  self.skipWaiting();
});

// Activate: hapus cache versi lama.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith("trivion-cache-") && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );

  self.clients.claim();
});

// Fetch: atur penggunaan cache dan jaringan.
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  // Data soal: utamakan jaringan, gunakan cache jika offline.
  if (url.pathname.endsWith("/data/questions.json")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseCopy = response.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseCopy);
            });
          }

          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);

          if (cachedResponse) {
            return cachedResponse;
          }

          return new Response("Question data is unavailable offline.", {
            status: 503,
            headers: { "Content-Type": "text/plain" }
          });
        })
    );

    return;
  }

  // Halaman dan aset aplikasi: utamakan cache.
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        if (response.ok) {
          const responseCopy = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseCopy);
          });
        }

        return response;
      });
    })
  );
});

const CACHE_NAME = "taekwondo-1dan-v9";
const CORE_ASSETS = ["/manifest.webmanifest", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("taekwondo-1dan-") && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request, { cache: "no-store" }).catch(
        () =>
          new Response("Sin conexion. Cierra y vuelve a abrir la app cuando tengas red.", {
            headers: { "content-type": "text/plain; charset=utf-8" },
            status: 503,
          }),
      ),
    );
    return;
  }

  if (url.pathname.startsWith("/techniques/") || url.pathname.startsWith("/assets/")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }

        return fetch(request).then((response) => {
          const contentType = response.headers.get("content-type") ?? "";
          const canCache =
            response.ok && (url.pathname.startsWith("/assets/") || contentType.startsWith("image/"));

          if (canCache) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }

          return response;
        });
      }),
    );
  }
});

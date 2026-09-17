// シンプルなオフライン対応: 同一オリジンのGETをキャッシュ(network-first, cache-fallback)
const CACHE = "physics-quest-v2";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith("physics-quest-") && k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  // Native video seeking uses 206 responses, which Cache.put cannot store.
  // Do not fill the web offline cache with the entire movie library either.
  if (e.request.headers.has("range") || url.pathname.endsWith(".mp4")) return;
  e.respondWith(
    fetch(e.request)
      .then(async (res) => {
        if (!res.ok) return (await caches.match(e.request)) || res;
        const copy = res.clone();
        e.waitUntil(caches.open(CACHE).then((c) => c.put(e.request, copy)));
        return res;
      })
      .catch(async () => {
        const hit = await caches.match(e.request);
        if (hit) return hit;
        // Never return HTML for a missing image or JavaScript file.
        if (e.request.mode === "navigate") {
          const page = await caches.match(new URL("./index.html", self.registration.scope).href);
          if (page) return page;
        }
        return Response.error();
      })
  );
});

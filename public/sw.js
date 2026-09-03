const CACHE_NAME = "offline-form-sync-v3";
const OFFLINE_URL = "/offline.html";
const APP_ROUTES = [
    "/",
    "/forms",
    "/drafts",
    "/sync-queue",
    "/media",
    "/conflicts",
    "/activity",
    "/settings",
    OFFLINE_URL,
];

const isSameOrigin = (url) => url.origin === self.location.origin;

const isNextAsset = (request, url) => (
    url.pathname.startsWith("/_next/") ||
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "font" ||
    request.destination === "image"
);

const isRscRequest = (request, url) => (
    request.headers.get("RSC") === "1" ||
    request.headers.get("Next-Router-State-Tree") !== null ||
    request.headers.get("Accept")?.includes("text/x-component") ||
    url.searchParams.has("_rsc")
);

// Next.js App Router client navigation uses RSC requests. The exact RSC URL
// can change between navigations, so we also keep one offline fallback per
// pathname. This is what allows <Link> navigation to keep working offline.
const rscFallbackRequest = (url) => {
    return new Request(`${self.location.origin}/__offline-rsc__${url.pathname}`);
};

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async (cache) => {
                await cache.add(OFFLINE_URL);

                // Warm the main application routes while online. This is
                // best-effort because some routes may depend on runtime data.
                await Promise.allSettled(
                    APP_ROUTES
                        .filter((url) => url !== OFFLINE_URL)
                        .map(async (url) => {
                            try {
                                const response = await fetch(url, {
                                    cache: "no-store",
                                    credentials: "same-origin",
                                });

                                if (response.ok) {
                                    await cache.put(url, response.clone());
                                }
                            } catch (_) {
                                // Runtime caching will handle this route when
                                // the user visits it successfully online.
                            }
                        })
                );
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const request = event.request;
    const url = new URL(request.url);

    if (request.method !== "GET" || !isSameOrigin(url)) return;

    // Server APIs must never be faked by the service worker. Offline writes
    // stay in IndexedDB and are sent to the API only after connectivity returns.
    if (url.pathname.startsWith("/api/")) return;

    const rsc = isRscRequest(request, url);

    if (rsc) {
        event.respondWith(
            caches.match(request).then(async (cached) => {
                if (cached) return cached;

                try {
                    const response = await fetch(request);

                    if (response.ok) {
                        const cache = await caches.open(CACHE_NAME);
                        await cache.put(request, response.clone());
                        await cache.put(rscFallbackRequest(url), response.clone());
                    }

                    return response;
                } catch (_) {
                    const cache = await caches.open(CACHE_NAME);
                    const fallback = await cache.match(rscFallbackRequest(url));
                    if (fallback) return fallback;
                    throw _;
                }
            })
        );
        return;
    }

    if (request.mode === "navigate") {
        event.respondWith(
            caches.match(request).then(async (cached) => {
                // Online-first keeps the deployed page fresh. If the network
                // is unavailable, the previously cached HTML is used.
                try {
                    const response = await fetch(request);

                    if (response.ok) {
                        const cache = await caches.open(CACHE_NAME);
                        await cache.put(request, response.clone());
                    }

                    return response;
                } catch (_) {
                    return cached || caches.match(url.pathname) || caches.match(OFFLINE_URL);
                }
            })
        );
        return;
    }

    // Static Next.js assets are cache-first because they are immutable for a
    // given build and are required by the cached application shell.
    if (isNextAsset(request, url)) {
        event.respondWith(
            caches.match(request).then(async (cached) => {
                if (cached) return cached;

                const response = await fetch(request);

                if (response.ok) {
                    const cache = await caches.open(CACHE_NAME);
                    await cache.put(request, response.clone());
                }

                return response;
            })
        );
        return;
    }

    // Cache same-origin GET resources that the app successfully loads. This
    // also helps offline page transitions that request supporting resources.
    event.respondWith(
        caches.match(request).then(async (cached) => {
            if (cached) return cached;

            try {
                const response = await fetch(request);

                if (response.ok) {
                    const cache = await caches.open(CACHE_NAME);
                    await cache.put(request, response.clone());
                }

                return response;
            } catch (error) {
                if (cached) return cached;
                throw error;
            }
        })
    );
});

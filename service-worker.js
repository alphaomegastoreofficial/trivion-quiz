"use strict";

/* =========================================
   TRIVION - SERVICE WORKER
   THE ULTIMATE QUIZ EXPERIENCE
   Developed by Alpha Omega Store
========================================= */

// CACHE VERSION
const CACHE_NAME = "trivion-cache-v3";

// APPLICATION FILES
const APP_FILES = [
    "./",
    "./index.html",
    "./manifest.json",
    "./src/css/style.css",
    "./src/js/app.js",
    "./data/questions.json",
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png"
];


/* =========================================
   INSTALL EVENT
========================================= */

self.addEventListener("install", (event) => {

    event.waitUntil(
        (async () => {

            const cache = await caches.open(CACHE_NAME);

            await cache.addAll(APP_FILES);

            await self.skipWaiting();

        })()
    );

});


/* =========================================
   ACTIVATE EVENT
========================================= */

self.addEventListener("activate", (event) => {

    event.waitUntil(
        (async () => {

            const cacheNames = await caches.keys();

            await Promise.all(
                cacheNames
                    .filter((name) =>
                        name.startsWith("trivion-cache-") &&
                        name !== CACHE_NAME
                    )
                    .map((name) => caches.delete(name))
            );

            await self.clients.claim();

        })()
    );

});


/* =========================================
   FETCH EVENT
========================================= */

self.addEventListener("fetch", (event) => {

    const request = event.request;

    // Only handle GET requests
    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    // Ignore external resources
    if (url.origin !== self.location.origin) {
        return;
    }


    /* =====================================
       NAVIGATION: NETWORK FIRST
    ===================================== */

    if (request.mode === "navigate") {

        event.respondWith(
            (async () => {

                try {

                    const response = await fetch(request);

                    if (response.ok) {

                        const cache = await caches.open(CACHE_NAME);

                        await cache.put(
                            request,
                            response.clone()
                        );

                    }

                    return response;

                } catch (error) {

                    const cachedPage = await caches.match(request);

                    if (cachedPage) {
                        return cachedPage;
                    }

                    const fallbackPage = await caches.match("./index.html");

                    if (fallbackPage) {
                        return fallbackPage;
                    }

                    return new Response(
                        "TRIVION is currently offline. Please reconnect to the internet.",
                        {
                            status: 503,
                            headers: {
                                "Content-Type": "text/plain; charset=utf-8"
                            }
                        }
                    );

                }

            })()
        );

        return;
    }


    /* =====================================
       QUESTION DATA: NETWORK FIRST
    ===================================== */

    if (url.pathname.endsWith("/data/questions.json")) {

        event.respondWith(
            (async () => {

                try {

                    const response = await fetch(request);

                    if (response.ok) {

                        const cache = await caches.open(CACHE_NAME);

                        await cache.put(
                            request,
                            response.clone()
                        );

                    }

                    return response;

                } catch (error) {

                    const cachedData = await caches.match(request);

                    if (cachedData) {
                        return cachedData;
                    }

                    return new Response(
                        JSON.stringify({
                            success: false,
                            message: "Question data is unavailable offline."
                        }),
                        {
                            status: 503,
                            headers: {
                                "Content-Type": "application/json; charset=utf-8"
                            }
                        }
                    );

                }

            })()
        );

        return;
    }


    /* =====================================
       STATIC FILES: CACHE FIRST
    ===================================== */

    event.respondWith(
        (async () => {

            const cachedResponse = await caches.match(request);

            if (cachedResponse) {
                return cachedResponse;
            }

            try {

                const response = await fetch(request);

                if (response.ok) {

                    const cache = await caches.open(CACHE_NAME);

                    await cache.put(
                        request,
                        response.clone()
                    );

                }

                return response;

            } catch (error) {

                return new Response(
                    "TRIVION resource is currently unavailable offline.",
                    {
                        status: 503,
                        headers: {
                            "Content-Type": "text/plain; charset=utf-8"
                        }
                    }
                );

            }

        })()
    );

});

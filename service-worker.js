const CACHE_NAME = "openpage-v1";

const FILES = [
  "./",
  "./index.html",
  "./login.html",
  "./dashboard.html",
  "./posts.html",
  "./create-post.html",
  "./edit-post.html",
  "./media.html",
  "./settings.html",
  "./analytics.html",

  "./style.css",

  "./supabase.js",
  "./auth.js",
  "./login.js",
  "./dashboard.js",
  "./post.js",
  "./create-post.js",
  "./edit-post.js",
  "./media.js",
  "./settings.js",
  "./analytics.js",

  "./manifest.json",

  "./assets/logo.png",
  "./assets/cover.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});
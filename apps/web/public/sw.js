const CACHE_NAME = "speak-coach-v1";
const OFFLINE_URLS = ["/", "/session", "/correct", "/vocabulary", "/manifest.json"];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(OFFLINE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("push", function (event) {
  let data = { title: "Speak Coach", body: "Time to practice speaking!" };
  try {
    if (event.data) data = event.data.json();
  } catch {
    // use defaults
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      if (list.length > 0) return list[0].focus();
      return clients.openWindow("/session");
    })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  if (event.request.url.includes("/api/")) return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request).catch(function () {
        return caches.match("/");
      });
    })
  );
});

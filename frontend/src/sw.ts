import { clientsClaim } from "workbox-core";
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

declare let self: ServiceWorkerGlobalScope;

// Mesmo comportamento do service worker que o vite-plugin-pwa gerava sozinho
// com registerType "autoUpdate": versão nova assume na hora, cache dos
// arquivos do build e fallback do SPA para index.html.
self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();
registerRoute(new NavigationRoute(createHandlerBoundToURL("index.html")));

// ── Notificações push ──

// Mesmo formato do PushPayload do backend (PushService)
interface PushPayload {
  title: string;
  body: string;
  url: string;
  tag?: string;
  icon?: string;
}

self.addEventListener("push", event => {
  let payload: PushPayload;
  try {
    payload = event.data?.json();
  } catch {
    return;
  }
  if (!payload?.title) return;

  event.waitUntil(
    (async () => {
      // App aberto na tela: o sino e o contador do chat já avisam, não
      // precisa de pop-up por cima.
      const windows = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      if (windows.some(client => client.visibilityState === "visible")) return;

      // `renotify` não está nos tipos do TypeScript, mas Chrome/Android
      // suportam: com a mesma tag, vibra de novo em vez de trocar calado.
      const options: NotificationOptions & { renotify?: boolean } = {
        body: payload.body,
        icon: payload.icon || "/icon-192.png",
        tag: payload.tag,
        renotify: Boolean(payload.tag),
        data: { url: payload.url },
      };
      await self.registration.showNotification(payload.title, options);
    })(),
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const url = new URL(
    event.notification.data?.url || "/feed",
    self.location.origin,
  ).href;

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      const client = windows[0];
      if (client) {
        await client.focus();
        try {
          await client.navigate(url);
          return;
        } catch {
          // navigate só funciona em janela controlada por este service
          // worker; senão abre uma nova
        }
      }
      await self.clients.openWindow(url);
    })(),
  );
});

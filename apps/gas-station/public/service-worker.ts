/// <reference lib="webworker" />

export {};

declare const self: ServiceWorkerGlobalScope;

interface ExtendedNotificationOptions extends NotificationOptions {
  renotify?: boolean;
}

const CACHE_NAME = 'gas-station-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-64x64.png',
  '/apple-touch-icon-180x180.png',
];

// ============================================================================
// 설치 & 활성화
// ============================================================================

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    Promise.all([
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter((key) => key !== CACHE_NAME)
              .map((key) => caches.delete(key))
          )
        ),
      self.clients.claim(),
    ])
  );
});

// ============================================================================
// 캐싱 전략
// ============================================================================

self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // ✅ API / GraphQL / WebSocket / 채팅 → 캐시 안함
  if (
    url.pathname.startsWith('/graphql') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/chat') ||
    url.pathname.startsWith('/push') ||
    request.method !== 'GET'
  ) {
    return;
  }

  // ✅ 정적 assets → 캐시 우선
  if (
    url.pathname.startsWith('/pwa-') ||
    url.pathname.startsWith('/apple-touch-icon') ||
    url.pathname.startsWith('/favicon') ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|ico|woff2|woff|ttf)$/)
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          })
      )
    );
    return;
  }

  // ✅ HTML → 네트워크 우선, 실패 시 캐시
  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() =>
        caches
          .match(request)
          .then(
            (cached) =>
              cached ??
              caches.match('/index.html').then((r) => r ?? Response.error())
          )
      )
  );
});

// ============================================================================
// FCM 백그라운드 푸시 알림 처리
// ============================================================================

self.addEventListener('push', (event: PushEvent) => {
  if (!event.data) return;

  let data: {
    title?: string;
    body?: string;
    icon?: string;
    badge?: string;
    type?: string;
    url?: string;
    chatRoomId?: number;
  };

  try {
    data = event.data.json();
  } catch {
    data = { title: '별표주유소 알림', body: event.data.text() };
  }

  const title = data.title ?? '별표주유소 알림';
  const options: ExtendedNotificationOptions = {
    body: data.body ?? '',
    icon: data.icon ?? '/pwa-192x192.png',
    badge: data.badge ?? '/pwa-64x64.png',
    tag: data.chatRoomId
      ? `chat-${data.chatRoomId}`
      : data.type ?? 'staroil-notification',
    renotify: true,
    data: {
      type: data.type,
      chatRoomId: data.chatRoomId,
      url: data.url ?? '/notifications',
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// ============================================================================
// 알림 클릭 처리
// ============================================================================

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  const notificationData = event.notification.data as {
    type?: string;
    chatRoomId?: number;
    url?: string;
  };

  // 채팅 알림이면 채팅 페이지로, 아니면 지정된 url 또는 알림 페이지로
  const targetUrl = notificationData.chatRoomId
    ? '/chat'
    : notificationData.url ?? '/notifications';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if ('focus' in client) {
            (client as WindowClient).focus();
            (client as WindowClient).navigate(targetUrl);
            return;
          }
        }
        return self.clients.openWindow(targetUrl);
      })
  );
});

// ============================================================================
// SW 업데이트 메시지 처리
// ============================================================================

self.addEventListener(
  'message',
  (event: ExtendableEvent & { data?: { type?: string } }) => {
    if (event.data?.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  }
);

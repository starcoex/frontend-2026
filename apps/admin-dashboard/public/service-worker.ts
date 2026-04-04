/// <reference lib="webworker" />

export {};

// ✅ tsconfig.sw.json lib: ["WebWorker"] 환경에서는
//    self 가 ServiceWorkerGlobalScope 로 자동 인식됩니다.
//    단, IDE 타입 힌트를 위해 아래 선언을 유지합니다.
declare const self: ServiceWorkerGlobalScope;

// ✅ renotify 포함 확장 타입
interface ExtendedNotificationOptions extends NotificationOptions {
  renotify?: boolean;
}

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
    deliveryId?: number;
    deliveryNumber?: string;
    type?: string;
    url?: string;
  };

  try {
    data = event.data.json();
  } catch {
    data = { title: '배송 알림', body: event.data.text() };
  }

  const title = data.title ?? '배송 알림';
  const options: ExtendedNotificationOptions = {
    body: data.body ?? '',
    icon: data.icon ?? '/icon-192.png',
    badge: data.badge ?? '/badge.png',
    tag: data.deliveryId
      ? `delivery-${data.deliveryId}`
      : 'delivery-notification',
    renotify: true,
    data: {
      deliveryId: data.deliveryId,
      deliveryNumber: data.deliveryNumber,
      type: data.type,
      url: data.url ?? '/admin/delivery',
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
    deliveryId?: number;
    url?: string;
  };

  const targetUrl = notificationData.deliveryId
    ? `/admin/delivery/${notificationData.deliveryId}`
    : notificationData.url ?? '/admin/delivery';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if (client.url.includes('/admin') && 'focus' in client) {
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
// 설치 & 활성화
// ============================================================================

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(self.clients.claim());
});

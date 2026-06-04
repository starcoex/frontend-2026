import { useState, useEffect, useCallback } from 'react';

type NotificationPermission = 'default' | 'granted' | 'denied';

interface UsePwaSettingsReturn {
  // 설치 상태
  isInstalled: boolean;
  // 오프라인 지원
  isServiceWorkerActive: boolean;
  // 푸시 알림 권한
  notificationPermission: NotificationPermission;
  isRequestingPermission: boolean;
  requestNotificationPermission: () => Promise<NotificationPermission>;
  // 캐시 초기화
  isClearingCache: boolean;
  clearCache: () => Promise<void>;
}

export function usePwaSettings(): UsePwaSettingsReturn {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isServiceWorkerActive, setIsServiceWorkerActive] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>('default');
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [isClearingCache, setIsClearingCache] = useState(false);

  useEffect(() => {
    // 설치 상태 확인
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Service Worker 활성 상태 확인
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        setIsServiceWorkerActive(!!reg?.active);
      });
    }

    // 푸시 알림 권한 상태 확인
    if ('Notification' in window) {
      setNotificationPermission(
        Notification.permission as NotificationPermission
      );
    }
  }, []);

  const requestNotificationPermission =
    useCallback(async (): Promise<NotificationPermission> => {
      if (!('Notification' in window)) return 'denied';

      setIsRequestingPermission(true);
      try {
        const result = await Notification.requestPermission();
        setNotificationPermission(result as NotificationPermission);
        return result as NotificationPermission;
      } finally {
        setIsRequestingPermission(false);
      }
    }, []);

  const clearCache = useCallback(async () => {
    setIsClearingCache(true);
    try {
      // 모든 캐시 삭제
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));

      // Service Worker 재등록
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        await reg?.update();
      }
    } finally {
      setIsClearingCache(false);
    }
  }, []);

  return {
    isInstalled,
    isServiceWorkerActive,
    notificationPermission,
    isRequestingPermission,
    requestNotificationPermission,
    isClearingCache,
    clearCache,
  };
}

import { useState, useEffect, useCallback } from 'react';

interface UsePwaUpdateReturn {
  needsUpdate: boolean;
  isUpdating: boolean;
  update: () => Promise<void>;
  dismiss: () => void;
}

export function usePwaUpdate(): UsePwaUpdateReturn {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleUpdate = (reg: ServiceWorkerRegistration) => {
      // 대기 중인 새 SW 가 있으면 업데이트 알림
      if (reg.waiting) {
        setRegistration(reg);
        setNeedsUpdate(true);
        return;
      }

      // 새 SW 설치 감지
      const handleStateChange = () => {
        if (reg.waiting) {
          setRegistration(reg);
          setNeedsUpdate(true);
        }
      };

      reg.addEventListener('updatefound', () => {
        reg.installing?.addEventListener('statechange', handleStateChange);
      });
    };

    // 이미 등록된 SW 확인
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg) handleUpdate(reg);
    });

    // 새로 등록되는 SW 감지
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!isUpdating) window.location.reload();
    });
  }, [isUpdating]);

  const update = useCallback(async () => {
    if (!registration?.waiting) return;

    setIsUpdating(true);

    // 새 SW 에게 skipWaiting 메시지 전송
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }, [registration]);

  const dismiss = useCallback(() => {
    setNeedsUpdate(false);
  }, []);

  return { needsUpdate, isUpdating, update, dismiss };
}

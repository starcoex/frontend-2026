import { useCallback, useEffect, useState } from 'react';
import {
  getCurrentPushSubscription,
  getNotificationPermission,
  isPushNotificationSupported,
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
} from '../utils';
import { getPushSubscriptionService } from '../services';

export type PushNotificationState =
  | 'unsupported'
  | 'default'
  | 'granted'
  | 'denied'
  | 'subscribed'
  | 'loading';

export interface UsePushNotificationOptions {
  /** 로그인한 유저 ID (구독 등록 시 서버에 전달) */
  userId: number;
  /** 디바이스 식별자 (선택) */
  deviceId?: string;
}

export interface UsePushNotificationReturn {
  state: PushNotificationState;
  subscription: PushSubscription | null;
  isLoading: boolean;
  subscribe: () => Promise<PushSubscription | null>;
  unsubscribe: () => Promise<boolean>;
}

export function usePushNotification(
  options: UsePushNotificationOptions
): UsePushNotificationReturn {
  const [state, setState] = useState<PushNotificationState>('loading');
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [vapidKey, setVapidKey] = useState<string | null>(null);

  // ── 초기화: VAPID 키 + 기존 구독 상태 확인 ───────────────────────────────

  useEffect(() => {
    if (!isPushNotificationSupported()) {
      setState('unsupported');
      return;
    }

    const permission: NotificationPermission = getNotificationPermission();
    if (permission === 'denied') {
      setState('denied');
      return;
    }

    (async () => {
      try {
        // 1. 백엔드에서 VAPID 공개키 조회 (GET /push/vapid-key)
        const pushService = getPushSubscriptionService();
        const key = await pushService.getVapidPublicKey();
        setVapidKey(key);

        // 2. 기존 구독 확인
        const sub = await getCurrentPushSubscription();
        if (sub) {
          setSubscription(sub);
          setState('subscribed');
        } else if (permission === 'granted') {
          setState('granted');
        } else {
          setState('default');
        }
      } catch (error) {
        console.error('[PushNotification] 초기화 실패:', error);
        setState('default');
      }
    })();
  }, []);

  // ── 구독 등록 ─────────────────────────────────────────────────────────────

  const subscribe = useCallback(async (): Promise<PushSubscription | null> => {
    if (!isPushNotificationSupported() || !vapidKey) return null;

    setIsLoading(true);
    try {
      // 1. 알림 권한 요청
      let permission: NotificationPermission = getNotificationPermission();
      if (permission === 'default') {
        permission = await requestNotificationPermission();
      }
      if (permission !== 'granted') {
        setState('denied');
        return null;
      }

      // 2. Service Worker Push 구독
      const sub = await subscribeToPush(vapidKey);

      // 3. POST /push/subscribe → 백엔드 DB 저장
      //    getKey()로 ArrayBuffer를 추출 후 Base64 인코딩
      const p256dhBuffer = sub.getKey('p256dh');
      const authBuffer = sub.getKey('auth');

      const pushService = getPushSubscriptionService();
      await pushService.subscribe({
        userId: options.userId,
        endpoint: sub.endpoint,
        p256dh: p256dhBuffer
          ? btoa(String.fromCharCode(...new Uint8Array(p256dhBuffer)))
          : '',
        auth: authBuffer
          ? btoa(String.fromCharCode(...new Uint8Array(authBuffer)))
          : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        deviceId: options.deviceId,
      });

      setSubscription(sub);
      setState('subscribed');
      return sub;
    } catch (error) {
      console.error('[PushNotification] 구독 실패:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [vapidKey, options.userId, options.deviceId]);

  // ── 구독 해제 ─────────────────────────────────────────────────────────────

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!subscription) return false;

    setIsLoading(true);
    try {
      // 1. DELETE /push/unsubscribe → 백엔드 DB 비활성화
      const pushService = getPushSubscriptionService();
      await pushService.unsubscribe(subscription.endpoint);

      // 2. Service Worker 구독 해제
      await unsubscribeFromPush();

      setSubscription(null);
      setState(
        getNotificationPermission() === 'granted' ? 'granted' : 'default'
      );
      return true;
    } catch (error) {
      console.error('[PushNotification] 구독 해제 실패:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [subscription]);

  return { state, subscription, isLoading, subscribe, unsubscribe };
}

import { useEffect, useCallback, useRef, useState } from 'react';
import { connectQueueSocket } from '../socket';
import { useQueueContext } from '../context';
import type { QueueStats } from '../types';

// ── 백엔드 queue-gateway.ts 이벤트 상수 ──────────────────────────────────────
export const QUEUE_SOCKET_EVENTS = {
  // 클 → 서
  SUBSCRIBE_STORE: 'subscribe:queue',
  UNSUBSCRIBE_STORE: 'unsubscribe:queue',
  // 서 → 클
  QUEUE_UPDATED: 'queue:updated',
  LOAD_BALANCE_ALERT: 'load-balance:alert',
} as const;

export type QueueSocketStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

export interface LoadBalanceAlertPayload {
  currentWaitMin: number;
  alternativeStoreId: number;
  alternativeWaitMin: number;
  discountAmount: number;
  timestamp: string;
}

interface UseQueueSocketOptions {
  /** 구독할 지점 ID 목록 */
  storeIds: number[];
  /** 수요 분산 제안 수신 콜백 */
  onLoadBalanceAlert?: (payload: LoadBalanceAlertPayload) => void;
  /** 비활성화 여부 */
  enabled?: boolean;
}

export const useQueueSocket = ({
  storeIds,
  onLoadBalanceAlert,
  enabled = true,
}: UseQueueSocketOptions) => {
  const [socketStatus, setSocketStatus] =
    useState<QueueSocketStatus>('disconnected');
  const { setIntegratedStats, integratedStats } = useQueueContext();

  // ✅ stale closure 방지 — 항상 최신 integratedStats 참조
  const integratedStatsRef = useRef(integratedStats);
  integratedStatsRef.current = integratedStats;

  // ✅ 콜백 ref — onLoadBalanceAlert이 매 렌더마다 새 참조여도 effect 재실행 없음
  const onLoadBalanceAlertRef = useRef(onLoadBalanceAlert);
  onLoadBalanceAlertRef.current = onLoadBalanceAlert;

  // storeIds 배열을 문자열로 직렬화해서 의존성 안정화
  const storeIdsKey = storeIds.join(',');

  useEffect(() => {
    if (!enabled || storeIds.length === 0) return;

    const socket = connectQueueSocket();
    setSocketStatus(socket.connected ? 'connected' : 'connecting');

    // ── 연결 이벤트 ──────────────────────────────────────────────────────────
    const onConnect = () => {
      setSocketStatus('connected');
      storeIds.forEach((storeId) => {
        socket.emit(QUEUE_SOCKET_EVENTS.SUBSCRIBE_STORE, { storeId });
      });
    };

    const onDisconnect = (reason: string) => {
      if (reason !== 'io client disconnect') {
        setSocketStatus('disconnected');
      }
    };

    const onConnectError = () => {
      setSocketStatus('error');
    };

    // ── 서버 → 클라이언트 이벤트 ─────────────────────────────────────────────
    // queue:updated: broadcastQueueUpdated(storeId, stats) 에서 발생
    // ✅ ref로 최신 integratedStats 참조 → stale closure 해소
    const onQueueUpdated = (stats: QueueStats) => {
      const current = integratedStatsRef.current;
      const exists = current.some((s) => s.storeId === stats.storeId);
      if (exists) {
        setIntegratedStats(
          current.map((s) =>
            s.storeId === stats.storeId ? { ...s, ...stats } : s
          )
        );
      } else {
        setIntegratedStats([...current, stats]);
      }
    };

    // load-balance:alert: broadcastLoadBalanceAlert(storeId, data) 에서 발생
    const onLoadBalanceAlertHandler = (payload: LoadBalanceAlertPayload) => {
      onLoadBalanceAlertRef.current?.(payload);
    };

    // 이미 connected면 수동으로 구독 등록
    if (socket.connected) {
      onConnect();
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on(QUEUE_SOCKET_EVENTS.QUEUE_UPDATED, onQueueUpdated);
    socket.on(
      QUEUE_SOCKET_EVENTS.LOAD_BALANCE_ALERT,
      onLoadBalanceAlertHandler
    );

    return () => {
      storeIds.forEach((storeId) => {
        socket.emit(QUEUE_SOCKET_EVENTS.UNSUBSCRIBE_STORE, { storeId });
      });
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off(QUEUE_SOCKET_EVENTS.QUEUE_UPDATED, onQueueUpdated);
      socket.off(
        QUEUE_SOCKET_EVENTS.LOAD_BALANCE_ALERT,
        onLoadBalanceAlertHandler
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, storeIdsKey]);

  // 수동 재구독
  const subscribeStore = useCallback((storeId: number) => {
    const socket = connectQueueSocket();
    socket.emit(QUEUE_SOCKET_EVENTS.SUBSCRIBE_STORE, { storeId });
  }, []);

  const unsubscribeStore = useCallback((storeId: number) => {
    const socket = connectQueueSocket();
    socket.emit(QUEUE_SOCKET_EVENTS.UNSUBSCRIBE_STORE, { storeId });
  }, []);

  return {
    socketStatus,
    isSocketConnected: socketStatus === 'connected',
    subscribeStore,
    unsubscribeStore,
  };
};

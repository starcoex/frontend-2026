import { useEffect, useRef, useState } from 'react';
import { connectQueueSocket } from '../socket';
import { useQueueContext } from '../context';
import type { QueueSession } from '../types';

// ── 백엔드 queue-gateway.ts 티켓 이벤트 상수 ─────────────────────────────────
export const QUEUE_TICKET_EVENTS = {
  // 클 → 서
  SUBSCRIBE_TICKET: 'subscribe:ticket',
  // 서 → 클
  TICKET_SUBSCRIBED: 'ticket:subscribed',
  TICKET_READY: 'ticket:ready',
  TICKET_STATUS: 'ticket:status',
} as const;

export interface TicketReadyPayload {
  ticketId: string;
  message: string; // "입고해 주세요!"
  timestamp: string;
}

export interface TicketStatusPayload {
  ticketId: string;
  status: string;
  session?: Partial<QueueSession>;
  timestamp: string;
}

interface UseQueueTicketSocketOptions {
  /** 구독할 티켓 ID (UUID) */
  ticketId: string | null;
  /** 입고 요청 수신 콜백 */
  onTicketReady?: (payload: TicketReadyPayload) => void;
  /** 티켓 상태 변경 콜백 */
  onTicketStatus?: (payload: TicketStatusPayload) => void;
  /** 비활성화 여부 */
  enabled?: boolean;
}

export const useQueueTicketSocket = ({
  ticketId,
  onTicketReady,
  onTicketStatus,
  enabled = true,
}: UseQueueTicketSocketOptions) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { setCurrentSession, currentSession } = useQueueContext();

  // ✅ 클로저 stale 방지 — 항상 최신 currentSession 참조
  const currentSessionRef = useRef<QueueSession | null>(currentSession);
  currentSessionRef.current = currentSession;

  useEffect(() => {
    if (!enabled || !ticketId) return;

    const socket = connectQueueSocket();

    const onTicketSubscribed = (data: { ticketId: string }) => {
      if (data.ticketId === ticketId) {
        setIsSubscribed(true);
        console.info('[QueueTicketSocket] 티켓 구독 완료:', ticketId);
      }
    };

    // broadcastTicketReady(ticketId) 수신
    const onTicketReadyHandler = (payload: TicketReadyPayload) => {
      if (payload.ticketId !== ticketId) return;
      console.info('[QueueTicketSocket] 입고 요청:', payload.message);
      onTicketReady?.(payload);
    };

    // broadcastTicketStatus(ticketId, data) 수신
    // ✅ ref로 현재 세션을 직접 읽어 병합 → 함수형 업데이트 불필요
    const onTicketStatusHandler = (payload: TicketStatusPayload) => {
      if (payload.ticketId !== ticketId) return;
      if (payload.session) {
        const prev = currentSessionRef.current;
        if (prev) {
          // 기존 세션에 서버 부분 업데이트 병합 후 직접 값으로 전달
          const merged: QueueSession = { ...prev, ...payload.session };
          setCurrentSession(merged);
        }
      }
      onTicketStatus?.(payload);
    };

    const subscribeTicket = () => {
      socket.emit(QUEUE_TICKET_EVENTS.SUBSCRIBE_TICKET, { ticketId });
    };

    if (socket.connected) {
      subscribeTicket();
    } else {
      socket.once('connect', subscribeTicket);
    }

    socket.on(QUEUE_TICKET_EVENTS.TICKET_SUBSCRIBED, onTicketSubscribed);
    socket.on(QUEUE_TICKET_EVENTS.TICKET_READY, onTicketReadyHandler);
    socket.on(QUEUE_TICKET_EVENTS.TICKET_STATUS, onTicketStatusHandler);

    return () => {
      setIsSubscribed(false);
      socket.off('connect', subscribeTicket);
      socket.off(QUEUE_TICKET_EVENTS.TICKET_SUBSCRIBED, onTicketSubscribed);
      socket.off(QUEUE_TICKET_EVENTS.TICKET_READY, onTicketReadyHandler);
      socket.off(QUEUE_TICKET_EVENTS.TICKET_STATUS, onTicketStatusHandler);
    };
  }, [ticketId, enabled]); // currentSession 의존성 제거 — ref로 처리

  return { isSubscribed };
};

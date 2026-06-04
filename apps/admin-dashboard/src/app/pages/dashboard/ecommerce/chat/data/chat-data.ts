import type { ChatRoomStatus } from '@starcoex-frontend/chats';

// 상태별 허용 전이 맵 (백엔드 정책 기반)
export const CHAT_STATUS_TRANSITION_MAP: Record<
  ChatRoomStatus,
  ChatRoomStatus[]
> = {
  ACTIVE: ['IN_PROGRESS', 'CLOSED', 'ARCHIVED'],
  WAITING: ['IN_PROGRESS', 'CLOSED'],
  IN_PROGRESS: ['RESOLVED', 'CLOSED'],
  RESOLVED: ['IN_PROGRESS', 'CLOSED', 'ARCHIVED'],
  CLOSED: ['ARCHIVED'],
  ARCHIVED: [],
};

export const CHAT_STATUS_LABEL: Record<ChatRoomStatus, string> = {
  ACTIVE: '활성',
  WAITING: '대기중',
  IN_PROGRESS: '진행중',
  RESOLVED: '해결됨',
  CLOSED: '종료됨',
  ARCHIVED: '보관됨',
};

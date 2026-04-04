import {
  NotificationType,
  NotificationStatus,
  NotificationChannel,
} from '@starcoex-frontend/notifications';

// ── 알림 타입 ────────────────────────────────────────────────────────────────

export const NOTIFICATION_TYPE_OPTIONS = [
  {
    value: NotificationType.GENERAL,
    label: '일반',
    desc: '일반적인 공지/안내',
  },
  { value: NotificationType.PAYMENT, label: '결제', desc: '결제 관련 알림' },
  {
    value: NotificationType.RESERVATION,
    label: '예약',
    desc: '예약 관련 알림',
  },
  { value: NotificationType.SECURITY, label: '보안', desc: '보안 경고' },
  { value: NotificationType.SYSTEM, label: '시스템', desc: '시스템 점검 등' },
  {
    value: NotificationType.MARKETING,
    label: '마케팅',
    desc: '이벤트/프로모션',
  },
  {
    value: NotificationType.REMINDER,
    label: '리마인더',
    desc: '예약/일정 리마인드',
  },
  { value: NotificationType.FUEL, label: '유류', desc: '유류 관련 알림' },
  { value: NotificationType.DELIVERY, label: '배달', desc: '배달 관련 알림' },
] as const;

export const NOTIFICATION_TYPE_LABEL: Record<NotificationType, string> = {
  [NotificationType.GENERAL]: '일반',
  [NotificationType.SECURITY]: '보안',
  [NotificationType.SYSTEM]: '시스템',
  [NotificationType.MARKETING]: '마케팅',
  [NotificationType.REMINDER]: '리마인더',
  [NotificationType.PAYMENT]: '결제',
  [NotificationType.RESERVATION]: '예약',
  [NotificationType.FUEL]: '유류',
  [NotificationType.DELIVERY]: '배달',
};

// ── 알림 상태 ────────────────────────────────────────────────────────────────

export const NOTIFICATION_STATUS_OPTIONS = [
  { value: NotificationStatus.UNREAD, label: '읽지 않음' },
  { value: NotificationStatus.READ, label: '읽음' },
  { value: NotificationStatus.PENDING, label: '대기' },
  { value: NotificationStatus.SENT, label: '발송됨' },
  { value: NotificationStatus.FAILED, label: '실패' },
] as const;

export const NOTIFICATION_STATUS_LABEL: Record<NotificationStatus, string> = {
  [NotificationStatus.UNREAD]: '읽지 않음',
  [NotificationStatus.READ]: '읽음',
  [NotificationStatus.ARCHIVED]: '보관됨',
  [NotificationStatus.DELETED]: '삭제됨',
  [NotificationStatus.PENDING]: '대기',
  [NotificationStatus.SCHEDULED]: '예약됨',
  [NotificationStatus.SENT]: '발송됨',
  [NotificationStatus.FAILED]: '실패',
};

// ── 알림 채널 ────────────────────────────────────────────────────────────────

export const NOTIFICATION_CHANNEL_OPTIONS = [
  { value: NotificationChannel.PUSH, label: '푸시 알림' },
  { value: NotificationChannel.EMAIL, label: '이메일' },
  { value: NotificationChannel.SMS, label: 'SMS' },
  { value: NotificationChannel.KAKAO, label: '카카오 알림톡' },
] as const;

export const NOTIFICATION_CHANNEL_LABEL: Record<NotificationChannel, string> = {
  [NotificationChannel.PUSH]: '푸시',
  [NotificationChannel.SMS]: 'SMS',
  [NotificationChannel.EMAIL]: '이메일',
  [NotificationChannel.KAKAO]: '카카오',
};

// ── 이메일 템플릿 ────────────────────────────────────────────────────────────

export const EMAIL_TEMPLATE_OPTIONS = [
  {
    value: 'payment-complete',
    label: '결제 완료',
    desc: '결제 처리 완료 안내',
  },
  { value: 'reservation-confirm', label: '예약 확인', desc: '예약 확정 안내' },
  { value: 'order-confirm', label: '주문 확인', desc: '주문 접수 안내' },
  { value: 'general-notice', label: '일반 공지', desc: '일반 안내 메시지' },
] as const;

export type EmailTemplateValue =
  (typeof EMAIL_TEMPLATE_OPTIONS)[number]['value'];

// ── 연결 데이터 종류 ─────────────────────────────────────────────────────────

export const NOTIFICATION_ENTITY_TYPE_OPTIONS = [
  {
    value: 'order' as const,
    label: '주문',
    adminPath: '/admin/orders/{id}',
    searchPlaceholder: '주문번호, 매장명, 이메일로 검색',
  },
  {
    value: 'payment' as const,
    label: '결제',
    adminPath: '/admin/payments/{id}',
    searchPlaceholder: '결제 ID 또는 portOneId로 검색',
  },
  {
    value: 'reservation' as const,
    label: '예약',
    adminPath: '/admin/reservations/{id}',
    searchPlaceholder: '예약번호, 고객명, 이메일로 검색',
  },
  {
    value: 'product' as const,
    label: '제품',
    adminPath: '/admin/products/{id}',
    searchPlaceholder: '제품명 또는 SKU로 검색',
  },
] as const;

export type NotificationEntityType =
  (typeof NOTIFICATION_ENTITY_TYPE_OPTIONS)[number]['value'];

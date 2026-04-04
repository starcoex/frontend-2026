import {
  NotificationType,
  NotificationStatus,
  NotificationChannel,
} from '@starcoex-frontend/notifications';

export { NotificationType, NotificationStatus, NotificationChannel };

export interface NotificationItem {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  channel: NotificationChannel;
  readAt?: string | null;
  relatedEntityType?: string | null;
  relatedEntityId?: number | null;
  actionUrl?: string | null;
  templateName?: string | null;
  templateData?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
  scheduledAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationTypeConfig {
  label: string;
  icon: string;
  color: string;
}

export const NOTIFICATION_TYPE_CONFIG: Record<
  NotificationType,
  NotificationTypeConfig
> = {
  [NotificationType.SECURITY]: {
    label: '보안',
    icon: '🔒',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  },
  [NotificationType.SYSTEM]: {
    label: '시스템',
    icon: '⚙️',
    color:
      'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  },
  [NotificationType.PAYMENT]: {
    label: '결제',
    icon: '💳',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  },
  [NotificationType.MARKETING]: {
    label: '마케팅',
    icon: '📣',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  },
  [NotificationType.REMINDER]: {
    label: '리마인더',
    icon: '⏰',
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  },
  [NotificationType.RESERVATION]: {
    label: '예약',
    icon: '📅',
    color:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  },
  [NotificationType.FUEL]: {
    label: '연료',
    icon: '⛽',
    color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  },
  [NotificationType.DELIVERY]: {
    label: '배달',
    icon: '🚚',
    color:
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  },
  [NotificationType.GENERAL]: {
    label: '일반',
    icon: '📢',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  },
};

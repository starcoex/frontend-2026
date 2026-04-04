import type { ApiResponse } from '../types';

// ============================================================================
// Enum 타입
// ============================================================================

export enum NotificationType {
  GENERAL = 'GENERAL',
  SECURITY = 'SECURITY',
  SYSTEM = 'SYSTEM',
  MARKETING = 'MARKETING',
  REMINDER = 'REMINDER',
  PAYMENT = 'PAYMENT',
  RESERVATION = 'RESERVATION',
  FUEL = 'FUEL',
  DELIVERY = 'DELIVERY',
}

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
  PENDING = 'PENDING',
  SCHEDULED = 'SCHEDULED',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

export enum NotificationChannel {
  SMS = 'SMS',
  PUSH = 'PUSH',
  EMAIL = 'EMAIL',
  KAKAO = 'KAKAO',
}

export enum EmailStatus {
  PENDING = 'PENDING',
  SENDING = 'SENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum EmailPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

// ============================================================================
// Federation stub 타입
// ============================================================================

export interface UserRef {
  id: number;
  unreadNotificationCount?: number | null;
  recentNotifications?: Notification[] | null;
}

// ============================================================================
// 공통 에러 타입
// ============================================================================

export interface ErrorInfo {
  code?: string | null;
  message: string;
  details?: string | null;
}

// ============================================================================
// 알림 엔티티 타입
// ============================================================================

export interface Notification {
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
  emailId?: number | null;
  retryCount: number;
  maxRetries: number;
  failReason?: string | null;
  metadata?: Record<string, unknown> | null;
  scheduledAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  notificationUser?: UserRef | null;
}

// ============================================================================
// 이메일 엔티티 타입
// ============================================================================

export interface Email {
  id: number;
  fromEmail: string;
  fromName: string;
  toEmail: string;
  toName?: string | null;
  subject: string;
  content: string;
  templateName?: string | null;
  templateData?: Record<string, unknown> | null;
  status: EmailStatus;
  priority: EmailPriority;
  scheduledAt?: string | null;
  sentAt?: string | null;
  failedAt?: string | null;
  provider?: string | null;
  externalMessageId?: string | null;
  errorMessage?: string | null;
  retryCount: number;
  source?: string | null;
  metadata?: Record<string, unknown> | null;
  userId?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// ============================================================================
// Output 타입
// ============================================================================

export interface CreateNotificationOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  notification?: Notification | null;
  deliveryMessage?: string | null;
  emailSent: boolean;
  message?: string | null;
}

export interface GetNotificationsOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  notifications: Notification[];
  totalCount: number;
  unreadCount: number;
  hasNextPage: boolean;
  currentPage?: number | null;
  message?: string | null;
}

export interface NotificationStatsOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  total: number;
  read: number;
  unread: number;
  archived: number;
  deleted: number;
  message: string;
}

export interface SendEmailOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  email?: Email | null;
  message: string;
  statusMessage?: string | null;
}

export interface GetEmailsOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  emails: Email[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  message: string;
}

// ============================================================================
// Input 타입
// ============================================================================

export interface GetNotificationsInput {
  userId: number;
  limit?: number;
  offset?: number;
  type?: NotificationType;
  status?: NotificationStatus;
  channel?: NotificationChannel;
  search?: string;
  unreadOnly?: boolean;
  activeOnly?: boolean;
}

/** 관리자 전용 전체 알림 조회 input */
export interface GetAllNotificationsInput {
  limit?: number;
  offset?: number;
  /** 특정 유저 필터 */
  userId?: number;
  status?: NotificationStatus;
  type?: NotificationType;
  relatedEntityType?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateNotificationInput {
  userId: number;
  title: string;
  message: string;
  type?: NotificationType;
  channel?: NotificationChannel;
  relatedEntityType?: string;
  relatedEntityId?: number;
  actionUrl?: string;
  templateName?: string;
  templateData?: Record<string, unknown>;
  scheduledAt?: string;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
  sendEmail?: boolean;
  emailTemplate?: string;
}

export interface MarkNotificationAsReadInput {
  id: number;
  userId: number;
}

export interface DeleteNotificationInput {
  id: number;
  userId: number;
}

export interface GetEmailsInput {
  page?: number;
  limit?: number;
  toEmailContains?: string;
  subjectContains?: string;
  templateName?: string;
  statuses?: EmailStatus[];
  priority?: EmailPriority;
  createdAfter?: string;
  createdBefore?: string;
  userId?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface SendEmailInput {
  userId?: number;
  toEmail: string;
  toName?: string;
  fromEmail?: string;
  fromName?: string;
  subject: string;
  content?: string;
  templateName?: string;
  templateData?: Record<string, unknown>;
  priority?: EmailPriority;
  scheduledAt?: string;
  metadata?: Record<string, unknown>;
  source?: string;
}

// ============================================================================
// 관리자 알림 전송 헬퍼 타입
// (주문 · 결제 · 예약 발생 시 관리자에게 알림)
// ============================================================================

/** 지원되는 관련 엔티티 종류 */
export type RelatedEntityType = 'order' | 'payment' | 'reservation' | 'product';

export interface AdminNotificationPayload {
  /** 관리자 userId */
  adminUserId: number;
  title: string;
  message: string;
  type: NotificationType;
  relatedEntityType: RelatedEntityType;
  relatedEntityId: number;
  actionUrl?: string;
  channel?: NotificationChannel;
}

// ============================================================================
// 서비스 인터페이스
// ============================================================================

export interface INotificationsService {
  // ── Notification Queries ──
  getMyNotifications(
    input: GetNotificationsInput
  ): Promise<ApiResponse<GetNotificationsOutput>>;
  getMyNotificationStats(): Promise<ApiResponse<NotificationStatsOutput>>;
  searchNotifications(
    query: string,
    limit?: number
  ): Promise<ApiResponse<GetNotificationsOutput>>;
  getAdminNotificationStats(): Promise<ApiResponse<NotificationStatsOutput>>;
  /** 관리자 전용: 전체 유저의 알림 목록 조회 */
  adminGetAllNotifications(
    input?: GetAllNotificationsInput
  ): Promise<ApiResponse<GetNotificationsOutput>>;
  getUnreadNotifications(
    limit?: number
  ): Promise<ApiResponse<GetNotificationsOutput>>;

  // ── Notification Mutations ──
  sendEmailNotification(
    input: CreateNotificationInput
  ): Promise<ApiResponse<CreateNotificationOutput>>;
  markNotificationAsRead(
    input: MarkNotificationAsReadInput
  ): Promise<ApiResponse<boolean>>;
  deleteNotification(
    input: DeleteNotificationInput
  ): Promise<ApiResponse<boolean>>;
  markAllAsRead(): Promise<ApiResponse<boolean>>;
  markAsRead(notificationId: number): Promise<ApiResponse<boolean>>;
  deleteById(notificationId: number): Promise<ApiResponse<boolean>>;

  // ── Email Queries ──
  getEmails(input: GetEmailsInput): Promise<ApiResponse<GetEmailsOutput>>;
  getEmailById(id: number): Promise<ApiResponse<Email>>;

  // ── Email Mutations ──
  sendEmail(input: SendEmailInput): Promise<ApiResponse<SendEmailOutput>>;
  retryEmail(emailId: number): Promise<ApiResponse<boolean>>;
}

// ============================================================================
// Context 상태 타입
// ============================================================================

export interface NotificationFilters {
  type?: NotificationType;
  status?: NotificationStatus;
  channel?: NotificationChannel;
  search?: string;
  unreadOnly?: boolean;
}

export interface NotificationsState {
  notifications: Notification[];
  currentNotification: Notification | null;
  unreadCount: number;
  totalCount: number;
  hasNextPage: boolean;
  currentPage: number;
  stats: NotificationStatsOutput | null;
  // Email
  emails: Email[];
  totalEmailCount: number;
  hasNextEmailPage: boolean;
  currentEmailPage: number;
  // 공통
  filters: NotificationFilters;
  isLoading: boolean;
  error: string | null;
}

export interface NotificationsContextActions {
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  updateNotificationInContext: (
    id: number,
    updates: Partial<Notification>
  ) => void;
  removeNotification: (id: number) => void;
  setCurrentNotification: (notification: Notification | null) => void;
  setUnreadCount: (count: number) => void;
  decrementUnreadCount: () => void;
  markAsReadInContext: (id: number) => void;
  markAllAsReadInContext: () => void;
  setStats: (stats: NotificationStatsOutput | null) => void;
  // Email
  setEmails: (emails: Email[]) => void;
  addEmail: (email: Email) => void;
  // 공통
  setFilters: (filters: Partial<NotificationFilters>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type NotificationsContextValue = NotificationsState &
  NotificationsContextActions;

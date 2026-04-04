import { useCallback, useRef } from 'react';
import type { ApiResponse, GetAllNotificationsInput } from '../types';
import { useNotificationsContext } from '../context';
import { getNotificationsService } from '../services';
import type {
  CreateNotificationInput,
  GetNotificationsInput,
  GetEmailsInput,
  SendEmailInput,
  NotificationType,
  NotificationChannel,
  AdminNotificationPayload,
  RelatedEntityType,
} from '../types';
import { NotificationType as NT, NotificationChannel as NC } from '../types';

export const useNotifications = () => {
  const context = useNotificationsContext();

  const {
    setNotifications,
    removeNotification,
    setUnreadCount,
    markAsReadInContext,
    markAllAsReadInContext,
    setStats,
    setEmails,
    addEmail,
    setLoading,
    setError,
    clearError,
    isLoading: contextIsLoading,
    notifications,
    unreadCount,
    stats,
    emails,
    filters,
  } = context;

  const isLoadingRef = useRef(contextIsLoading);
  isLoadingRef.current = contextIsLoading;

  // ============================================================================
  // 공통 로딩 래퍼
  // ============================================================================

  const withLoading = useCallback(
    async <T>(
      operation: () => Promise<ApiResponse<T>>,
      defaultErrorMessage: string
    ): Promise<ApiResponse<T>> => {
      try {
        if (!isLoadingRef.current) setLoading(true);
        clearError();
        const res = await operation();
        if (!res.success) {
          setError(res.error?.message ?? defaultErrorMessage);
        }
        return res;
      } catch (e) {
        console.error(e);
        setError(defaultErrorMessage);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setError]
  );

  // ============================================================================
  // Notification Queries
  // ============================================================================

  const fetchMyNotifications = useCallback(
    async (input: GetNotificationsInput) =>
      withLoading(async () => {
        const service = getNotificationsService();
        const res = await service.getMyNotifications(input);
        if (res.success && res.data) {
          setNotifications(res.data.notifications);
          setUnreadCount(res.data.unreadCount);
        }
        return res;
      }, '알림 목록을 불러오는데 실패했습니다.'),
    [withLoading, setNotifications, setUnreadCount]
  );

  const fetchMyNotificationStats = useCallback(
    async () =>
      withLoading(async () => {
        const service = getNotificationsService();
        const res = await service.getMyNotificationStats();
        if (res.success && res.data) setStats(res.data);
        return res;
      }, '알림 통계를 불러오는데 실패했습니다.'),
    [withLoading, setStats]
  );

  const searchNotifications = useCallback(
    async (query: string, limit = 20) =>
      withLoading(async () => {
        const service = getNotificationsService();
        const res = await service.searchNotifications(query, limit);
        if (res.success && res.data) {
          setNotifications(res.data.notifications);
        }
        return res;
      }, '알림 검색에 실패했습니다.'),
    [withLoading, setNotifications]
  );

  /** 관리자 전용: 전체 알림 통계 조회 */
  const fetchAdminNotificationStats = useCallback(
    async () =>
      withLoading(async () => {
        const service = getNotificationsService();
        const res = await service.getAdminNotificationStats();
        if (res.success && res.data) setStats(res.data);
        return res;
      }, '관리자 알림 통계를 불러오는데 실패했습니다.'),
    [withLoading, setStats]
  );

  /** 관리자 전용: 전체 유저 알림 목록 조회 */
  const fetchAdminAllNotifications = useCallback(
    async (input?: GetAllNotificationsInput) =>
      withLoading(async () => {
        const service = getNotificationsService();
        const res = await service.adminGetAllNotifications(input);
        if (res.success && res.data) {
          setNotifications(res.data.notifications);
          setUnreadCount(res.data.unreadCount);
        }
        return res;
      }, '전체 알림 목록을 불러오는데 실패했습니다.'),
    [withLoading, setNotifications, setUnreadCount]
  );

  const fetchUnreadNotifications = useCallback(
    async (limit = 20) =>
      withLoading(async () => {
        const service = getNotificationsService();
        const res = await service.getUnreadNotifications(limit);
        if (res.success && res.data) {
          setNotifications(res.data.notifications);
          setUnreadCount(res.data.unreadCount);
        }
        return res;
      }, '읽지 않은 알림을 불러오는데 실패했습니다.'),
    [withLoading, setNotifications, setUnreadCount]
  );

  // ============================================================================
  // Notification Mutations
  // ============================================================================

  /** 알림 전송 (유저 또는 관리자 모두 사용) */
  const sendNotification = useCallback(
    async (input: CreateNotificationInput) =>
      withLoading(async () => {
        const service = getNotificationsService();
        const res = await service.sendEmailNotification(input);
        // ❌ addNotification 제거
        // 목록 페이지에서 fetchAdminAllNotifications로 최신 데이터를 다시 가져옴
        return res;
      }, '알림 전송에 실패했습니다.'),
    [withLoading]
  );

  /**
   * 관리자에게 알림 전송
   * - 주문(order) / 결제(payment) / 예약(reservation) 생성 시 자동 호출
   */
  const notifyAdmin = useCallback(
    async (payload: AdminNotificationPayload) => {
      const input: CreateNotificationInput = {
        userId: payload.adminUserId,
        title: payload.title,
        message: payload.message,
        type: payload.type,
        channel: payload.channel ?? NC.PUSH,
        relatedEntityType: payload.relatedEntityType,
        relatedEntityId: payload.relatedEntityId,
        actionUrl: payload.actionUrl,
      };
      return sendNotification(input);
    },
    [sendNotification]
  );

  /**
   * 주문 생성 시 관리자 알림 헬퍼
   * @param adminUserId - 알림을 받을 관리자 ID
   * @param orderId - 생성된 주문 ID
   * @param orderInfo - 주문 요약 정보 (예: 주문번호, 고객명)
   */
  const notifyAdminOnOrderCreated = useCallback(
    async (adminUserId: number, orderId: number, orderInfo: string) =>
      notifyAdmin({
        adminUserId,
        title: '새 주문이 접수되었습니다',
        message: `새로운 주문이 접수되었습니다. ${orderInfo}`,
        type: NT.GENERAL,
        relatedEntityType: 'order' as RelatedEntityType,
        relatedEntityId: orderId,
        actionUrl: `/admin/orders/${orderId}`,
      }),
    [notifyAdmin]
  );

  /**
   * 결제 완료 시 관리자 알림 헬퍼
   * @param adminUserId - 알림을 받을 관리자 ID
   * @param paymentId - 결제 ID
   * @param paymentInfo - 결제 요약 정보 (예: 금액, 결제수단)
   */
  const notifyAdminOnPaymentCreated = useCallback(
    async (adminUserId: number, paymentId: number, paymentInfo: string) =>
      notifyAdmin({
        adminUserId,
        title: '새 결제가 완료되었습니다',
        message: `결제가 완료되었습니다. ${paymentInfo}`,
        type: NT.PAYMENT,
        relatedEntityType: 'payment' as RelatedEntityType,
        relatedEntityId: paymentId,
        actionUrl: `/admin/payments/${paymentId}`,
      }),
    [notifyAdmin]
  );

  /**
   * 예약 생성 시 관리자 알림 헬퍼
   * @param adminUserId - 알림을 받을 관리자 ID
   * @param reservationId - 예약 ID
   * @param reservationInfo - 예약 요약 정보
   */
  const notifyAdminOnReservationCreated = useCallback(
    async (
      adminUserId: number,
      reservationId: number,
      reservationInfo: string
    ) =>
      notifyAdmin({
        adminUserId,
        title: '새 예약이 등록되었습니다',
        message: `새로운 예약이 등록되었습니다. ${reservationInfo}`,
        type: NT.RESERVATION,
        relatedEntityType: 'reservation' as RelatedEntityType,
        relatedEntityId: reservationId,
        actionUrl: `/admin/reservations/${reservationId}`,
      }),
    [notifyAdmin]
  );

  /**
   * 유저에게 알림 전송 헬퍼
   * @param userId - 알림을 받을 유저 ID
   * @param title - 알림 제목
   * @param message - 알림 내용
   * @param type - 알림 타입
   * @param relatedEntityType - 관련 엔티티 타입
   * @param relatedEntityId - 관련 엔티티 ID
   */
  const notifyUser = useCallback(
    async (
      userId: number,
      title: string,
      message: string,
      type: NotificationType,
      relatedEntityType?: RelatedEntityType,
      relatedEntityId?: number,
      actionUrl?: string,
      channel?: NotificationChannel
    ) => {
      const input: CreateNotificationInput = {
        userId,
        title,
        message,
        type,
        channel: channel ?? NC.PUSH,
        relatedEntityType,
        relatedEntityId,
        actionUrl,
      };
      return sendNotification(input);
    },
    [sendNotification]
  );

  const markAsRead = useCallback(
    async (notificationId: number) =>
      withLoading(async () => {
        const service = getNotificationsService();
        const res = await service.markAsRead(notificationId);
        if (res.success) {
          markAsReadInContext(notificationId);
        }
        return res;
      }, '알림 읽음 처리에 실패했습니다.'),
    [withLoading, markAsReadInContext]
  );

  const markAllAsRead = useCallback(
    async () =>
      withLoading(async () => {
        const service = getNotificationsService();
        const res = await service.markAllAsRead();
        if (res.success) {
          markAllAsReadInContext();
        }
        return res;
      }, '전체 읽음 처리에 실패했습니다.'),
    [withLoading, markAllAsReadInContext]
  );

  const deleteNotification = useCallback(
    async (notificationId: number) =>
      withLoading(async () => {
        const service = getNotificationsService();
        const res = await service.deleteById(notificationId);
        if (res.success) {
          removeNotification(notificationId);
        }
        return res;
      }, '알림 삭제에 실패했습니다.'),
    [withLoading, removeNotification]
  );

  // ============================================================================
  // Email Queries
  // ============================================================================

  const fetchEmails = useCallback(
    async (input: GetEmailsInput) =>
      withLoading(async () => {
        const service = getNotificationsService();
        const res = await service.getEmails(input);
        if (res.success && res.data) {
          setEmails(res.data.emails);
        }
        return res;
      }, '이메일 목록을 불러오는데 실패했습니다.'),
    [withLoading, setEmails]
  );

  const fetchEmailById = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getNotificationsService();
        return service.getEmailById(id);
      }, '이메일 정보를 불러오는데 실패했습니다.'),
    [withLoading]
  );

  // ============================================================================
  // Email Mutations
  // ============================================================================

  const sendEmail = useCallback(
    async (input: SendEmailInput) =>
      withLoading(async () => {
        const service = getNotificationsService();
        const res = await service.sendEmail(input);
        if (res.success && res.data?.email) {
          addEmail(res.data.email);
        }
        return res;
      }, '이메일 전송에 실패했습니다.'),
    [withLoading, addEmail]
  );

  const retryEmail = useCallback(
    async (emailId: number) =>
      withLoading(async () => {
        const service = getNotificationsService();
        return service.retryEmail(emailId);
      }, '이메일 재전송에 실패했습니다.'),
    [withLoading]
  );

  // ============================================================================
  // 클라이언트 사이드 필터링
  // ============================================================================

  const filteredNotifications = useCallback(() => {
    let result = [...notifications];
    if (filters.type) {
      result = result.filter((n) => n.type === filters.type);
    }
    if (filters.status) {
      result = result.filter((n) => n.status === filters.status);
    }
    if (filters.channel) {
      result = result.filter((n) => n.channel === filters.channel);
    }
    if (filters.unreadOnly) {
      result = result.filter((n) => n.status === 'UNREAD');
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.message.toLowerCase().includes(q)
      );
    }
    return result;
  }, [notifications, filters]);

  return {
    ...context,
    // Notification Queries
    fetchMyNotifications,
    fetchMyNotificationStats,
    searchNotifications,
    fetchAdminNotificationStats,
    fetchAdminAllNotifications, // ← 신규
    fetchUnreadNotifications,
    filteredNotifications,
    // Notification Mutations
    sendNotification,
    notifyAdmin,
    notifyAdminOnOrderCreated,
    notifyAdminOnPaymentCreated,
    notifyAdminOnReservationCreated,
    notifyUser,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    // Email Queries
    fetchEmails,
    fetchEmailById,
    // Email Mutations
    sendEmail,
    retryEmail,
    // 상태값
    notifications,
    unreadCount,
    stats,
    emails,
    filters,
  };
};

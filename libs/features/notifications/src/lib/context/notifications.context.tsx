import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useApolloClient } from '@apollo/client/react';
import {
  NotificationsState,
  NotificationsContextValue,
  NotificationFilters,
  Notification,
  NotificationStatsOutput,
  Email,
  NotificationStatus,
} from '../types';
import { serviceRegistry, initNotificationsService } from '../services';

const NotificationsContext = createContext<
  NotificationsContextValue | undefined
>(undefined);

const initialState: NotificationsState = {
  notifications: [],
  currentNotification: null,
  unreadCount: 0,
  totalCount: 0,
  hasNextPage: false,
  currentPage: 1,
  stats: null,
  emails: [],
  totalEmailCount: 0,
  hasNextEmailPage: false,
  currentEmailPage: 1,
  filters: {},
  isLoading: false,
  error: null,
};

export const NotificationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, setState] = useState<NotificationsState>(initialState);
  const apolloClient = useApolloClient();
  const [serviceInitialized, setServiceInitialized] = useState(false);

  useEffect(() => {
    if (!serviceRegistry.isServiceInitialized('notifications')) {
      try {
        initNotificationsService(apolloClient);
        setServiceInitialized(true);
      } catch (error) {
        console.error('❌ NotificationsService initialization failed:', error);
      }
    } else {
      setServiceInitialized(true);
    }
  }, [apolloClient]);

  // ── Notification 액션 ────────────────────────────────────────────────────────

  const setNotifications = useCallback((notifications: Notification[]) => {
    setState((prev) => ({ ...prev, notifications }));
  }, []);

  const addNotification = useCallback((notification: Notification) => {
    setState((prev) => ({
      ...prev,
      notifications: [notification, ...prev.notifications],
      totalCount: prev.totalCount + 1,
      unreadCount:
        notification.status === 'UNREAD'
          ? prev.unreadCount + 1
          : prev.unreadCount,
    }));
  }, []);

  const updateNotificationInContext = useCallback(
    (id: number, updates: Partial<Notification>) => {
      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) =>
          n.id === id ? { ...n, ...updates } : n
        ),
        currentNotification:
          prev.currentNotification?.id === id
            ? { ...prev.currentNotification, ...updates }
            : prev.currentNotification,
      }));
    },
    []
  );

  const removeNotification = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.filter((n) => n.id !== id),
      totalCount: Math.max(0, prev.totalCount - 1),
    }));
  }, []);

  const setCurrentNotification = useCallback(
    (notification: Notification | null) => {
      setState((prev) => ({ ...prev, currentNotification: notification }));
    },
    []
  );

  const setUnreadCount = useCallback((count: number) => {
    setState((prev) => ({ ...prev, unreadCount: count }));
  }, []);

  const decrementUnreadCount = useCallback(() => {
    setState((prev) => ({
      ...prev,
      unreadCount: Math.max(0, prev.unreadCount - 1),
    }));
  }, []);

  /** 단일 알림을 읽음 처리하고 unreadCount 감소 */
  const markAsReadInContext = useCallback((id: number) => {
    setState((prev) => {
      const target = prev.notifications.find((n) => n.id === id);
      const wasUnread = target?.status === NotificationStatus.UNREAD;
      return {
        ...prev,
        notifications: prev.notifications.map((n) =>
          n.id === id
            ? {
                ...n,
                status: NotificationStatus.READ,
                readAt: new Date().toISOString(),
              }
            : n
        ),
        unreadCount: wasUnread
          ? Math.max(0, prev.unreadCount - 1)
          : prev.unreadCount,
      };
    });
  }, []);

  /** 전체 알림 읽음 처리 */
  const markAllAsReadInContext = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({
        ...n,
        status: NotificationStatus.READ,
        readAt: n.readAt ?? new Date().toISOString(),
      })),
      unreadCount: 0,
    }));
  }, []);

  const setStats = useCallback((stats: NotificationStatsOutput | null) => {
    setState((prev) => ({ ...prev, stats }));
  }, []);

  // ── Email 액션 ───────────────────────────────────────────────────────────────

  const setEmails = useCallback((emails: Email[]) => {
    setState((prev) => ({ ...prev, emails }));
  }, []);

  const addEmail = useCallback((email: Email) => {
    setState((prev) => ({
      ...prev,
      emails: [email, ...prev.emails],
      totalEmailCount: prev.totalEmailCount + 1,
    }));
  }, []);

  // ── 필터/공통 액션 ──────────────────────────────────────────────────────────

  const setFilters = useCallback((filters: Partial<NotificationFilters>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setState((prev) => ({ ...prev, filters: {} }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error, isLoading: false }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const value = useMemo<NotificationsContextValue>(
    () => ({
      ...state,
      setNotifications,
      addNotification,
      updateNotificationInContext,
      removeNotification,
      setCurrentNotification,
      setUnreadCount,
      decrementUnreadCount,
      markAsReadInContext,
      markAllAsReadInContext,
      setStats,
      setEmails,
      addEmail,
      setFilters,
      clearFilters,
      setLoading,
      setError,
      clearError,
      reset,
    }),
    [
      state,
      setNotifications,
      addNotification,
      updateNotificationInContext,
      removeNotification,
      setCurrentNotification,
      setUnreadCount,
      decrementUnreadCount,
      markAsReadInContext,
      markAllAsReadInContext,
      setStats,
      setEmails,
      addEmail,
      setFilters,
      clearFilters,
      setLoading,
      setError,
      clearError,
      reset,
    ]
  );

  if (!serviceInitialized) {
    return (
      <div aria-busy="true" aria-label="Notifications 서비스 초기화 중">
        Initializing Notifications Service...
      </div>
    );
  }

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = (): NotificationsContextValue => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error(
      'useNotificationsContext must be used within a NotificationsProvider'
    );
  }
  return ctx;
};

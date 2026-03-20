import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useApolloClient } from '@apollo/client/react';
import type {
  NoticesState,
  NoticesContextValue,
  NoticeFilters,
  ManualFilters,
  Notice,
  Manual,
  ManualCategory,
} from '../types';
import { serviceRegistry, initNoticesService } from '../services';

const NoticesContext = createContext<NoticesContextValue | undefined>(
  undefined
);

const initialState: NoticesState = {
  notices: [],
  currentNotice: null,
  noticeFilters: {},
  manuals: [],
  currentManual: null,
  manualCategories: [],
  manualFilters: {},
  isLoading: false,
  error: null,
};

export const NoticesProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<NoticesState>(initialState);
  const apolloClient = useApolloClient();
  const [serviceInitialized, setServiceInitialized] = useState(false);

  useMemo(() => {
    if (!serviceRegistry.isServiceInitialized('notices')) {
      try {
        initNoticesService(apolloClient);
        setServiceInitialized(true);
      } catch (error) {
        console.error('❌ NoticesService initialization failed:', error);
      }
    } else {
      setServiceInitialized(true);
    }
  }, [apolloClient]);

  // ── Notice Actions ───────────────────────────────────────────────────────────

  const setNotices = useCallback((notices: Notice[]) => {
    setState((prev) => ({ ...prev, notices }));
  }, []);

  const addNotice = useCallback((notice: Notice) => {
    setState((prev) => ({ ...prev, notices: [notice, ...prev.notices] }));
  }, []);

  const updateNoticeInContext = useCallback(
    (id: number, updates: Partial<Notice>) => {
      setState((prev) => ({
        ...prev,
        notices: prev.notices.map((n) =>
          n.id === id ? { ...n, ...updates } : n
        ),
        currentNotice:
          prev.currentNotice?.id === id
            ? { ...prev.currentNotice, ...updates }
            : prev.currentNotice,
      }));
    },
    []
  );

  const removeNotice = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      notices: prev.notices.filter((n) => n.id !== id),
    }));
  }, []);

  const setCurrentNotice = useCallback((notice: Notice | null) => {
    setState((prev) => ({ ...prev, currentNotice: notice }));
  }, []);

  const setNoticeFilters = useCallback((filters: Partial<NoticeFilters>) => {
    setState((prev) => ({
      ...prev,
      noticeFilters: { ...prev.noticeFilters, ...filters },
    }));
  }, []);

  // ── Manual Actions ───────────────────────────────────────────────────────────

  const setManuals = useCallback((manuals: Manual[]) => {
    setState((prev) => ({ ...prev, manuals }));
  }, []);

  const addManual = useCallback((manual: Manual) => {
    setState((prev) => ({ ...prev, manuals: [manual, ...prev.manuals] }));
  }, []);

  const updateManualInContext = useCallback(
    (id: number, updates: Partial<Manual>) => {
      setState((prev) => ({
        ...prev,
        manuals: prev.manuals.map((m) =>
          m.id === id ? { ...m, ...updates } : m
        ),
        currentManual:
          prev.currentManual?.id === id
            ? { ...prev.currentManual, ...updates }
            : prev.currentManual,
      }));
    },
    []
  );

  const removeManual = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      manuals: prev.manuals.filter((m) => m.id !== id),
    }));
  }, []);

  const setCurrentManual = useCallback((manual: Manual | null) => {
    setState((prev) => ({ ...prev, currentManual: manual }));
  }, []);

  const setManualCategories = useCallback((categories: ManualCategory[]) => {
    setState((prev) => ({ ...prev, manualCategories: categories }));
  }, []);

  const setManualFilters = useCallback((filters: Partial<ManualFilters>) => {
    setState((prev) => ({
      ...prev,
      manualFilters: { ...prev.manualFilters, ...filters },
    }));
  }, []);

  // ── 공통 Actions ─────────────────────────────────────────────────────────────

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

  const value = useMemo<NoticesContextValue>(
    () => ({
      ...state,
      setNotices,
      addNotice,
      updateNoticeInContext,
      removeNotice,
      setCurrentNotice,
      setNoticeFilters,
      setManuals,
      addManual,
      updateManualInContext,
      removeManual,
      setCurrentManual,
      setManualCategories,
      setManualFilters,
      setLoading,
      setError,
      clearError,
      reset,
    }),
    [
      state,
      setNotices,
      addNotice,
      updateNoticeInContext,
      removeNotice,
      setCurrentNotice,
      setNoticeFilters,
      setManuals,
      addManual,
      updateManualInContext,
      removeManual,
      setCurrentManual,
      setManualCategories,
      setManualFilters,
      setLoading,
      setError,
      clearError,
      reset,
    ]
  );

  if (!serviceInitialized) {
    return <div>Initializing Notices Service...</div>;
  }

  return (
    <NoticesContext.Provider value={value}>{children}</NoticesContext.Provider>
  );
};

export const useNoticesContext = (): NoticesContextValue => {
  const ctx = useContext(NoticesContext);
  if (!ctx) {
    throw new Error('useNoticesContext must be used within a NoticesProvider');
  }
  return ctx;
};

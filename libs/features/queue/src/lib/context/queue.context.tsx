import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
  useLayoutEffect,
} from 'react';
import { useApolloClient } from '@apollo/client/react';
import {
  initQueueService,
  getQueueService,
  isQueueServiceInitialized,
} from '../services';
import type {
  QueueState,
  QueueContextValue,
  QueueStats,
  QueueSession,
} from '../types';

// ── 초기 상태 ─────────────────────────────────────────────────────────────────

const initialState: QueueState = {
  integratedStats: [],
  currentStats: null,
  currentSession: null,
  sessions: [],
  isLoading: false,
  error: null,
};

// ── Context ───────────────────────────────────────────────────────────────────

const QueueContext = createContext<QueueContextValue | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────────────────

export const QueueProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<QueueState>(initialState);
  const apolloClient = useApolloClient();

  // reviews 패턴 동일: useEffect로 서비스 초기화
  useLayoutEffect(() => {
    if (!isQueueServiceInitialized()) {
      try {
        initQueueService(apolloClient);
      } catch (error) {
        console.error('❌ QueueService initialization failed:', error);
      }
    }
  }, [apolloClient]);

  // ── 로드 액션 ───────────────────────────────────────────────────────────────

  const loadIntegratedStats = useCallback(async (storeIds: number[]) => {
    // ✅ 빈 배열이면 호출하지 않음
    if (storeIds.length === 0) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const service = getQueueService();
      const res = await service.getIntegratedQueueStats({ storeIds });
      if (res.success && res.data?.stats) {
        setState((prev) => ({
          ...prev,
          integratedStats: res.data!.stats ?? [],
          isLoading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error:
            res.data?.error?.message ??
            res.error?.message ??
            '현황을 불러오지 못했습니다.',
          isLoading: false,
        }));
      }
    } catch {
      setState((prev) => ({
        ...prev,
        error: '현황을 불러오는 중 오류가 발생했습니다.',
        isLoading: false,
      }));
    }
  }, []);

  const loadQueueStats = useCallback(async (storeId: number) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const service = getQueueService();
      const res = await service.getQueueStats({ storeId });
      if (res.success && res.data?.stats) {
        setState((prev) => ({
          ...prev,
          currentStats: res.data!.stats ?? null,
          isLoading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error:
            res.data?.error?.message ??
            res.error?.message ??
            '현황을 불러오지 못했습니다.',
          isLoading: false,
        }));
      }
    } catch {
      setState((prev) => ({
        ...prev,
        error: '현황을 불러오는 중 오류가 발생했습니다.',
        isLoading: false,
      }));
    }
  }, []);

  // ── 세터 액션 ───────────────────────────────────────────────────────────────

  const setIntegratedStats = useCallback((stats: QueueStats[]) => {
    setState((prev) => ({ ...prev, integratedStats: stats }));
  }, []);

  const setCurrentStats = useCallback((stats: QueueStats | null) => {
    setState((prev) => ({ ...prev, currentStats: stats }));
  }, []);

  const setCurrentSession = useCallback((session: QueueSession | null) => {
    setState((prev) => ({ ...prev, currentSession: session }));
  }, []);

  const setSessions = useCallback((sessions: QueueSession[]) => {
    setState((prev) => ({ ...prev, sessions }));
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

  // ── Context Value ─────────────────────────────────────────────────────────

  const value = useMemo<QueueContextValue>(
    () => ({
      ...state,
      setIntegratedStats,
      setCurrentStats,
      setCurrentSession,
      setSessions,
      loadIntegratedStats,
      loadQueueStats,
      setLoading,
      setError,
      clearError,
      reset,
    }),
    [
      state,
      setIntegratedStats,
      setCurrentStats,
      setCurrentSession,
      setSessions,
      loadIntegratedStats,
      loadQueueStats,
      setLoading,
      setError,
      clearError,
      reset,
    ]
  );

  return (
    <QueueContext.Provider value={value}>{children}</QueueContext.Provider>
  );
};

export const useQueueContext = (): QueueContextValue => {
  const ctx = useContext(QueueContext);
  if (!ctx) {
    throw new Error('useQueueContext must be used within a QueueProvider');
  }
  return ctx;
};

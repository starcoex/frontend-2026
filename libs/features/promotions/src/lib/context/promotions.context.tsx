import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
  useLayoutEffect,
} from 'react';
import type {
  Promotion,
  PromotionFilters,
  PromotionSummaryStats,
  PromotionsContextValue,
  PromotionsState,
} from '../types';
import { useApolloClient } from '@apollo/client/react';
import { initPromotionsService, serviceRegistry } from '../services';

const PromotionsContext = createContext<PromotionsContextValue | undefined>(
  undefined
);

const initialState: PromotionsState = {
  promotions: [],
  currentPromotion: null,
  summaryStats: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
};

export const PromotionsProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PromotionsState>(initialState);
  const apolloClient = useApolloClient();

  useLayoutEffect(() => {
    if (!serviceRegistry.isServiceInitialized('promotions')) {
      try {
        initPromotionsService(apolloClient);
      } catch (error) {
        console.error('❌ ReviewsService initialization failed:', error);
      }
    }
  }, [apolloClient]);

  // =========================================================================
  // 프로모션 목록 액션
  // =========================================================================

  const setPromotions = useCallback((promotions: Promotion[]) => {
    setState((prev) => ({ ...prev, promotions }));
  }, []);

  const addPromotion = useCallback((promotion: Promotion) => {
    setState((prev) => ({
      ...prev,
      promotions: [promotion, ...prev.promotions],
    }));
  }, []);

  const updatePromotionInContext = useCallback(
    (id: number, updates: Partial<Promotion>) => {
      setState((prev) => ({
        ...prev,
        promotions: prev.promotions.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
        currentPromotion:
          prev.currentPromotion?.id === id
            ? { ...prev.currentPromotion, ...updates }
            : prev.currentPromotion,
      }));
    },
    []
  );

  const removePromotion = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      promotions: prev.promotions.filter((p) => p.id !== id),
      currentPromotion:
        prev.currentPromotion?.id === id ? null : prev.currentPromotion,
    }));
  }, []);

  const setCurrentPromotion = useCallback((promotion: Promotion | null) => {
    setState((prev) => ({ ...prev, currentPromotion: promotion }));
  }, []);

  const setSummaryStats = useCallback(
    (summaryStats: PromotionSummaryStats | null) => {
      setState((prev) => ({ ...prev, summaryStats }));
    },
    []
  );

  // =========================================================================
  // 필터 / 페이지네이션 액션
  // =========================================================================

  const setFilters = useCallback((filters: Partial<PromotionFilters>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setState((prev) => ({ ...prev, filters: {} }));
  }, []);

  const setPagination = useCallback(
    (pagination: Partial<PromotionsState['pagination']>) => {
      setState((prev) => ({
        ...prev,
        pagination: { ...prev.pagination, ...pagination },
      }));
    },
    []
  );

  // =========================================================================
  // 공통 액션
  // =========================================================================

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

  // =========================================================================
  // Context Value
  // =========================================================================

  const value = useMemo<PromotionsContextValue>(
    () => ({
      ...state,
      setPromotions,
      addPromotion,
      updatePromotionInContext,
      removePromotion,
      setCurrentPromotion,
      setSummaryStats,
      setFilters,
      clearFilters,
      setPagination,
      setLoading,
      setError,
      clearError,
      reset,
    }),
    [
      state,
      setPromotions,
      addPromotion,
      updatePromotionInContext,
      removePromotion,
      setCurrentPromotion,
      setSummaryStats,
      setFilters,
      clearFilters,
      setPagination,
      setLoading,
      setError,
      clearError,
      reset,
    ]
  );

  return (
    <PromotionsContext.Provider value={value}>
      {children}
    </PromotionsContext.Provider>
  );
};

export const usePromotionsContext = (): PromotionsContextValue => {
  const ctx = useContext(PromotionsContext);
  if (!ctx) {
    throw new Error(
      'usePromotionsContext must be used within a PromotionsProvider'
    );
  }
  return ctx;
};

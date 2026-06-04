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
  Review,
  ReviewFilters,
  ReviewSummaryStats,
  GeneralReviewScope,
  ReviewsContextValue,
  ReviewsState,
} from '../types';
import { useApolloClient } from '@apollo/client/react';
import { initReviewsService, serviceRegistry } from '../services';

const ReviewsContext = createContext<ReviewsContextValue | undefined>(
  undefined
);

const initialState: ReviewsState = {
  reviews: [],
  currentReview: null,
  summaryStats: null,
  generalReviewScopes: [],
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

export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ReviewsState>(initialState);
  const apolloClient = useApolloClient();

  useLayoutEffect(() => {
    if (!serviceRegistry.isServiceInitialized('reviews')) {
      try {
        initReviewsService(apolloClient);
      } catch (error) {
        console.error('❌ ReviewsService initialization failed:', error);
      }
    }
  }, [apolloClient]);

  // =========================================================================
  // 리뷰 목록 액션
  // =========================================================================

  const setReviews = useCallback((reviews: Review[]) => {
    setState((prev) => ({ ...prev, reviews }));
  }, []);

  const addReview = useCallback((review: Review) => {
    setState((prev) => ({
      ...prev,
      reviews: [review, ...prev.reviews],
    }));
  }, []);

  const updateReviewInContext = useCallback(
    (id: number, updates: Partial<Review>) => {
      setState((prev) => ({
        ...prev,
        reviews: prev.reviews.map((r) =>
          r.id === id ? { ...r, ...updates } : r
        ),
        currentReview:
          prev.currentReview?.id === id
            ? { ...prev.currentReview, ...updates }
            : prev.currentReview,
      }));
    },
    []
  );

  const removeReview = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((r) => r.id !== id),
      currentReview: prev.currentReview?.id === id ? null : prev.currentReview,
    }));
  }, []);

  const setCurrentReview = useCallback((review: Review | null) => {
    setState((prev) => ({ ...prev, currentReview: review }));
  }, []);

  const setSummaryStats = useCallback(
    (summaryStats: ReviewSummaryStats | null) => {
      setState((prev) => ({ ...prev, summaryStats }));
    },
    []
  );

  // =========================================================================
  // GeneralReviewScope 액션
  // =========================================================================

  const setGeneralReviewScopes = useCallback(
    (generalReviewScopes: GeneralReviewScope[]) => {
      setState((prev) => ({ ...prev, generalReviewScopes }));
    },
    []
  );

  const addGeneralReviewScope = useCallback((scope: GeneralReviewScope) => {
    setState((prev) => ({
      ...prev,
      generalReviewScopes: [scope, ...prev.generalReviewScopes],
    }));
  }, []);

  const updateGeneralReviewScopeInContext = useCallback(
    (id: number, updates: Partial<GeneralReviewScope>) => {
      setState((prev) => ({
        ...prev,
        generalReviewScopes: prev.generalReviewScopes.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        ),
      }));
    },
    []
  );

  const removeGeneralReviewScope = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      generalReviewScopes: prev.generalReviewScopes.filter((s) => s.id !== id),
    }));
  }, []);

  // =========================================================================
  // 필터 / 페이지네이션 액션
  // =========================================================================

  const setFilters = useCallback((filters: Partial<ReviewFilters>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setState((prev) => ({ ...prev, filters: {} }));
  }, []);

  const setPagination = useCallback(
    (pagination: Partial<ReviewsState['pagination']>) => {
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

  const value = useMemo<ReviewsContextValue>(
    () => ({
      ...state,
      setReviews,
      addReview,
      updateReviewInContext,
      removeReview,
      setCurrentReview,
      setSummaryStats,
      setGeneralReviewScopes,
      addGeneralReviewScope,
      updateGeneralReviewScopeInContext,
      removeGeneralReviewScope,
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
      setReviews,
      addReview,
      updateReviewInContext,
      removeReview,
      setCurrentReview,
      setSummaryStats,
      setGeneralReviewScopes,
      addGeneralReviewScope,
      updateGeneralReviewScopeInContext,
      removeGeneralReviewScope,
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
    <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
  );
};

export const useReviewsContext = (): ReviewsContextValue => {
  const ctx = useContext(ReviewsContext);
  if (!ctx) {
    throw new Error('useReviewsContext must be used within a ReviewsProvider');
  }
  return ctx;
};

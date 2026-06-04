import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
  useLayoutEffect,
} from 'react';
import { useApolloClient } from '@apollo/client/react';
import { serviceRegistry, initPaymentsService } from '../services';
import type {
  Payment,
  PaymentCancellation,
  PaymentListData,
  PaymentsFilter,
  PaymentsState,
  PaymentsContextValue,
} from '../types';

// ============================================================================
// Initial State
// ============================================================================

const initialFilter: PaymentsFilter = {
  limit: 20,
  offset: 0,
};

const initialState: PaymentsState = {
  payments: [],
  selectedPayment: null,
  selectedCancellation: null,
  listData: null,
  filter: initialFilter,
  isLoading: false,
  isSubmitting: false,
  error: null,
};

// ============================================================================
// Context
// ============================================================================

const PaymentsContext = createContext<PaymentsContextValue | undefined>(
  undefined
);

// ============================================================================
// Provider
// ============================================================================

export const PaymentsProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PaymentsState>(initialState);
  const apolloClient = useApolloClient();

  useLayoutEffect(() => {
    if (!serviceRegistry.isServiceInitialized('payments')) {
      try {
        initPaymentsService(apolloClient);
      } catch (error) {
        console.error('❌ PaymentsService initialization failed:', error);
      }
    }
  }, [apolloClient]);

  // ── Payment 목록 액션 ──────────────────────────────────────────────────────

  const setPayments = useCallback(
    (payments: Payment[], listData: PaymentListData) => {
      setState((prev) => ({ ...prev, payments, listData }));
    },
    []
  );

  const setSelectedPayment = useCallback((payment: Payment | null) => {
    setState((prev) => ({ ...prev, selectedPayment: payment }));
  }, []);

  const setSelectedCancellation = useCallback(
    (cancellation: PaymentCancellation | null) => {
      setState((prev) => ({ ...prev, selectedCancellation: cancellation }));
    },
    []
  );

  // ── 필터 액션 ──────────────────────────────────────────────────────────────

  const setFilter = useCallback((filter: Partial<PaymentsFilter>) => {
    setState((prev) => ({
      ...prev,
      filter: { ...prev.filter, ...filter, offset: 0 },
    }));
  }, []);

  const resetFilter = useCallback(() => {
    setState((prev) => ({ ...prev, filter: initialFilter }));
  }, []);

  // ── 공통 상태 액션 ─────────────────────────────────────────────────────────

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setState((prev) => ({ ...prev, isSubmitting }));
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

  // ── Context Value ──────────────────────────────────────────────────────────

  const value = useMemo<PaymentsContextValue>(
    () => ({
      ...state,
      setPayments,
      setSelectedPayment,
      setSelectedCancellation,
      setFilter,
      resetFilter,
      setLoading,
      setSubmitting,
      setError,
      clearError,
      reset,
    }),
    [
      state,
      setPayments,
      setSelectedPayment,
      setSelectedCancellation,
      setFilter,
      resetFilter,
      setLoading,
      setSubmitting,
      setError,
      clearError,
      reset,
    ]
  );

  return (
    <PaymentsContext.Provider value={value}>
      {children}
    </PaymentsContext.Provider>
  );
};

// ============================================================================
// Hook
// ============================================================================

export const usePaymentsContext = (): PaymentsContextValue => {
  const ctx = useContext(PaymentsContext);
  if (!ctx) {
    throw new Error(
      'usePaymentsContext must be used within a PaymentsProvider'
    );
  }
  return ctx;
};

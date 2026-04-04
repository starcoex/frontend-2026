import { useCallback, useRef } from 'react';
import type { ApiResponse } from '../types';
import { usePaymentsContext } from '../context';
import { getPaymentsService } from '../services';
import type {
  PaymentsFilter,
  CreatePaymentInput,
  CompletePaymentInput,
  CancelPaymentInput,
  GetPaymentInput,
  GetCancellationInput,
} from '../types';

// ============================================================================
// 단일 통합 Hook
// ============================================================================

export const usePayments = () => {
  const context = usePaymentsContext();

  const {
    setPayments,
    setSelectedPayment,
    setSelectedCancellation,
    setFilter,
    resetFilter,
    setLoading,
    setSubmitting,
    setError,
    clearError,
    isLoading: contextIsLoading,
    payments,
    selectedPayment,
    selectedCancellation,
    listData,
    filter,
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

  const withSubmitting = useCallback(
    async <T>(
      operation: () => Promise<ApiResponse<T>>,
      defaultErrorMessage: string
    ): Promise<ApiResponse<T>> => {
      try {
        setSubmitting(true);
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
        setSubmitting(false);
      }
    },
    [setSubmitting, clearError, setError]
  );

  // ============================================================================
  // Queries
  // ============================================================================

  const fetchPayments = useCallback(
    async (overrideFilter?: PaymentsFilter) =>
      withLoading(async () => {
        const service = getPaymentsService();
        const res = await service.getPayments(overrideFilter ?? filter);
        if (res.success && res.data?.data) {
          setPayments(res.data.data.payments, res.data.data);
        }
        return res;
      }, '결제 목록을 불러오는데 실패했습니다.'),
    [withLoading, filter, setPayments]
  );

  const fetchPaymentById = useCallback(
    async (input: GetPaymentInput) =>
      withLoading(async () => {
        const service = getPaymentsService();
        const res = await service.getPayment(input);
        if (res.success && res.data?.payment) {
          setSelectedPayment(res.data.payment);
        }
        return res;
      }, '결제 정보를 불러오는데 실패했습니다.'),
    [withLoading, setSelectedPayment]
  );

  const fetchCancellation = useCallback(
    async (input: GetCancellationInput) =>
      withLoading(async () => {
        const service = getPaymentsService();
        const res = await service.getPaymentCancellation(input);
        if (res.success && res.data?.cancellation) {
          setSelectedCancellation(res.data.cancellation);
        }
        return res;
      }, '취소 내역을 불러오는데 실패했습니다.'),
    [withLoading, setSelectedCancellation]
  );

  // ============================================================================
  // Mutations
  // ============================================================================

  const createPayment = useCallback(
    async (input: CreatePaymentInput) =>
      withSubmitting(async () => {
        const service = getPaymentsService();
        return service.createPayment(input);
      }, '결제 생성에 실패했습니다.'),
    [withSubmitting]
  );

  const completePayment = useCallback(
    async (input: CompletePaymentInput) =>
      withSubmitting(async () => {
        const service = getPaymentsService();
        const res = await service.completePayment(input);
        if (res.success && res.data?.payment) {
          setSelectedPayment(res.data.payment);
        }
        return res;
      }, '결제 완료 처리에 실패했습니다.'),
    [withSubmitting, setSelectedPayment]
  );

  const cancelPayment = useCallback(
    async (input: CancelPaymentInput) =>
      withSubmitting(async () => {
        const service = getPaymentsService();
        return service.cancelPayment(input);
      }, '결제 취소에 실패했습니다.'),
    [withSubmitting]
  );

  // ============================================================================
  // 필터 액션
  // ============================================================================

  const handleFilterChange = useCallback(
    (partial: Partial<PaymentsFilter>) => {
      const nextFilter = { ...filter, ...partial, offset: 0 };
      setFilter(partial);
      fetchPayments(nextFilter);
    },
    [setFilter, fetchPayments, filter]
  );

  const handleResetFilter = useCallback(() => {
    const defaultFilter: PaymentsFilter = { limit: 20, offset: 0 };
    resetFilter();
    fetchPayments(defaultFilter);
  }, [resetFilter, fetchPayments]);

  const handlePageChange = useCallback(
    (page: number) => {
      const offset = page * (filter.limit ?? 20);
      fetchPayments({ ...filter, offset });
    },
    [fetchPayments, filter]
  );

  return {
    // ── 상태 ──
    ...context,
    payments,
    selectedPayment,
    selectedCancellation,
    listData,
    filter,
    // ── Queries ──
    fetchPayments,
    fetchPaymentById,
    fetchCancellation,
    // ── Mutations ──
    createPayment,
    completePayment,
    cancelPayment,
    // ── 필터 ──
    handleFilterChange,
    handleResetFilter,
    handlePageChange,
    // ── 공통 ──
    clearError,
  };
};

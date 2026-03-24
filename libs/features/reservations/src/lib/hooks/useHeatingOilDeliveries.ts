import { useCallback, useRef } from 'react';
import type { ApiResponse } from '../types';
import { getReservationsService } from '../services';
import type {
  CreateHeatingOilDeliveryInput,
  AssignDriverInput,
  UpdateHeatingOilDeliveryStatusInput,
  CompleteHeatingOilDeliveryInput,
  HeatingOilDeliveryStatus,
} from '../types';
import { useHeatingOilDeliveriesContext } from '../context';

export const useHeatingOilDeliveries = () => {
  const context = useHeatingOilDeliveriesContext();

  const {
    setDeliveries,
    addDelivery,
    updateDeliveryInContext,
    removeDelivery,
    setCurrentDelivery,
    setLoading,
    setError,
    clearError,
    isLoading: contextIsLoading,
    deliveries,
    currentDelivery,
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
  // Queries
  // ============================================================================

  const fetchDeliveries = useCallback(
    async (input: {
      storeId?: number;
      status?: HeatingOilDeliveryStatus;
      isUrgent?: boolean;
      driverId?: number;
    }) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.findHeatingOilDeliveries(input);
        if (res.success && res.data?.deliveries) {
          setDeliveries(res.data.deliveries);
        }
        return res;
      }, '난방유 배달 목록을 불러오는데 실패했습니다.'),
    [withLoading, setDeliveries]
  );

  // ============================================================================
  // Mutations
  // ============================================================================

  const createDelivery = useCallback(
    async (input: CreateHeatingOilDeliveryInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.createHeatingOilDelivery(input);
        if (res.success && res.data?.delivery) {
          addDelivery(res.data.delivery);
        }
        return res;
      }, '난방유 배달 등록에 실패했습니다.'),
    [withLoading, addDelivery]
  );

  const assignDriver = useCallback(
    async (input: AssignDriverInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.assignDeliveryDriver(input);
        if (res.success && res.data?.delivery) {
          updateDeliveryInContext(input.deliveryId, res.data.delivery);
        }
        return res;
      }, '배달 기사 배정에 실패했습니다.'),
    [withLoading, updateDeliveryInContext]
  );

  const updateDeliveryStatus = useCallback(
    async (input: UpdateHeatingOilDeliveryStatusInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.updateHeatingOilDeliveryStatus(input);
        if (res.success && res.data?.delivery) {
          updateDeliveryInContext(input.deliveryId, res.data.delivery);
        }
        return res;
      }, '배달 상태 변경에 실패했습니다.'),
    [withLoading, updateDeliveryInContext]
  );

  const completeDelivery = useCallback(
    async (input: CompleteHeatingOilDeliveryInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.completeHeatingOilDelivery(input);
        if (res.success && res.data?.delivery) {
          updateDeliveryInContext(input.deliveryId, res.data.delivery);
        }
        return res;
      }, '배달 완료 처리에 실패했습니다.'),
    [withLoading, updateDeliveryInContext]
  );

  const deleteDelivery = useCallback(
    async (deliveryId: number) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.deleteHeatingOilDelivery(deliveryId);
        if (res.success) {
          removeDelivery(deliveryId);
          if (currentDelivery?.id === deliveryId) {
            setCurrentDelivery(null);
          }
        }
        return res;
      }, '난방유 배달 삭제에 실패했습니다.'),
    [withLoading, removeDelivery, currentDelivery, setCurrentDelivery]
  );

  const bulkDeleteDeliveries = useCallback(
    async (deliveryIds: number[]) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.bulkDeleteHeatingOilDeliveries(deliveryIds);
        if (res.success) {
          deliveryIds.forEach((id) => removeDelivery(id));
          if (currentDelivery && deliveryIds.includes(currentDelivery.id)) {
            setCurrentDelivery(null);
          }
        }
        return res;
      }, '난방유 배달 다건 삭제에 실패했습니다.'),
    [withLoading, removeDelivery, currentDelivery, setCurrentDelivery]
  );

  // ============================================================================
  // 클라이언트 사이드 필터링
  // ============================================================================

  const filteredDeliveries = useCallback(() => {
    let result = [...deliveries];
    if (filters.storeId !== undefined)
      result = result.filter((d) => d.storeId === filters.storeId);
    if (filters.status !== undefined)
      result = result.filter((d) => d.status === filters.status);
    if (filters.isUrgent !== undefined)
      result = result.filter((d) => d.isUrgent === filters.isUrgent);
    if (filters.driverId !== undefined)
      result = result.filter((d) => d.driverId === filters.driverId);
    return result;
  }, [deliveries, filters]);

  return {
    ...context,

    // Queries
    fetchDeliveries,
    filteredDeliveries,

    // Mutations
    createDelivery,
    assignDriver,
    updateDeliveryStatus,
    completeDelivery,
    deleteDelivery,
    bulkDeleteDeliveries,

    // 편의 값
    deliveries,
    currentDelivery,
    filters,
  };
};

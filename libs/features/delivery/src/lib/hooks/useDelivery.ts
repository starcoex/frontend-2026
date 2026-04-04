import { useCallback, useRef } from 'react';
import type { ApiResponse } from '../types';
import { useDeliveryContext } from '../context';
import { getDeliveryService } from '../services';
import { useDeliverySocket } from './useDeliverySocket';
import type {
  CreateDeliveryInput,
  CreateDeliveryDriverInput,
  GetDeliveriesInput,
  DeliveryFilters,
  DeliveryStatus,
} from '../types';
import type { NewDeliveryRequestPayload } from '../types';

interface UseDeliveryOptions {
  /** Socket.io 인증 토큰 (실시간 기능 활성화 시 필수) */
  token?: string | null;
  /** 특정 배송 실시간 추적용 ID */
  deliveryId?: number;
  /** 드라이버 룸 구독 여부 (기사 관리 페이지용) */
  joinDriversRoom?: boolean;
  /** 새 배송 요청 알림 콜백 */
  onNewDeliveryRequest?: (payload: NewDeliveryRequestPayload) => void;
}

export const useDelivery = (options: UseDeliveryOptions = {}) => {
  const {
    token = null,
    deliveryId,
    joinDriversRoom = false,
    onNewDeliveryRequest,
  } = options;

  const context = useDeliveryContext();

  const {
    setDeliveries,
    addDelivery,
    updateDeliveryInContext,
    removeDelivery, // ← 추가
    setCurrentDelivery,
    setTrackingInfo,
    setPagination,
    setFilters,
    clearFilters,
    setLoading,
    setError,
    clearError,
    isLoading: contextIsLoading,
    deliveries,
    currentDelivery,
    trackingInfo,
    pagination,
    filters,
    // 실시간 상태
    liveLocations,
    socketStatus,
    subscribedDeliveryIds,
  } = context;

  const isLoadingRef = useRef(contextIsLoading);
  isLoadingRef.current = contextIsLoading;

  // ── Socket.io 실시간 연결 ──────────────────────────────────────────────────
  const { subscribeDelivery, unsubscribeDelivery, isConnected } =
    useDeliverySocket({
      token,
      deliveryId,
      joinDriversRoom,
      onNewDeliveryRequest,
    });

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

  const fetchDeliveryById = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getDeliveryService();
        const res = await service.getDeliveryById(id);
        if (res.success && res.data) {
          setCurrentDelivery(res.data);
          updateDeliveryInContext(id, res.data);
        }
        return res;
      }, '배송 정보를 불러오는데 실패했습니다.'),
    [withLoading, setCurrentDelivery, updateDeliveryInContext]
  );

  const fetchDeliveries = useCallback(
    async (input: GetDeliveriesInput = filters) =>
      withLoading(async () => {
        const service = getDeliveryService();
        const res = await service.listDeliveries(input);
        if (res.success && res.data) {
          setDeliveries(res.data.deliveries);
          setPagination({
            totalCount: res.data.totalCount,
            currentPage: res.data.currentPage,
            totalPages: res.data.totalPages,
            hasNext: res.data.hasNext,
            hasPrev: res.data.hasPrev,
          });
        }
        return res;
      }, '배송 목록을 불러오는데 실패했습니다.'),
    [withLoading, filters, setDeliveries, setPagination]
  );

  const fetchTrackingInfo = useCallback(
    async (deliveryNumber: string) =>
      withLoading(async () => {
        const service = getDeliveryService();
        const res = await service.trackDelivery(deliveryNumber);
        if (res.success && res.data) {
          setTrackingInfo(res.data);
        }
        return res;
      }, '배송 추적 정보를 불러오는데 실패했습니다.'),
    [withLoading, setTrackingInfo]
  );

  // ============================================================================
  // Mutations
  // ============================================================================

  const createDelivery = useCallback(
    async (input: CreateDeliveryInput) =>
      withLoading(async () => {
        const service = getDeliveryService();
        const res = await service.createDelivery(input);
        if (res.success && res.data?.delivery) {
          addDelivery(res.data.delivery);
        }
        return res;
      }, '배송 생성에 실패했습니다.'),
    [withLoading, addDelivery]
  );

  const createDeliveryDriver = useCallback(
    async (input: CreateDeliveryDriverInput) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.createDeliveryDriver(input);
      }, '배달기사 등록에 실패했습니다.'),
    [withLoading]
  );

  const updateDeliveryStatus = useCallback(
    async (deliveryId: number, status: DeliveryStatus) =>
      withLoading(async () => {
        const service = getDeliveryService();
        const res = await service.updateDeliveryStatus(deliveryId, status);
        if (res.success && res.data) {
          updateDeliveryInContext(deliveryId, res.data);
        }
        return res;
      }, '배송 상태 변경에 실패했습니다.'),
    [withLoading, updateDeliveryInContext]
  );

  const deactivateDriver = useCallback(
    async (driverId: number) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.deactivateDriver(driverId);
      }, '기사 비활성화에 실패했습니다.'),
    [withLoading]
  );

  const deactivateDrivers = useCallback(
    async (driverIds: number[]) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.deactivateDrivers(driverIds);
      }, '기사 다건 비활성화에 실패했습니다.'),
    [withLoading]
  );

  const updateDriverAvailability = useCallback(
    async (driverId: number, isAvailable: boolean) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.updateDriverAvailability(driverId, isAvailable);
      }, '기사 가용 상태 변경에 실패했습니다.'),
    [withLoading]
  );

  const updateDriverLocation = useCallback(
    async (driverId: number, lat: number, lng: number) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.updateDriverLocation(driverId, lat, lng);
      }, '기사 위치 업데이트에 실패했습니다.'),
    [withLoading]
  );

  // ============================================================================
  // 필터 헬퍼
  // ============================================================================

  const applyFilters = useCallback(
    (newFilters: Partial<DeliveryFilters>) => {
      const updated = { ...filters, ...newFilters, page: 1 };
      setFilters(updated);
      return fetchDeliveries(updated);
    },
    [filters, setFilters, fetchDeliveries]
  );

  const goToPage = useCallback(
    (page: number) => {
      const updated = { ...filters, page };
      setFilters(updated);
      return fetchDeliveries(updated);
    },
    [filters, setFilters, fetchDeliveries]
  );

  return {
    ...context,
    // GraphQL
    fetchDeliveries,
    fetchDeliveryById,
    fetchTrackingInfo,
    createDelivery,
    createDeliveryDriver,
    updateDeliveryStatus,
    deactivateDriver,
    deactivateDrivers,
    updateDriverAvailability,
    updateDriverLocation,
    // 필터 헬퍼
    applyFilters,
    goToPage,
    clearFilters,
    // 값
    deliveries,
    currentDelivery,
    trackingInfo,
    pagination,
    filters,
    // 실시간
    liveLocations,
    socketStatus,
    subscribedDeliveryIds,
    subscribeDelivery,
    unsubscribeDelivery,
    isSocketConnected: isConnected,
    // 컨텍스트 액션 직접 노출
    removeDelivery,
    updateDeliveryInContext,
  };
};

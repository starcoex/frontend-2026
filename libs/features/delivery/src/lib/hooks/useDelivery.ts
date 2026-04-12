import { useCallback, useRef } from 'react';
import type { ApiResponse, GetMyDeliveriesInput } from '../types';
import { useDeliveryContext } from '../context';
import { getDeliveryService } from '../services';
import { useDeliverySocket } from './useDeliverySocket';
import type {
  CreateDeliveryInput,
  CreateDeliveryDriverInput,
  GetDeliveriesInput,
  DeliveryFilters,
  DeliveryStatus,
  VerifyDriverLicenseInput, // ✅ 추가
  OcrDriverLicenseInput, // ✅ 추가
  GetDriversInput, // ✅ 신규
  GetDriverSettlementsInput, // ✅ 신규
  UpdateDriverProfileInput, // ✅ 신규
  UpdateDriverStatusInput, // ✅ 신규
  AssignDriverInput, // ✅ 신규
  UnassignDriverInput, // ✅ 신규
} from '../types';
import type { NewDeliveryRequestPayload } from '../types';

interface UseDeliveryOptions {
  /** Socket.io 인증 토큰 — Cookie 방식에서는 불필요 */
  token?: string | null;
  /** 특정 배송 실시간 추적용 ID */
  deliveryId?: number;
  /** 드라이버 룸 구독 여부 (기사 관리 페이지용) */
  joinDriversRoom?: boolean;
  /** 새 배송 요청 알림 콜백 */
  onNewDeliveryRequest?: (payload: NewDeliveryRequestPayload) => void;
  /** ✅ 소켓 연결 비활성화 — 배달기사 뷰에서 사용 */
  skipSocket?: boolean;
}

export const useDelivery = (options: UseDeliveryOptions = {}) => {
  const {
    token = null,
    deliveryId,
    joinDriversRoom = false,
    onNewDeliveryRequest,
    skipSocket = false, // ✅ 기본값 false — 기존 동작 유지
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
      enabled: !skipSocket, // ✅ skipSocket=true면 소켓 비활성화
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

  // ✅ 신규: 배달기사 본인 배송 조회
  const fetchMyDeliveries = useCallback(
    async (input: GetMyDeliveriesInput = {}) =>
      withLoading(async () => {
        const service = getDeliveryService();
        const res = await service.getMyDeliveries(input);
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
      }, '내 배송 목록을 불러오는데 실패했습니다.'),
    [withLoading, setDeliveries, setPagination]
  );

  // ✅ 신규: 본인 기사 프로필 조회
  const fetchMyDriverProfile = useCallback(
    async () =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.getMyDriverProfile();
      }, '내 프로필을 불러오는데 실패했습니다.'),
    [withLoading]
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

  const verifyDriverLicense = useCallback(
    async (input: VerifyDriverLicenseInput) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.verifyDriverLicense(input);
      }, '운전면허 진위 확인에 실패했습니다.'),
    [withLoading]
  );

  const ocrDriverLicense = useCallback(
    async (input: OcrDriverLicenseInput) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.ocrDriverLicense(input);
      }, '운전면허 OCR 처리에 실패했습니다.'),
    [withLoading]
  );

  // ============================================================================
  // 신규 기사 관련 훅
  // ============================================================================

  const fetchDriverById = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.getDriverById(id);
      }, '기사 정보를 불러오는데 실패했습니다.'),
    [withLoading]
  );

  const fetchDrivers = useCallback(
    async (input: GetDriversInput = {}) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.getDrivers(input);
      }, '기사 목록을 불러오는데 실패했습니다.'),
    [withLoading]
  );

  const fetchDriverSettlements = useCallback(
    async (input: GetDriverSettlementsInput) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.getDriverSettlements(input);
      }, '정산 내역을 불러오는데 실패했습니다.'),
    [withLoading]
  );

  const updateDriverProfile = useCallback(
    async (input: UpdateDriverProfileInput) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.updateDriverProfile(input);
      }, '기사 프로필 수정에 실패했습니다.'),
    [withLoading]
  );

  const updateDriverStatus = useCallback(
    async (input: UpdateDriverStatusInput) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.updateDriverStatus(input);
      }, '기사 상태 변경에 실패했습니다.'),
    [withLoading]
  );

  const deleteDriver = useCallback(
    async (driverId: number) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.deleteDriver(driverId);
      }, '기사 삭제에 실패했습니다.'),
    [withLoading]
  );

  const deleteDrivers = useCallback(
    async (driverIds: number[]) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.deleteDrivers(driverIds);
      }, '기사 다건 삭제에 실패했습니다.'),
    [withLoading]
  );

  const deleteDelivery = useCallback(
    async (deliveryId: number) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.deleteDelivery(deliveryId);
      }, '배송 삭제에 실패했습니다.'),
    [withLoading]
  );

  const deleteDeliveries = useCallback(
    async (deliveryIds: number[]) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.deleteDeliveries(deliveryIds);
      }, '배송 다건 삭제에 실패했습니다.'),
    [withLoading]
  );

  // ✅ 신규: 기사 배정
  const assignDriver = useCallback(
    async (input: AssignDriverInput) =>
      withLoading(async () => {
        const service = getDeliveryService();
        const res = await service.assignDriverToDelivery(input);
        if (res.success && res.data?.delivery) {
          updateDeliveryInContext(input.deliveryId, res.data.delivery);
          setCurrentDelivery(res.data.delivery);
        }
        return res;
      }, '기사 배정에 실패했습니다.'),
    [withLoading, updateDeliveryInContext, setCurrentDelivery]
  );

  // ✅ 신규: 기사 배정 해제
  const unassignDriver = useCallback(
    async (input: UnassignDriverInput) =>
      withLoading(async () => {
        const service = getDeliveryService();
        const res = await service.unassignDriverFromDelivery(input);
        if (res.success && res.data?.delivery) {
          updateDeliveryInContext(input.deliveryId, res.data.delivery);
          setCurrentDelivery(res.data.delivery);
        }
        return res;
      }, '기사 배정 해제에 실패했습니다.'),
    [withLoading, updateDeliveryInContext, setCurrentDelivery]
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
    fetchMyDeliveries, // ✅ 신규
    fetchMyDriverProfile, // ✅ 신규
    createDelivery,
    createDeliveryDriver,
    updateDeliveryStatus,
    assignDriver, // ✅ 신규
    unassignDriver, // ✅ 신규
    deactivateDriver,
    deactivateDrivers,
    updateDriverAvailability,
    updateDriverLocation,
    verifyDriverLicense, // ✅ 추가
    ocrDriverLicense, // ✅ 추가
    // ✅ 신규
    fetchDriverById,
    fetchDrivers,
    fetchDriverSettlements,
    updateDriverProfile,
    // ✅ 신규
    updateDriverStatus,
    deleteDriver,
    deleteDrivers,
    // ✅ 신규
    deleteDelivery,
    deleteDeliveries,
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

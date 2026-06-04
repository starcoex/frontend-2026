import { useCallback, useRef } from 'react';
import { useDeliveryContext } from '../context';
import { getDeliveryService } from '../services';
import type {
  ApiResponse,
  CreateDeliveryDriverInput,
  GetDriversInput,
  GetDriverSettlementsInput,
  UpdateDriverProfileInput,
  UpdateDriverStatusInput,
  VerifyDriverLicenseInput,
  OcrDriverLicenseInput,
  // ✅ 신규: 정산
  GetSettlementsByPeriodInput,
  CloseSettlementInput,
  CloseSettlementBulkInput,
  ApproveSettlementInput,
  ApproveSettlementBulkInput,
  ProcessPaymentInput,
  ProcessPaymentBulkInput,
} from '../types';

export const useDrivers = () => {
  const context = useDeliveryContext();

  const {
    setLoading,
    setError,
    clearError,
    isLoading: contextIsLoading,
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

  // ============================================================================
  // ✅ 신규: 정산 Queries
  // ============================================================================

  const fetchMySettlements = useCallback(
    async (driverId: number, limit?: number) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.mySettlements(driverId, limit);
      }, '내 정산 내역을 불러오는데 실패했습니다.'),
    [withLoading]
  );

  const fetchSettlementsByPeriod = useCallback(
    async (input: GetSettlementsByPeriodInput) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.settlementsByPeriod(input);
      }, '기간별 정산 내역을 불러오는데 실패했습니다.'),
    [withLoading]
  );

  const fetchSettlementSummary = useCallback(
    async (dateFrom: string, dateTo: string) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.settlementSummary(dateFrom, dateTo);
      }, '정산 현황 요약을 불러오는데 실패했습니다.'),
    [withLoading]
  );

  // ============================================================================
  // ✅ 신규: 정산 Mutations
  // ============================================================================

  const closeSettlement = useCallback(
    async (input: CloseSettlementInput) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.closeSettlement(input);
      }, '정산 마감 처리에 실패했습니다.'),
    [withLoading]
  );

  const closeSettlementBulk = useCallback(
    async (input: CloseSettlementBulkInput) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.closeSettlementBulk(input);
      }, '정산 다건 마감 처리에 실패했습니다.'),
    [withLoading]
  );

  const approveSettlement = useCallback(
    async (input: ApproveSettlementInput) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.approveSettlement(input);
      }, '정산 승인에 실패했습니다.'),
    [withLoading]
  );

  const approveSettlementBulk = useCallback(
    async (input: ApproveSettlementBulkInput) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.approveSettlementBulk(input);
      }, '정산 다건 승인에 실패했습니다.'),
    [withLoading]
  );

  const processSettlementPayment = useCallback(
    async (input: ProcessPaymentInput) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.processSettlementPayment(input);
      }, '정산 지급 처리에 실패했습니다.'),
    [withLoading]
  );

  const processSettlementPaymentBulk = useCallback(
    async (input: ProcessPaymentBulkInput) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.processSettlementPaymentBulk(input);
      }, '정산 일괄 지급 처리에 실패했습니다.'),
    [withLoading]
  );

  // ============================================================================
  // Mutations — 등록 / 수정
  // ============================================================================

  const createDeliveryDriver = useCallback(
    async (input: CreateDeliveryDriverInput) =>
      withLoading(async () => {
        const service = getDeliveryService();
        return service.createDeliveryDriver(input);
      }, '배달기사 등록에 실패했습니다.'),
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
  // Mutations — 비활성화 / 삭제
  // ============================================================================

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

  // ============================================================================
  // Mutations — 면허 인증
  // ============================================================================

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

  return {
    isLoading: context.isLoading,
    error: context.error,
    // Queries
    fetchDriverById,
    fetchDrivers,
    fetchDriverSettlements,
    fetchMySettlements, // ✅ 신규
    fetchSettlementsByPeriod, // ✅ 신규
    fetchSettlementSummary, // ✅ 신규
    // Mutations — 등록 / 수정
    createDeliveryDriver,
    updateDriverProfile,
    updateDriverStatus,
    updateDriverAvailability,
    updateDriverLocation,
    // Mutations — 비활성화 / 삭제
    deactivateDriver,
    deactivateDrivers,
    deleteDriver,
    deleteDrivers,
    // Mutations — 면허
    verifyDriverLicense,
    ocrDriverLicense,
    // ✅ 신규: 정산
    closeSettlement,
    closeSettlementBulk,
    approveSettlement,
    approveSettlementBulk,
    processSettlementPayment,
    processSettlementPaymentBulk,
  };
};

import { useCallback, useRef } from 'react';
import type { ApiResponse } from '../types';
import { getReservationsService } from '../services';
import type {
  CreateFuelWalkInInput,
  AttachFuelPaymentInput,
  CompleteFuelWalkInInput,
  UpdateFuelWalkInStatusInput,
  CreateFuelWalkInPackageInput,
  AttachPackagePaymentInput,
  UpdatePackageStatusInput,
  FuelWalkInStatus,
} from '../types';
import { useFuelWalkInsContext } from '../context';

export const useFuelWalkIns = () => {
  const context = useFuelWalkInsContext();

  const {
    setFuelWalkIns,
    addFuelWalkIn,
    updateFuelWalkInInContext,
    removeFuelWalkIn,
    setCurrentFuelWalkIn,
    setLoading,
    setError,
    clearError,
    isLoading: contextIsLoading,
    fuelWalkIns,
    currentFuelWalkIn,
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

  const fetchFuelWalkIns = useCallback(
    async (input: { storeId?: number; status?: FuelWalkInStatus }) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.findFuelWalkIns(input);
        if (res.success && res.data?.fuelWalkIns) {
          setFuelWalkIns(res.data.fuelWalkIns);
        }
        return res;
      }, '주유 워크인 목록을 불러오는데 실패했습니다.'),
    [withLoading, setFuelWalkIns]
  );

  // ============================================================================
  // Mutations
  // ============================================================================

  const createFuelWalkIn = useCallback(
    async (input: CreateFuelWalkInInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.createFuelWalkIn(input);
        if (res.success && res.data?.fuelWalkIn) {
          addFuelWalkIn(res.data.fuelWalkIn);
        }
        return res;
      }, '주유 워크인 등록에 실패했습니다.'),
    [withLoading, addFuelWalkIn]
  );

  const attachFuelPayment = useCallback(
    async (input: AttachFuelPaymentInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.attachFuelPayment(input);
        if (res.success && res.data?.fuelWalkIn) {
          updateFuelWalkInInContext(input.fuelWalkInId, res.data.fuelWalkIn);
        }
        return res;
      }, '주유 결제 연결에 실패했습니다.'),
    [withLoading, updateFuelWalkInInContext]
  );

  const completeFuelWalkIn = useCallback(
    async (input: CompleteFuelWalkInInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.completeFuelWalkIn(input);
        if (res.success && res.data?.fuelWalkIn) {
          updateFuelWalkInInContext(input.fuelWalkInId, res.data.fuelWalkIn);
        }
        return res;
      }, '주유 완료 처리에 실패했습니다.'),
    [withLoading, updateFuelWalkInInContext]
  );

  const updateFuelWalkInStatus = useCallback(
    async (input: UpdateFuelWalkInStatusInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.updateFuelWalkInStatus(input);
        if (res.success && res.data?.fuelWalkIn) {
          updateFuelWalkInInContext(input.fuelWalkInId, res.data.fuelWalkIn);
        }
        return res;
      }, '주유 워크인 상태 변경에 실패했습니다.'),
    [withLoading, updateFuelWalkInInContext]
  );

  const deleteFuelWalkIn = useCallback(
    async (fuelWalkInId: number) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.deleteFuelWalkIn(fuelWalkInId);
        if (res.success) {
          removeFuelWalkIn(fuelWalkInId);
          if (currentFuelWalkIn?.id === fuelWalkInId) {
            setCurrentFuelWalkIn(null);
          }
        }
        return res;
      }, '주유 워크인 삭제에 실패했습니다.'),
    [withLoading, removeFuelWalkIn, currentFuelWalkIn, setCurrentFuelWalkIn]
  );

  const bulkDeleteFuelWalkIns = useCallback(
    async (fuelWalkInIds: number[]) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.bulkDeleteFuelWalkIns(fuelWalkInIds);
        if (res.success) {
          fuelWalkInIds.forEach((id) => removeFuelWalkIn(id));
          if (
            currentFuelWalkIn &&
            fuelWalkInIds.includes(currentFuelWalkIn.id)
          ) {
            setCurrentFuelWalkIn(null);
          }
        }
        return res;
      }, '주유 워크인 다건 삭제에 실패했습니다.'),
    [withLoading, removeFuelWalkIn, currentFuelWalkIn, setCurrentFuelWalkIn]
  );

  // ─── 패키지 ───────────────────────────────────────────────────────────────

  const createFuelWalkInPackage = useCallback(
    async (input: CreateFuelWalkInPackageInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.createFuelWalkInPackage(input);
      }, '주유+세차 패키지 등록에 실패했습니다.'),
    [withLoading]
  );

  const attachPackagePayment = useCallback(
    async (input: AttachPackagePaymentInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.attachPackagePayment(input);
      }, '패키지 결제 연결에 실패했습니다.'),
    [withLoading]
  );

  const updatePackageStatus = useCallback(
    async (input: UpdatePackageStatusInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.updatePackageStatus(input);
      }, '패키지 상태 변경에 실패했습니다.'),
    [withLoading]
  );

  // ============================================================================
  // 클라이언트 사이드 필터링
  // ============================================================================

  const filteredFuelWalkIns = useCallback(() => {
    let result = [...fuelWalkIns];
    if (filters.storeId !== undefined)
      result = result.filter((f) => f.storeId === filters.storeId);
    if (filters.status !== undefined)
      result = result.filter((f) => f.status === filters.status);
    return result;
  }, [fuelWalkIns, filters]);

  return {
    ...context,

    // Queries
    fetchFuelWalkIns,
    filteredFuelWalkIns,

    // Mutations
    createFuelWalkIn,
    attachFuelPayment,
    completeFuelWalkIn,
    updateFuelWalkInStatus,
    deleteFuelWalkIn,
    bulkDeleteFuelWalkIns,

    // 패키지
    createFuelWalkInPackage,
    attachPackagePayment,
    updatePackageStatus,

    // 편의 값
    fuelWalkIns,
    currentFuelWalkIn,
    filters,
  };
};

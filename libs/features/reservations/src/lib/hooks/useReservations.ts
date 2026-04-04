import { useCallback, useRef } from 'react';
import { useReservationsContext } from '../context';
import { getReservationsService } from '../services';
import type {
  ApiResponse,
  CreateRefundPolicyInput,
  CreateReservableServiceInput,
  FindReservableServicesInput,
  UpdateRefundPolicyInput,
  UpdateReservableServiceInput,
  CreateReservationInput,
  UpdateReservationStatusInput,
  CancelReservationInput,
  CheckInReservationInput,
  CheckOutReservationInput,
  ReviewReservationApprovalInput,
  CreateWalkInInput,
  UpdateWalkInStatusInput,
  FindReservationsInput,
  GenerateSlotsInput,
  CreateScheduleTemplateInput,
  CreateScheduleBlockedDateInput,
  CreateServiceResourceInput,
  UpdateServiceResourceInput,
  WalkInStatus,
  FindScheduleBlockedDatesInput,
  UpdateScheduleBlockedDateInput,
} from '../types';

export const useReservations = () => {
  const context = useReservationsContext();

  const {
    setReservations,
    addReservation,
    updateReservationInContext,
    removeReservation, // ← 추가
    setCurrentReservation,
    setAvailableSlots,
    setWalkIns,
    updateWalkInInContext,
    setLoading,
    setError,
    clearError,
    setPagination,
    isLoading: contextIsLoading,
    reservations,
    currentReservation,
    availableSlots,
    walkIns,
    filters,
    pagination,
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

  const fetchReservationById = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.getReservationById(id);
        if (res.success && res.data) {
          setCurrentReservation(res.data);
          updateReservationInContext(id, res.data);
        }
        return res;
      }, '예약 정보를 불러오는데 실패했습니다.'),
    [withLoading, setCurrentReservation, updateReservationInContext]
  );

  const fetchReservations = useCallback(
    async (input: FindReservationsInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.listReservations(input);
        if (res.success && res.data) {
          setReservations(res.data.reservations ?? []);
          setPagination({
            total: res.data.total ?? 0,
            page: res.data.page ?? 1,
            limit: res.data.limit ?? 20,
            totalPages: res.data.totalPages ?? 0,
          });
        }
        return res;
      }, '예약 목록을 불러오는데 실패했습니다.'),
    [withLoading, setReservations, setPagination]
  );

  const fetchAvailableSlots = useCallback(
    async (serviceId: number, date: string) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.findAvailableSlots(serviceId, date);
        if (res.success && res.data) {
          setAvailableSlots(res.data);
        }
        return res;
      }, '예약 가능 슬롯을 불러오는데 실패했습니다.'),
    [withLoading, setAvailableSlots]
  );

  const fetchServiceResources = useCallback(
    // ← 신규
    async (serviceId: number) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.findServiceResources(serviceId);
      }, '자원 목록을 불러오는데 실패했습니다.'),
    [withLoading]
  );

  const fetchScheduleTemplates = useCallback(
    // ← 신규
    async (serviceId: number) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.findScheduleTemplates(serviceId);
      }, '스케줄 템플릿을 불러오는데 실패했습니다.'),
    [withLoading]
  );

  // ← 인자 구조 변경: serviceId → FindScheduleBlockedDatesInput
  const fetchScheduleBlockedDates = useCallback(
    async (input: FindScheduleBlockedDatesInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.findScheduleBlockedDates(input);
      }, '휴무일 목록을 불러오는데 실패했습니다.'),
    [withLoading]
  );

  // ← 신규
  const updateScheduleBlockedDate = useCallback(
    async (input: UpdateScheduleBlockedDateInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.updateScheduleBlockedDate(input);
      }, '휴무일 수정에 실패했습니다.'),
    [withLoading]
  );

  // ← 신규
  const bulkDeleteScheduleBlockedDates = useCallback(
    async (ids: number[]) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.bulkDeleteScheduleBlockedDates(ids);
      }, '휴무일 다건 삭제에 실패했습니다.'),
    [withLoading]
  );

  // ← 신규 추가
  const fetchReservableServices = useCallback(
    async (input: FindReservableServicesInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.findReservableServices(input);
      }, '예약 서비스 목록을 불러오는데 실패했습니다.'),
    [withLoading]
  );

  // ← 신규 추가
  const fetchRefundPolicies = useCallback(
    async () =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.findRefundPolicies();
      }, '환불 정책 목록을 불러오는데 실패했습니다.'),
    [withLoading]
  );

  const createRefundPolicy = useCallback(
    async (input: CreateRefundPolicyInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.createRefundPolicy(input);
      }, '환불 정책 생성에 실패했습니다.'),
    [withLoading]
  );

  const updateRefundPolicy = useCallback(
    async (input: UpdateRefundPolicyInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.updateRefundPolicy(input);
      }, '환불 정책 수정에 실패했습니다.'),
    [withLoading]
  );

  const deleteRefundPolicy = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.deleteRefundPolicy(id);
      }, '환불 정책 삭제에 실패했습니다.'),
    [withLoading]
  );

  // ← 신규 추가
  const createReservableService = useCallback(
    async (input: CreateReservableServiceInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.createReservableService(input);
      }, '예약 서비스 생성에 실패했습니다.'),
    [withLoading]
  );

  const updateReservableService = useCallback(
    async (input: UpdateReservableServiceInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.updateReservableService(input);
      }, '예약 서비스 수정에 실패했습니다.'),
    [withLoading]
  );

  const deleteReservableService = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.deleteReservableService(id);
      }, '예약 서비스 삭제에 실패했습니다.'),
    [withLoading]
  );

  const fetchWalkIns = useCallback(
    async (input: {
      storeId?: number;
      serviceId?: number;
      status?: WalkInStatus;
    }) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.findWalkIns(input);
        if (res.success && res.data?.walkIns) {
          setWalkIns(res.data.walkIns);
        }
        return res;
      }, '워크인 목록을 불러오는데 실패했습니다.'),
    [withLoading, setWalkIns]
  );

  // ============================================================================
  // Mutations — 예약
  // ============================================================================

  const createReservation = useCallback(
    async (input: CreateReservationInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.createReservation(input);
        if (res.success && res.data?.reservation) {
          addReservation(res.data.reservation);
        }
        return res;
      }, '예약 생성에 실패했습니다.'),
    [withLoading, addReservation]
  );

  const updateReservationStatus = useCallback(
    async (input: UpdateReservationStatusInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.updateReservationStatus(input);
        if (res.success && res.data?.reservation) {
          updateReservationInContext(input.reservationId, res.data.reservation);
        }
        return res;
      }, '예약 상태 변경에 실패했습니다.'),
    [withLoading, updateReservationInContext]
  );

  const cancelReservation = useCallback(
    async (input: CancelReservationInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.cancelReservation(input);
        if (res.success && res.data?.reservation) {
          updateReservationInContext(input.reservationId, res.data.reservation);
        }
        return res;
      }, '예약 취소에 실패했습니다.'),
    [withLoading, updateReservationInContext]
  );

  const checkInReservation = useCallback(
    async (input: CheckInReservationInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.checkInReservation(input);
        if (res.success && res.data?.reservation) {
          updateReservationInContext(input.reservationId, res.data.reservation);
        }
        return res;
      }, '체크인 처리에 실패했습니다.'),
    [withLoading, updateReservationInContext]
  );

  const checkOutReservation = useCallback(
    async (input: CheckOutReservationInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.checkOutReservation(input);
        if (res.success && res.data?.reservation) {
          updateReservationInContext(input.reservationId, res.data.reservation);
        }
        return res;
      }, '체크아웃 처리에 실패했습니다.'),
    [withLoading, updateReservationInContext]
  );

  const deleteReservation = useCallback(
    // ← 신규
    async (reservationId: number) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.deleteReservation(reservationId);
        if (res.success) {
          removeReservation(reservationId);
          if (currentReservation?.id === reservationId) {
            setCurrentReservation(null);
          }
        }
        return res;
      }, '예약 삭제에 실패했습니다.'),
    [withLoading, removeReservation, currentReservation, setCurrentReservation]
  );

  const bulkDeleteReservations = useCallback(
    // ← 신규
    async (reservationIds: number[]) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.bulkDeleteReservations(reservationIds);
        if (res.success) {
          reservationIds.forEach((id) => removeReservation(id));
          if (
            currentReservation &&
            reservationIds.includes(currentReservation.id)
          ) {
            setCurrentReservation(null);
          }
        }
        return res;
      }, '예약 다건 삭제에 실패했습니다.'),
    [withLoading, removeReservation, currentReservation, setCurrentReservation]
  );

  const reviewApproval = useCallback(
    async (input: ReviewReservationApprovalInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.reviewReservationApproval(input);
      }, '예약 승인 처리에 실패했습니다.'),
    [withLoading]
  );

  // ============================================================================
  // Mutations — 워크인
  // ============================================================================

  const createWalkIn = useCallback(
    async (input: CreateWalkInInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.createWalkIn(input);
        if (res.success && res.data?.walkIn) {
          setWalkIns([res.data.walkIn, ...walkIns]);
        }
        return res;
      }, '워크인 등록에 실패했습니다.'),
    [withLoading, setWalkIns, walkIns]
  );

  const updateWalkInStatus = useCallback(
    async (input: UpdateWalkInStatusInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.updateWalkInStatus(input);
        if (res.success && res.data?.walkIn) {
          updateWalkInInContext(input.walkInId, res.data.walkIn);
        }
        return res;
      }, '워크인 상태 변경에 실패했습니다.'),
    [withLoading, updateWalkInInContext]
  );

  const deleteWalkIn = useCallback(
    // ← 신규
    async (walkInId: number) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.deleteWalkIn(walkInId);
        if (res.success) {
          setWalkIns(walkIns.filter((w) => w.id !== walkInId));
        }
        return res;
      }, '워크인 삭제에 실패했습니다.'),
    [withLoading, setWalkIns, walkIns]
  );

  const bulkDeleteWalkIns = useCallback(
    // ← 신규
    async (walkInIds: number[]) =>
      withLoading(async () => {
        const service = getReservationsService();
        const res = await service.bulkDeleteWalkIns(walkInIds);
        if (res.success) {
          setWalkIns(walkIns.filter((w) => !walkInIds.includes(w.id)));
        }
        return res;
      }, '워크인 다건 삭제에 실패했습니다.'),
    [withLoading, setWalkIns, walkIns]
  );

  // ============================================================================
  // Mutations — 스케줄 / 자원
  // ============================================================================

  const generateSlots = useCallback(
    async (input: GenerateSlotsInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.generateSlots(input);
      }, '슬롯 생성에 실패했습니다.'),
    [withLoading]
  );

  const createScheduleTemplate = useCallback(
    async (input: CreateScheduleTemplateInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.createScheduleTemplate(input);
      }, '스케줄 템플릿 생성에 실패했습니다.'),
    [withLoading]
  );

  const deactivateScheduleTemplate = useCallback(
    // ← 신규
    async (id: number) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.deactivateScheduleTemplate(id);
      }, '스케줄 템플릿 비활성화에 실패했습니다.'),
    [withLoading]
  );

  const createScheduleBlockedDate = useCallback(
    // ← 신규
    async (input: CreateScheduleBlockedDateInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.createScheduleBlockedDate(input);
      }, '휴무일 등록에 실패했습니다.'),
    [withLoading]
  );

  const deleteScheduleBlockedDate = useCallback(
    // ← 신규
    async (id: number) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.deleteScheduleBlockedDate(id);
      }, '휴무일 삭제에 실패했습니다.'),
    [withLoading]
  );

  const createServiceResource = useCallback(
    async (input: CreateServiceResourceInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.createServiceResource(input);
      }, '자원 생성에 실패했습니다.'),
    [withLoading]
  );

  const updateServiceResource = useCallback(
    async (input: UpdateServiceResourceInput) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.updateServiceResource(input);
      }, '자원 수정에 실패했습니다.'),
    [withLoading]
  );

  const deactivateServiceResource = useCallback(
    // ← 신규
    async (id: number) =>
      withLoading(async () => {
        const service = getReservationsService();
        return service.deactivateServiceResource(id);
      }, '자원 비활성화에 실패했습니다.'),
    [withLoading]
  );

  // ============================================================================
  // 클라이언트 사이드 필터링
  // ============================================================================

  const filteredReservations = useCallback(() => {
    let result = [...reservations];
    if (filters.storeId !== undefined)
      result = result.filter((r) => r.storeId === filters.storeId);
    if (filters.userId !== undefined)
      result = result.filter((r) => r.userId === filters.userId);
    if (filters.status !== undefined)
      result = result.filter((r) => r.status === filters.status);
    if (filters.isWalkIn !== undefined)
      result = result.filter((r) => r.isWalkIn === filters.isWalkIn);
    if (filters.dateFrom)
      result = result.filter((r) => r.reservedDate >= filters.dateFrom!);
    if (filters.dateTo)
      result = result.filter((r) => r.reservedDate <= filters.dateTo!);
    return result;
  }, [reservations, filters]);

  return {
    ...context,

    // Queries
    fetchReservationById,
    fetchReservations,
    fetchAvailableSlots,
    fetchServiceResources,
    fetchScheduleTemplates,
    fetchScheduleBlockedDates, // ← 추가
    fetchReservableServices, // ← 추가
    fetchRefundPolicies, // ← 추가
    bulkDeleteScheduleBlockedDates, // ← 신규
    fetchWalkIns,
    filteredReservations,

    // Mutations — ReservableService  ← 추가
    createReservableService,
    updateReservableService,
    deleteReservableService,

    // Mutations — 예약
    createReservation,
    updateReservationStatus,
    cancelReservation,
    checkInReservation,
    checkOutReservation,
    deleteReservation,
    bulkDeleteReservations,
    reviewApproval,

    // Mutations — 워크인
    createWalkIn,
    updateWalkInStatus,
    deleteWalkIn,
    bulkDeleteWalkIns,

    // Mutations — 스케줄/자원
    generateSlots,
    createScheduleTemplate,
    deactivateScheduleTemplate,
    createScheduleBlockedDate,
    deleteScheduleBlockedDate,
    updateScheduleBlockedDate, // ← 신규
    createServiceResource,
    updateServiceResource,
    deactivateServiceResource,

    // Mutations — RefundPolicy     ← 추가
    createRefundPolicy,
    updateRefundPolicy,
    deleteRefundPolicy,

    // 편의 값
    reservations,
    currentReservation,
    availableSlots,
    walkIns,
    filters,
    pagination,
  };
};

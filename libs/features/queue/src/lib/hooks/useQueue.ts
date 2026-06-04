import { useCallback, useRef } from 'react';
import type { ApiResponse, UpdateQueueSessionInput } from '../types';
import { useQueueContext } from '../context';
import { getQueueService } from '../services';
import type {
  CreateQueueSessionInput,
  CallNextInput,
  CompleteServiceInput,
  CancelTicketInput,
  FindQueueSessionsInput,
} from '../types';

export const useQueue = () => {
  const context = useQueueContext();
  const {
    integratedStats,
    currentStats,
    currentSession,
    sessions,
    isLoading,
    error,
    setCurrentSession,
    setSessions,
    setLoading,
    setError,
    clearError,
    loadIntegratedStats,
    loadQueueStats,
  } = context;

  const isLoadingRef = useRef(isLoading);
  isLoadingRef.current = isLoading;

  // ── 공통 로딩 래퍼 ──────────────────────────────────────────────────────────

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
        setError(defaultErrorMessage);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setError]
  );

  // ── 회원 접수 ───────────────────────────────────────────────────────────────

  const createQueueSession = useCallback(
    async (input: CreateQueueSessionInput) =>
      withLoading(async () => {
        const service = getQueueService();
        const res = await service.createQueueSession(input);
        if (res.success && res.data?.session) {
          setCurrentSession(res.data.session);
        }
        return res;
      }, '세차 접수에 실패했습니다.'),
    [withLoading, setCurrentSession]
  );

  // ✅ 비회원 접수 (키오스크 / 고객 앱 비로그인)
  const createGuestQueueSession = useCallback(
    async (input: CreateQueueSessionInput) =>
      withLoading(async () => {
        const service = getQueueService();
        const res = await service.createGuestQueueSession(input);
        if (res.success && res.data?.session) {
          setCurrentSession(res.data.session);
        }
        return res;
      }, '비회원 접수에 실패했습니다.'),
    [withLoading, setCurrentSession]
  );

  // ✅ 관리자 수기 등록
  const createQueueSessionByAdmin = useCallback(
    async (input: CreateQueueSessionInput) =>
      withLoading(async () => {
        const service = getQueueService();
        const res = await service.createQueueSessionByAdmin(input);
        if (res.success && res.data?.session) {
          setCurrentSession(res.data.session);
        }
        return res;
      }, '수기 등록에 실패했습니다.'),
    [withLoading, setCurrentSession]
  );

  // ✅ 비회원 정보 수정 (status 변경 없음)
  const updateQueueSession = useCallback(
    async (input: UpdateQueueSessionInput) =>
      withLoading(async () => {
        const service = getQueueService();
        const res = await service.updateQueueSession(input);
        if (res.success && res.data?.session) {
          setCurrentSession(res.data.session);
        }
        return res;
      }, '세션 수정에 실패했습니다.'),
    [withLoading, setCurrentSession]
  );

  // ── 다음 호출 ───────────────────────────────────────────────────────────────

  const callNext = useCallback(
    async (input: CallNextInput) =>
      withLoading(async () => {
        const service = getQueueService();
        const res = await service.callNext(input);
        if (res.success) {
          await loadQueueStats(input.storeId);
        }
        return res;
      }, '다음 호출에 실패했습니다.'),
    [withLoading, loadQueueStats]
  );

  // ── 서비스 완료 ─────────────────────────────────────────────────────────────

  const completeQueueService = useCallback(
    async (input: CompleteServiceInput) =>
      withLoading(async () => {
        const service = getQueueService();
        const res = await service.completeQueueService(input);
        if (res.success) {
          await loadQueueStats(input.storeId);
        }
        return res;
      }, '서비스 완료 처리에 실패했습니다.'),
    [withLoading, loadQueueStats]
  );

  // ── 티켓 취소 ───────────────────────────────────────────────────────────────

  const cancelQueueTicket = useCallback(
    async (input: CancelTicketInput) =>
      withLoading(async () => {
        const service = getQueueService();
        const res = await service.cancelQueueTicket(input);
        if (res.success) {
          setCurrentSession(null);
          await loadQueueStats(input.storeId);
        }
        return res;
      }, '취소에 실패했습니다.'),
    [withLoading, setCurrentSession, loadQueueStats]
  );

  // ── 세션 목록 조회 ──────────────────────────────────────────────────────────

  const fetchQueueSessions = useCallback(
    async (input: FindQueueSessionsInput) =>
      withLoading(async () => {
        const service = getQueueService();
        const res = await service.findQueueSessions(input);
        if (res.success && res.data?.sessions) {
          setSessions(res.data.sessions);
        }
        return res;
      }, '세션 목록을 불러오는데 실패했습니다.'),
    [withLoading, setSessions]
  );

  // ── 계산된 값 ───────────────────────────────────────────────────────────────

  const fastestStore =
    integratedStats.length > 0
      ? integratedStats
          .filter((s) => s.isOpen)
          .reduce<(typeof integratedStats)[0] | null>(
            (min, s) => (!min || s.waitingCount < min.waitingCount ? s : min),
            null
          )
      : null;

  const totalWaiting = integratedStats.reduce(
    (sum, s) => sum + s.waitingCount,
    0
  );

  return {
    // 상태
    integratedStats,
    currentStats,
    currentSession,
    sessions,
    isLoading,
    error,
    // 계산값
    fastestStore,
    totalWaiting,
    // 조회
    loadIntegratedStats,
    loadQueueStats,
    fetchQueueSessions,
    // ✅ 3가지 접수 채널
    createQueueSession,
    createGuestQueueSession,
    createQueueSessionByAdmin,
    // ✅ 비회원 정보 수정
    updateQueueSession,
    // 상태 변경 (전용 Mutation)
    callNext,
    completeQueueService,
    cancelQueueTicket,
  };
};

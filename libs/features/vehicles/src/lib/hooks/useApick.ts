import { useCallback, useRef, useMemo } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { VehiclesService } from '../services';
import { useApickContext } from '../context/apick.context';
import type { ApiResponse } from '../types';
import type {
  FloodDamageCheckResult,
  ScrapStatusCheckResult,
  SaleStatusCheckResult,
  GetApickFloodHistoryOutput,
  GetApickScrapHistoryOutput,
  GetApickSaleHistoryOutput,
  GetApickStatsOutput,
  SearchApickHistoryOutput,
  DeleteApickHistoryOutput,
  ApickAccountInfo,
  CheckFloodDamageInput,
  CheckScrapStatusInput,
  CheckSaleStatusInput,
  GetApickFloodHistoryInput,
  GetApickScrapHistoryInput,
  GetApickSaleHistoryInput,
  SearchApickHistoryInput,
  GetApickStatsInput,
  DeleteApickHistoryInput,
} from '../types';

export const useApick = () => {
  const client = useApolloClient();
  const service = useMemo(() => new VehiclesService(client), [client]);

  const context = useApickContext();
  const {
    setFloodHistory,
    setScrapHistory,
    setSaleHistory,
    setSearchResult,
    setStats,
    setAccountInfo,
    setLoading,
    setError,
    clearError,
    isLoading: contextIsLoading,
    floodHistory,
    scrapHistory,
    saleHistory,
    searchResult,
    stats,
    accountInfo,
  } = context;

  const isLoadingRef = useRef(contextIsLoading);
  isLoadingRef.current = contextIsLoading;

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

  // ── Queries ──────────────────────────────────────────────────────────────────

  const fetchFloodHistory = useCallback(
    async (
      input?: GetApickFloodHistoryInput
    ): Promise<ApiResponse<GetApickFloodHistoryOutput>> =>
      withLoading(async () => {
        const res = await service.adminFloodHistory(input);
        if (res.success && res.data) setFloodHistory(res.data);
        return res;
      }, '침수차 조회 이력을 불러오는데 실패했습니다.'),
    [withLoading, setFloodHistory, service]
  );

  const fetchScrapHistory = useCallback(
    async (
      input?: GetApickScrapHistoryInput
    ): Promise<ApiResponse<GetApickScrapHistoryOutput>> =>
      withLoading(async () => {
        const res = await service.adminScrapHistory(input);
        if (res.success && res.data) setScrapHistory(res.data);
        return res;
      }, '폐차사고처리 이력을 불러오는데 실패했습니다.'),
    [withLoading, setScrapHistory, service]
  );

  const fetchSaleHistory = useCallback(
    async (
      input?: GetApickSaleHistoryInput
    ): Promise<ApiResponse<GetApickSaleHistoryOutput>> =>
      withLoading(async () => {
        const res = await service.adminSaleHistory(input);
        if (res.success && res.data) setSaleHistory(res.data);
        return res;
      }, '매매용 차량 이력을 불러오는데 실패했습니다.'),
    [withLoading, setSaleHistory, service]
  );

  const searchApickHistory = useCallback(
    async (
      input: SearchApickHistoryInput
    ): Promise<ApiResponse<SearchApickHistoryOutput>> =>
      withLoading(async () => {
        const res = await service.searchApickHistory(input);
        if (res.success && res.data?.result) setSearchResult(res.data.result);
        return res;
      }, 'Apick 통합 검색에 실패했습니다.'),
    [withLoading, setSearchResult, service]
  );

  const fetchApickStats = useCallback(
    async (
      input?: GetApickStatsInput
    ): Promise<ApiResponse<GetApickStatsOutput>> =>
      withLoading(async () => {
        const res = await service.apickComprehensiveStats(input);
        if (res.success && res.data?.stats) setStats(res.data.stats);
        return res;
      }, 'Apick 통계를 불러오는데 실패했습니다.'),
    [withLoading, setStats, service]
  );

  const fetchApickAccountInfo = useCallback(
    async (): Promise<ApiResponse<ApickAccountInfo>> =>
      withLoading(async () => {
        const res = await service.apickAccountInfo();
        if (res.success && res.data) setAccountInfo(res.data);
        return res;
      }, 'Apick 계정 정보를 불러오는데 실패했습니다.'),
    [withLoading, setAccountInfo, service]
  );

  const checkApickHealth = useCallback(
    async (): Promise<ApiResponse<string>> =>
      withLoading(
        () => service.apickHealthCheck(),
        'Apick 서비스 상태 확인에 실패했습니다.'
      ),
    [withLoading, service]
  );

  // ── Mutations ─────────────────────────────────────────────────────────────────

  const checkFloodDamage = useCallback(
    async (
      input: CheckFloodDamageInput
    ): Promise<ApiResponse<FloodDamageCheckResult>> =>
      withLoading(
        () => service.checkFloodDamage(input),
        '침수차 여부 조회에 실패했습니다.'
      ),
    [withLoading, service]
  );

  const checkScrapStatus = useCallback(
    async (
      input: CheckScrapStatusInput
    ): Promise<ApiResponse<ScrapStatusCheckResult>> =>
      withLoading(
        () => service.checkScrapStatus(input),
        '폐차사고처리 여부 조회에 실패했습니다.'
      ),
    [withLoading, service]
  );

  const checkSaleStatus = useCallback(
    async (
      input: CheckSaleStatusInput
    ): Promise<ApiResponse<SaleStatusCheckResult>> =>
      withLoading(
        () => service.checkSaleStatus(input),
        '매매용 차량 여부 조회에 실패했습니다.'
      ),
    [withLoading, service]
  );

  const deleteFloodHistory = useCallback(
    async (id: number): Promise<ApiResponse<boolean>> =>
      withLoading(
        () => service.adminDeleteFloodHistory(id),
        '침수차 이력 삭제에 실패했습니다.'
      ),
    [withLoading, service]
  );

  const deleteFloodHistoryBulk = useCallback(
    async (
      input: DeleteApickHistoryInput
    ): Promise<ApiResponse<DeleteApickHistoryOutput>> =>
      withLoading(
        () => service.adminDeleteFloodHistoryBulk(input),
        '침수차 이력 일괄 삭제에 실패했습니다.'
      ),
    [withLoading, service]
  );

  const deleteScrapHistory = useCallback(
    async (id: number): Promise<ApiResponse<boolean>> =>
      withLoading(
        () => service.adminDeleteScrapHistory(id),
        '폐차사고처리 이력 삭제에 실패했습니다.'
      ),
    [withLoading, service]
  );

  const deleteScrapHistoryBulk = useCallback(
    async (
      input: DeleteApickHistoryInput
    ): Promise<ApiResponse<DeleteApickHistoryOutput>> =>
      withLoading(
        () => service.adminDeleteScrapHistoryBulk(input),
        '폐차사고처리 이력 일괄 삭제에 실패했습니다.'
      ),
    [withLoading, service]
  );

  const deleteSaleHistory = useCallback(
    async (id: number): Promise<ApiResponse<boolean>> =>
      withLoading(
        () => service.adminDeleteSaleHistory(id),
        '매매용 차량 이력 삭제에 실패했습니다.'
      ),
    [withLoading, service]
  );

  const deleteSaleHistoryBulk = useCallback(
    async (
      input: DeleteApickHistoryInput
    ): Promise<ApiResponse<DeleteApickHistoryOutput>> =>
      withLoading(
        () => service.adminDeleteSaleHistoryBulk(input),
        '매매용 차량 이력 일괄 삭제에 실패했습니다.'
      ),
    [withLoading, service]
  );

  const updateApickDailyStats = useCallback(
    async (
      input?: GetApickStatsInput
    ): Promise<ApiResponse<GetApickStatsOutput>> =>
      withLoading(async () => {
        const res = await service.updateApickDailyStats(input);
        if (res.success && res.data?.stats) setStats(res.data.stats);
        return res;
      }, 'Apick 일일 통계 업데이트에 실패했습니다.'),
    [withLoading, setStats, service]
  );

  return {
    ...context,
    floodHistory,
    scrapHistory,
    saleHistory,
    searchResult,
    stats,
    accountInfo,
    // Queries
    fetchFloodHistory,
    fetchScrapHistory,
    fetchSaleHistory,
    searchApickHistory,
    fetchApickStats,
    fetchApickAccountInfo,
    checkApickHealth,
    // Mutations
    checkFloodDamage,
    checkScrapStatus,
    checkSaleStatus,
    deleteFloodHistory,
    deleteFloodHistoryBulk,
    deleteScrapHistory,
    deleteScrapHistoryBulk,
    deleteSaleHistory,
    deleteSaleHistoryBulk,
    updateApickDailyStats,
  };
};

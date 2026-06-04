import { useCallback, useRef } from 'react';
import type { ApiResponse } from '../types';
import type {
  CreatePromotionInput,
  UpdatePromotionInput,
  DeletePromotionInput,
  BulkDeletePromotionsInput,
  ChangePromotionStatusInput,
  GetPromotionsInput,
} from '../types';
import { usePromotionsContext } from '../context';
import { getPromotionsService } from '../services';

export const usePromotions = () => {
  const context = usePromotionsContext();

  const {
    setPromotions,
    addPromotion,
    updatePromotionInContext,
    removePromotion,
    setSummaryStats,
    setPagination,
    setLoading,
    setError,
    clearError,
    isLoading: contextIsLoading,
  } = context;

  const isLoadingRef = useRef(contextIsLoading);
  isLoadingRef.current = contextIsLoading;

  // 공통 로딩 래퍼
  const withLoading = useCallback(
    async <T>(
      operation: () => Promise<ApiResponse<T>>,
      defaultErrorMessage: string
    ): Promise<ApiResponse<T>> => {
      try {
        if (!isLoadingRef.current) {
          setLoading(true);
        }
        clearError();

        const res = await operation();

        if (!res.success) {
          const msg = (res as any).error?.message ?? defaultErrorMessage;
          setError(msg);
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

  // ===== Queries =====

  const fetchPromotionById = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getPromotionsService();
        return await service.getPromotionById(id);
      }, '프로모션 정보를 불러오는데 실패했습니다.'),
    [withLoading]
  );

  const fetchPromotions = useCallback(
    async (input: GetPromotionsInput) =>
      withLoading(async () => {
        const service = getPromotionsService();
        const res = await service.getPromotions(input);

        if (res.success && res.data) {
          setPromotions(res.data.items);
          setPagination({
            page: res.data.page,
            limit: res.data.limit,
            total: res.data.total,
            totalPages: res.data.totalPages,
          });
        }
        return res;
      }, '프로모션 목록을 불러오는데 실패했습니다.'),
    [withLoading, setPromotions, setPagination]
  );

  const fetchPromotionSummaryStats = useCallback(
    async () =>
      withLoading(async () => {
        const service = getPromotionsService();
        const res = await service.getPromotionSummaryStats();

        if (res.success && res.data) {
          setSummaryStats(res.data);
        }
        return res;
      }, '프로모션 통계를 불러오는데 실패했습니다.'),
    [withLoading, setSummaryStats]
  );

  // ===== Mutations =====

  const createPromotion = useCallback(
    async (input: CreatePromotionInput) =>
      withLoading(async () => {
        const service = getPromotionsService();
        const res = await service.createPromotion(input);

        if (res.success && res.data) {
          addPromotion(res.data);
        }
        return res;
      }, '프로모션 생성에 실패했습니다.'),
    [withLoading, addPromotion]
  );

  const updatePromotion = useCallback(
    async (input: UpdatePromotionInput) =>
      withLoading(async () => {
        const service = getPromotionsService();
        const res = await service.updatePromotion(input);

        if (res.success && res.data) {
          updatePromotionInContext(input.id, res.data);
        }
        return res;
      }, '프로모션 수정에 실패했습니다.'),
    [withLoading, updatePromotionInContext]
  );

  const deletePromotion = useCallback(
    async (input: DeletePromotionInput) =>
      withLoading(async () => {
        const service = getPromotionsService();
        const res = await service.deletePromotion(input);

        if (res.success) {
          removePromotion(input.id);
        }
        return res;
      }, '프로모션 삭제에 실패했습니다.'),
    [withLoading, removePromotion]
  );

  const bulkDeletePromotions = useCallback(
    async (input: BulkDeletePromotionsInput) =>
      withLoading(async () => {
        const service = getPromotionsService();
        const res = await service.bulkDeletePromotions(input);

        if (res.success && res.data) {
          res.data.deletedIds.forEach((id) => removePromotion(id));
        }
        return res;
      }, '프로모션 일괄 삭제에 실패했습니다.'),
    [withLoading, removePromotion]
  );

  const changePromotionStatus = useCallback(
    async (input: ChangePromotionStatusInput) =>
      withLoading(async () => {
        const service = getPromotionsService();
        const res = await service.changePromotionStatus(input);

        if (res.success && res.data?.promotion) {
          updatePromotionInContext(input.id, res.data.promotion);
        }
        return res;
      }, '프로모션 상태 변경에 실패했습니다.'),
    [withLoading, updatePromotionInContext]
  );

  return {
    ...context,

    // Queries
    fetchPromotionById,
    fetchPromotions,
    fetchPromotionSummaryStats,

    // Mutations
    createPromotion,
    updatePromotion,
    deletePromotion,
    bulkDeletePromotions,
    changePromotionStatus,
  };
};

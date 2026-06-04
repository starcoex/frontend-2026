import { useCallback, useRef } from 'react';
import type { ApiResponse, GetGeneralScopesInput } from '../types';
import type {
  GetReviewsInput,
  CreateReviewInput,
  VoteReviewInput,
  CreateCommentInput,
  ChangeReviewStatusInput,
  DeleteReviewInput,
  BulkDeleteReviewsInput,
  ChangeCommentStatusInput,
  CreateGeneralReviewScopeInput,
  UpdateGeneralReviewScopeInput,
  ReviewTargetType,
} from '../types';
import { useReviewsContext } from '../context';
import { getReviewsService } from '../services';

export const useReviews = () => {
  const context = useReviewsContext();

  const {
    setReviews,
    addReview,
    updateReviewInContext,
    removeReview,
    setSummaryStats,
    setGeneralReviewScopes,
    addGeneralReviewScope,
    updateGeneralReviewScopeInContext,
    removeGeneralReviewScope,
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

  const fetchReviewById = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getReviewsService();
        return await service.getReviewById(id);
      }, '리뷰 정보를 불러오는데 실패했습니다.'),
    [withLoading]
  );

  const fetchReviews = useCallback(
    async (input: GetReviewsInput) =>
      withLoading(async () => {
        const service = getReviewsService();
        const res = await service.getReviews(input);

        if (res.success && res.data) {
          setReviews(res.data.items);
          setPagination({
            page: res.data.page,
            limit: res.data.limit,
            total: res.data.total,
            totalPages: res.data.totalPages,
          });
        }
        return res;
      }, '리뷰 목록을 불러오는데 실패했습니다.'),
    [withLoading, setReviews, setPagination]
  );

  const fetchReviewSummaryStats = useCallback(
    async () =>
      withLoading(async () => {
        const service = getReviewsService();
        const res = await service.getReviewSummaryStats();

        if (res.success && res.data) {
          setSummaryStats(res.data);
        }
        return res;
      }, '리뷰 통계를 불러오는데 실패했습니다.'),
    [withLoading, setSummaryStats]
  );

  const fetchReviewsByTarget = useCallback(
    async (targetType: ReviewTargetType, targetId: number) =>
      withLoading(async () => {
        const service = getReviewsService();
        return await service.reviewsByTarget(targetType, targetId);
      }, '대상 리뷰 목록을 불러오는데 실패했습니다.'),
    [withLoading]
  );

  const fetchMyReviews = useCallback(
    async (limit?: number) =>
      withLoading(async () => {
        const service = getReviewsService();
        return await service.myReviews(limit);
      }, '내 리뷰 목록을 불러오는데 실패했습니다.'),
    [withLoading]
  );

  const fetchGeneralReviewScopes = useCallback(
    async (isActive?: boolean) =>
      withLoading(async () => {
        const service = getReviewsService();
        const res = await service.getGeneralReviewScopes(isActive);

        if (res.success && res.data) {
          setGeneralReviewScopes(res.data);
        }
        return res;
      }, '일반 리뷰 스코프 목록을 불러오는데 실패했습니다.'),
    [withLoading, setGeneralReviewScopes]
  );

  const fetchGeneralReviewScopeById = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getReviewsService();
        return await service.getGeneralReviewScopeById(id);
      }, '일반 리뷰 스코프 정보를 불러오는데 실패했습니다.'),
    [withLoading]
  );

  const fetchGeneralScopes = useCallback(
    async (input?: GetGeneralScopesInput) =>
      withLoading(async () => {
        const service = getReviewsService();
        const res = await service.getGeneralScopes(input);

        if (res.success && res.data) {
          setGeneralReviewScopes(res.data.items);
        }
        return res;
      }, '일반 리뷰 스코프 목록을 불러오는데 실패했습니다.'),
    [withLoading, setGeneralReviewScopes]
  );

  const fetchGeneralScope = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getReviewsService();
        return await service.getGeneralScope(id);
      }, '일반 리뷰 스코프 정보를 불러오는데 실패했습니다.'),
    [withLoading]
  );

  // ===== Mutations =====

  const createReview = useCallback(
    async (input: CreateReviewInput) =>
      withLoading(async () => {
        const service = getReviewsService();
        const res = await service.createReview(input);

        if (res.success && res.data?.review) {
          addReview(res.data.review);
        }
        return res;
      }, '리뷰 생성에 실패했습니다.'),
    [withLoading, addReview]
  );

  const voteReview = useCallback(
    async (input: VoteReviewInput) =>
      withLoading(async () => {
        const service = getReviewsService();
        const res = await service.voteReview(input);

        if (res.success && res.data) {
          updateReviewInContext(input.reviewId, {
            helpfulCount: res.data.helpfulCount,
            notHelpfulCount: res.data.notHelpfulCount,
          });
        }
        return res;
      }, '리뷰 투표에 실패했습니다.'),
    [withLoading, updateReviewInContext]
  );

  const createReviewComment = useCallback(
    async (input: CreateCommentInput) =>
      withLoading(async () => {
        const service = getReviewsService();
        return await service.createReviewComment(input);
      }, '댓글 생성에 실패했습니다.'),
    [withLoading]
  );

  const changeReviewStatus = useCallback(
    async (input: ChangeReviewStatusInput) =>
      withLoading(async () => {
        const service = getReviewsService();
        const res = await service.changeReviewStatus(input);

        if (res.success && res.data?.review) {
          updateReviewInContext(input.id, res.data.review);
        }
        return res;
      }, '리뷰 상태 변경에 실패했습니다.'),
    [withLoading, updateReviewInContext]
  );

  const deleteReview = useCallback(
    async (input: DeleteReviewInput) =>
      withLoading(async () => {
        const service = getReviewsService();
        const res = await service.deleteReview(input);

        if (res.success) {
          removeReview(input.id);
        }
        return res;
      }, '리뷰 삭제에 실패했습니다.'),
    [withLoading, removeReview]
  );

  const bulkDeleteReviews = useCallback(
    async (input: BulkDeleteReviewsInput) =>
      withLoading(async () => {
        const service = getReviewsService();
        const res = await service.bulkDeleteReviews(input);

        if (res.success && res.data) {
          res.data.deletedIds.forEach((id) => removeReview(id));
        }
        return res;
      }, '리뷰 일괄 삭제에 실패했습니다.'),
    [withLoading, removeReview]
  );

  const changeCommentStatus = useCallback(
    async (input: ChangeCommentStatusInput) =>
      withLoading(async () => {
        const service = getReviewsService();
        return await service.changeCommentStatus(input);
      }, '댓글 상태 변경에 실패했습니다.'),
    [withLoading]
  );

  const createGeneralReviewScope = useCallback(
    async (input: CreateGeneralReviewScopeInput) =>
      withLoading(async () => {
        const service = getReviewsService();
        const res = await service.createGeneralReviewScope(input);

        if (res.success && res.data) {
          addGeneralReviewScope(res.data);
        }
        return res;
      }, '일반 리뷰 스코프 생성에 실패했습니다.'),
    [withLoading, addGeneralReviewScope]
  );

  const updateGeneralReviewScope = useCallback(
    async (input: UpdateGeneralReviewScopeInput) =>
      withLoading(async () => {
        const service = getReviewsService();
        const res = await service.updateGeneralReviewScope(input);

        if (res.success && res.data) {
          updateGeneralReviewScopeInContext(input.id, res.data);
        }
        return res;
      }, '일반 리뷰 스코프 수정에 실패했습니다.'),
    [withLoading, updateGeneralReviewScopeInContext]
  );

  const deleteGeneralReviewScope = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getReviewsService();
        const res = await service.deleteGeneralReviewScope(id);

        if (res.success) {
          removeGeneralReviewScope(id);
        }
        return res;
      }, '일반 리뷰 스코프 삭제에 실패했습니다.'),
    [withLoading, removeGeneralReviewScope]
  );

  return {
    ...context,

    // Queries
    fetchReviewById,
    fetchReviews,
    fetchReviewSummaryStats,
    fetchReviewsByTarget,
    fetchMyReviews,
    fetchGeneralReviewScopes,
    fetchGeneralReviewScopeById,
    fetchGeneralScopes, // ✅ 신규
    fetchGeneralScope, // ✅ 신규

    // Mutations
    createReview,
    voteReview,
    createReviewComment,
    changeReviewStatus,
    deleteReview,
    bulkDeleteReviews,
    changeCommentStatus,
    createGeneralReviewScope,
    updateGeneralReviewScope,
    deleteGeneralReviewScope,
  };
};

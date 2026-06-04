import { useCallback, useRef } from 'react';
import type { ApiResponse } from '../types';
import { useNoticesContext } from '../context';
import { getNoticesService } from '../services';
import type {
  GetNoticesInput,
  CreateNoticeInput,
  UpdateNoticeInput,
  PublishNoticeInput,
  ArchiveNoticeInput,
  DeleteNoticeInput,
  BulkDeleteNoticesInput,
  GetManualsInput,
  CreateManualCategoryInput,
  UpdateManualCategoryInput,
  CreateManualInput,
  UpdateManualInput,
  PublishManualInput,
  ArchiveManualInput,
  DeleteManualInput,
  BulkDeleteManualsInput,
  NoticeBusinessType,
} from '../types';

export const useNotices = () => {
  const context = useNoticesContext();

  const {
    setNotices,
    addNotice,
    updateNoticeInContext,
    removeNotice,
    setCurrentNotice,
    setNoticeFilters,
    setNoticeStats,
    setManuals,
    addManual,
    updateManualInContext,
    removeManual,
    setCurrentManual,
    setManualCategories,
    setManualFilters,
    setManualStats,
    setLoading,
    setError,
    clearError,
    isLoading: contextIsLoading,
    notices,
    currentNotice,
    noticeFilters,
    noticeStats,
    manuals,
    currentManual,
    manualCategories,
    manualFilters,
    manualStats,
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
  // Notice Queries
  // ============================================================================

  const fetchNotices = useCallback(
    async (input: GetNoticesInput = {}) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.getNotices(input);
        if (res.success && res.data) setNotices(res.data.notices);
        return res;
      }, '공지 목록을 불러오는데 실패했습니다.'),
    [withLoading, setNotices]
  );

  const fetchAdminNotices = useCallback(
    async (input: GetNoticesInput = {}) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.getAdminNotices(input);
        if (res.success && res.data) setNotices(res.data.notices);
        return res;
      }, '관리자 공지 목록을 불러오는데 실패했습니다.'),
    [withLoading, setNotices]
  );

  const fetchNoticeById = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.getNoticeById(id);
        if (res.success && res.data) {
          setCurrentNotice(res.data);
          updateNoticeInContext(id, res.data);
        }
        return res;
      }, '공지를 불러오는데 실패했습니다.'),
    [withLoading, setCurrentNotice, updateNoticeInContext]
  );

  const fetchPublishedNotices = useCallback(
    async (targetApp?: string) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.getPublishedNotices(targetApp);
        if (res.success && res.data) setNotices(res.data);
        return res;
      }, '발행된 공지를 불러오는데 실패했습니다.'),
    [withLoading, setNotices]
  );

  const fetchNoticeStats = useCallback(
    async () =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.getNoticeStats();
        if (res.success && res.data) setNoticeStats(res.data);
        return res;
      }, '공지 통계를 불러오는데 실패했습니다.'),
    [withLoading, setNoticeStats]
  );

  // ============================================================================
  // Notice Mutations
  // ============================================================================

  const createNotice = useCallback(
    async (input: CreateNoticeInput) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.createNotice(input);
        if (res.success && res.data?.notice) addNotice(res.data.notice);
        return res;
      }, '공지 생성에 실패했습니다.'),
    [withLoading, addNotice]
  );

  const updateNotice = useCallback(
    async (input: UpdateNoticeInput) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.updateNotice(input);
        if (res.success && res.data?.notice)
          updateNoticeInContext(input.id, res.data.notice);
        return res;
      }, '공지 수정에 실패했습니다.'),
    [withLoading, updateNoticeInContext]
  );

  const publishNotice = useCallback(
    async (input: PublishNoticeInput) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.publishNotice(input);
        if (res.success && res.data?.notice)
          updateNoticeInContext(input.id, res.data.notice);
        return res;
      }, '공지 발행에 실패했습니다.'),
    [withLoading, updateNoticeInContext]
  );

  const archiveNotice = useCallback(
    async (input: ArchiveNoticeInput) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.archiveNotice(input);
        if (res.success && res.data?.notice)
          updateNoticeInContext(input.id, res.data.notice);
        return res;
      }, '공지 종료에 실패했습니다.'),
    [withLoading, updateNoticeInContext]
  );

  const deleteNotice = useCallback(
    async (input: DeleteNoticeInput) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.deleteNotice(input);
        if (res.success) {
          removeNotice(input.id);
          if (currentNotice?.id === input.id) setCurrentNotice(null);
        }
        return res;
      }, '공지 삭제에 실패했습니다.'),
    [withLoading, removeNotice, currentNotice, setCurrentNotice]
  );

  const bulkDeleteNotices = useCallback(
    async (input: BulkDeleteNoticesInput) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.bulkDeleteNotices(input);
        if (res.success && res.data?.successCount) {
          // failedIds 제외 삭제 처리
          const deletedIds = input.ids.filter(
            (id) => !(res.data!.failedIds ?? []).includes(id)
          );
          deletedIds.forEach((id) => removeNotice(id));
          if (currentNotice && deletedIds.includes(currentNotice.id)) {
            setCurrentNotice(null);
          }
        }
        return res;
      }, '공지 일괄 삭제에 실패했습니다.'),
    [withLoading, removeNotice, currentNotice, setCurrentNotice]
  );

  const createNoticeFromSuggestion = useCallback(
    async (
      suggestionId: number,
      suggestionTitle: string,
      suggestionContent: string
    ) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.createNoticeFromSuggestion(
          suggestionId,
          suggestionTitle,
          suggestionContent
        );
        if (res.success && res.data?.notice) addNotice(res.data.notice);
        return res;
      }, '건의사항으로부터 공지 생성에 실패했습니다.'),
    [withLoading, addNotice]
  );

  // ============================================================================
  // Manual Category
  // ============================================================================

  const fetchManualCategories = useCallback(
    async (targetBusiness?: NoticeBusinessType, targetApp?: string) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.getManualCategories(
          targetBusiness,
          targetApp
        );
        if (res.success && res.data) setManualCategories(res.data);
        return res;
      }, '매뉴얼 카테고리를 불러오는데 실패했습니다.'),
    [withLoading, setManualCategories]
  );

  const fetchAdminManualCategories = useCallback(
    async (targetBusiness?: NoticeBusinessType, targetApp?: string) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.getAdminManualCategories(
          targetBusiness,
          targetApp
        );
        if (res.success && res.data) setManualCategories(res.data);
        return res;
      }, '관리자 매뉴얼 카테고리를 불러오는데 실패했습니다.'),
    [withLoading, setManualCategories]
  );

  const createManualCategory = useCallback(
    async (input: CreateManualCategoryInput) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.createManualCategory(input);
        if (res.success && res.data?.category) {
          setManualCategories([...manualCategories, res.data.category]);
        }
        return res;
      }, '매뉴얼 카테고리 생성에 실패했습니다.'),
    [withLoading, setManualCategories, manualCategories]
  );

  const updateManualCategory = useCallback(
    async (input: UpdateManualCategoryInput) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.updateManualCategory(input);
        if (res.success && res.data?.category) {
          setManualCategories(
            manualCategories.map((c) =>
              c.id === input.id ? { ...c, ...res.data!.category! } : c
            )
          );
        }
        return res;
      }, '매뉴얼 카테고리 수정에 실패했습니다.'),
    [withLoading, setManualCategories, manualCategories]
  );

  const deleteManualCategory = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.deleteManualCategory(id);
        if (res.success)
          setManualCategories(manualCategories.filter((c) => c.id !== id));
        return res;
      }, '매뉴얼 카테고리 삭제에 실패했습니다.'),
    [withLoading, setManualCategories, manualCategories]
  );

  // ============================================================================
  // Manual
  // ============================================================================

  const fetchManuals = useCallback(
    async (input: GetManualsInput = {}) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.getManuals(input);
        if (res.success && res.data) setManuals(res.data.manuals);
        return res;
      }, '매뉴얼 목록을 불러오는데 실패했습니다.'),
    [withLoading, setManuals]
  );

  const fetchAdminManuals = useCallback(
    async (input: GetManualsInput = {}) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.getAdminManuals(input);
        if (res.success && res.data) setManuals(res.data.manuals);
        return res;
      }, '관리자 매뉴얼 목록을 불러오는데 실패했습니다.'),
    [withLoading, setManuals]
  );

  const fetchManualById = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.getManualById(id);
        if (res.success && res.data) {
          setCurrentManual(res.data);
          updateManualInContext(id, res.data);
        }
        return res;
      }, '매뉴얼을 불러오는데 실패했습니다.'),
    [withLoading, setCurrentManual, updateManualInContext]
  );

  const fetchPublishedManuals = useCallback(
    async (
      targetBusiness: NoticeBusinessType,
      targetApp: string,
      categoryId?: number
    ) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.getPublishedManuals(
          targetBusiness,
          targetApp,
          categoryId
        );
        if (res.success && res.data) setManuals(res.data);
        return res;
      }, '발행된 매뉴얼을 불러오는데 실패했습니다.'),
    [withLoading, setManuals]
  );

  const fetchManualHistories = useCallback(
    async (manualId: number) =>
      withLoading(async () => {
        const service = getNoticesService();
        return await service.getManualHistories(manualId);
      }, '매뉴얼 히스토리를 불러오는데 실패했습니다.'),
    [withLoading]
  );

  const fetchManualStats = useCallback(
    async () =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.getManualStats();
        if (res.success && res.data) setManualStats(res.data);
        return res;
      }, '매뉴얼 통계를 불러오는데 실패했습니다.'),
    [withLoading, setManualStats]
  );

  const createManual = useCallback(
    async (input: CreateManualInput) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.createManual(input);
        if (res.success && res.data?.manual) addManual(res.data.manual);
        return res;
      }, '매뉴얼 생성에 실패했습니다.'),
    [withLoading, addManual]
  );

  const updateManual = useCallback(
    async (input: UpdateManualInput) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.updateManual(input);
        if (res.success && res.data?.manual)
          updateManualInContext(input.id, res.data.manual);
        return res;
      }, '매뉴얼 수정에 실패했습니다.'),
    [withLoading, updateManualInContext]
  );

  const publishManual = useCallback(
    async (input: PublishManualInput) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.publishManual(input);
        if (res.success && res.data?.manual)
          updateManualInContext(input.id, res.data.manual);
        return res;
      }, '매뉴얼 발행에 실패했습니다.'),
    [withLoading, updateManualInContext]
  );

  const archiveManual = useCallback(
    async (input: ArchiveManualInput) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.archiveManual(input);
        if (res.success && res.data?.manual)
          updateManualInContext(input.id, res.data.manual);
        return res;
      }, '매뉴얼 종료에 실패했습니다.'),
    [withLoading, updateManualInContext]
  );

  const deleteManual = useCallback(
    async (input: DeleteManualInput) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.deleteManual(input);
        if (res.success) {
          removeManual(input.id);
          if (currentManual?.id === input.id) setCurrentManual(null);
        }
        return res;
      }, '매뉴얼 삭제에 실패했습니다.'),
    [withLoading, removeManual, currentManual, setCurrentManual]
  );

  const bulkDeleteManuals = useCallback(
    async (input: BulkDeleteManualsInput) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.bulkDeleteManuals(input);
        if (res.success && res.data?.successCount) {
          const deletedIds = input.ids.filter(
            (id) => !(res.data!.failedIds ?? []).includes(id)
          );
          deletedIds.forEach((id) => removeManual(id));
          if (currentManual && deletedIds.includes(currentManual.id)) {
            setCurrentManual(null);
          }
        }
        return res;
      }, '매뉴얼 일괄 삭제에 실패했습니다.'),
    [withLoading, removeManual, currentManual, setCurrentManual]
  );

  return {
    ...context,

    // Notice Queries
    fetchNotices,
    fetchAdminNotices,
    fetchNoticeById,
    fetchPublishedNotices,
    fetchNoticeStats,

    // Notice Mutations
    createNotice,
    updateNotice,
    publishNotice,
    archiveNotice,
    deleteNotice,
    bulkDeleteNotices,
    createNoticeFromSuggestion,

    // Manual Category
    fetchManualCategories,
    fetchAdminManualCategories,
    createManualCategory,
    updateManualCategory,
    deleteManualCategory,

    // Manual
    fetchManuals,
    fetchAdminManuals,
    fetchManualById,
    fetchPublishedManuals,
    fetchManualHistories,
    fetchManualStats,
    createManual,
    updateManual,
    publishManual,
    archiveManual,
    deleteManual,
    bulkDeleteManuals,

    // 편의 값
    notices,
    currentNotice,
    noticeFilters,
    noticeStats,
    manuals,
    currentManual,
    manualCategories,
    manualFilters,
    manualStats,
    setNoticeFilters,
    setManualFilters,
  };
};

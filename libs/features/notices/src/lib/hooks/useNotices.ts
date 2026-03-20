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
  GetManualsInput,
  CreateManualCategoryInput,
  UpdateManualCategoryInput,
  CreateManualInput,
  UpdateManualInput,
  PublishManualInput,
  ArchiveManualInput,
  BusinessType,
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
    setManuals,
    addManual,
    updateManualInContext,
    removeManual,
    setCurrentManual,
    setManualCategories,
    setManualFilters,
    setLoading,
    setError,
    clearError,
    isLoading: contextIsLoading,
    notices,
    currentNotice,
    noticeFilters,
    manuals,
    currentManual,
    manualCategories,
    manualFilters,
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
        if (res.success && res.data) {
          setNotices(res.data.notices);
        }
        return res;
      }, '공지 목록을 불러오는데 실패했습니다.'),
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
        if (res.success && res.data) {
          setNotices(res.data);
        }
        return res;
      }, '발행된 공지를 불러오는데 실패했습니다.'),
    [withLoading, setNotices]
  );

  // ============================================================================
  // Notice Mutations
  // ============================================================================

  const createNotice = useCallback(
    async (input: CreateNoticeInput) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.createNotice(input);
        if (res.success && res.data?.notice) {
          addNotice(res.data.notice);
        }
        return res;
      }, '공지 생성에 실패했습니다.'),
    [withLoading, addNotice]
  );

  const updateNotice = useCallback(
    async (input: UpdateNoticeInput) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.updateNotice(input);
        if (res.success && res.data?.notice) {
          updateNoticeInContext(input.id, res.data.notice);
        }
        return res;
      }, '공지 수정에 실패했습니다.'),
    [withLoading, updateNoticeInContext]
  );

  const publishNotice = useCallback(
    async (input: PublishNoticeInput) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.publishNotice(input);
        if (res.success && res.data?.notice) {
          updateNoticeInContext(input.id, res.data.notice);
        }
        return res;
      }, '공지 발행에 실패했습니다.'),
    [withLoading, updateNoticeInContext]
  );

  const archiveNotice = useCallback(
    async (input: ArchiveNoticeInput) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.archiveNotice(input);
        if (res.success && res.data?.notice) {
          updateNoticeInContext(input.id, res.data.notice);
        }
        return res;
      }, '공지 종료에 실패했습니다.'),
    [withLoading, updateNoticeInContext]
  );

  const deleteNotice = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.deleteNotice(id);
        if (res.success) {
          removeNotice(id);
          if (currentNotice?.id === id) setCurrentNotice(null);
        }
        return res;
      }, '공지 삭제에 실패했습니다.'),
    [withLoading, removeNotice, currentNotice, setCurrentNotice]
  );

  const deleteNotices = useCallback(
    async (ids: number[]) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.deleteNotices(ids);
        if (res.success) {
          ids.forEach((id) => removeNotice(id));
          if (currentNotice && ids.includes(currentNotice.id)) {
            setCurrentNotice(null);
          }
        }
        return res;
      }, '공지 다건 삭제에 실패했습니다.'),
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
        if (res.success && res.data?.notice) {
          addNotice(res.data.notice);
        }
        return res;
      }, '건의사항으로부터 공지 생성에 실패했습니다.'),
    [withLoading, addNotice]
  );

  // ============================================================================
  // Manual Category
  // ============================================================================

  const fetchManualCategories = useCallback(
    async (targetBusiness?: BusinessType, targetApp?: string) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.getManualCategories(
          targetBusiness,
          targetApp
        );
        if (res.success && res.data) {
          setManualCategories(res.data);
        }
        return res;
      }, '매뉴얼 카테고리를 불러오는데 실패했습니다.'),
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
        if (res.success) {
          setManualCategories(manualCategories.filter((c) => c.id !== id));
        }
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
        if (res.success && res.data) {
          setManuals(res.data.manuals);
        }
        return res;
      }, '매뉴얼 목록을 불러오는데 실패했습니다.'),
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
      targetBusiness: BusinessType,
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
        if (res.success && res.data) {
          setManuals(res.data);
        }
        return res;
      }, '발행된 매뉴얼을 불러오는데 실패했습니다.'),
    [withLoading, setManuals]
  );

  const createManual = useCallback(
    async (input: CreateManualInput) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.createManual(input);
        if (res.success && res.data?.manual) {
          addManual(res.data.manual);
        }
        return res;
      }, '매뉴얼 생성에 실패했습니다.'),
    [withLoading, addManual]
  );

  const updateManual = useCallback(
    async (input: UpdateManualInput) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.updateManual(input);
        if (res.success && res.data?.manual) {
          updateManualInContext(input.id, res.data.manual);
        }
        return res;
      }, '매뉴얼 수정에 실패했습니다.'),
    [withLoading, updateManualInContext]
  );

  const publishManual = useCallback(
    async (input: PublishManualInput) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.publishManual(input);
        if (res.success && res.data?.manual) {
          updateManualInContext(input.id, res.data.manual);
        }
        return res;
      }, '매뉴얼 발행에 실패했습니다.'),
    [withLoading, updateManualInContext]
  );

  const archiveManual = useCallback(
    async (input: ArchiveManualInput) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.archiveManual(input);
        if (res.success && res.data?.manual) {
          updateManualInContext(input.id, res.data.manual);
        }
        return res;
      }, '매뉴얼 종료에 실패했습니다.'),
    [withLoading, updateManualInContext]
  );

  const deleteManual = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getNoticesService();
        const res = await service.deleteManual(id);
        if (res.success) {
          removeManual(id);
          if (currentManual?.id === id) setCurrentManual(null);
        }
        return res;
      }, '매뉴얼 삭제에 실패했습니다.'),
    [withLoading, removeManual, currentManual, setCurrentManual]
  );

  return {
    ...context,

    // Notice Queries
    fetchNotices,
    fetchNoticeById,
    fetchPublishedNotices,

    // Notice Mutations
    createNotice,
    updateNotice,
    publishNotice,
    archiveNotice,
    deleteNotice,
    deleteNotices,
    createNoticeFromSuggestion,

    // Manual Category
    fetchManualCategories,
    createManualCategory,
    updateManualCategory,
    deleteManualCategory,

    // Manual
    fetchManuals,
    fetchManualById,
    fetchPublishedManuals,
    createManual,
    updateManual,
    publishManual,
    archiveManual,
    deleteManual,

    // 편의 값
    notices,
    currentNotice,
    noticeFilters,
    manuals,
    currentManual,
    manualCategories,
    manualFilters,
    setNoticeFilters,
    setManualFilters,
  };
};

import { useCallback, useRef } from 'react';
import type { ApiResponse } from '../types';
import { useSuggestionsContext } from '../context';
import { getSuggestionsService } from '../services';
import type {
  CreateSuggestionInput,
  UpdateSuggestionInput,
  UpdateSuggestionStatusInput,
  GetSuggestionsInput,
} from '../types';

export const useSuggestions = () => {
  const context = useSuggestionsContext();

  const {
    setSuggestions,
    addSuggestion,
    updateSuggestionInContext,
    removeSuggestion,
    setCurrentSuggestion,
    setFilters,
    setLoading,
    setError,
    clearError,
    isLoading: contextIsLoading,
    filters,
    suggestions,
    currentSuggestion,
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

  const fetchSuggestions = useCallback(
    async (input?: GetSuggestionsInput) =>
      withLoading(async () => {
        const service = getSuggestionsService();
        // ✅ input이 명시적으로 전달되면 filters 무시, 없을 때만 filters 사용
        const queryInput = input !== undefined ? input : filters;
        const res = await service.getSuggestions(queryInput);

        // const res = await service.getSuggestions(input ?? filters);

        if (res.success && res.data) {
          const { suggestions: list, ...pagination } = res.data;
          setSuggestions(list, pagination);
        }
        return res;
      }, '건의사항 목록을 불러오는데 실패했습니다.'),
    [withLoading, setSuggestions, filters]
  );

  const fetchMySuggestions = useCallback(
    async (input?: GetSuggestionsInput) =>
      withLoading(async () => {
        const service = getSuggestionsService();
        const res = await service.getMySuggestions(input ?? filters);

        if (res.success && res.data) {
          const { suggestions: list, ...pagination } = res.data;
          setSuggestions(list, pagination);
        }
        return res;
      }, '내 건의사항 목록을 불러오는데 실패했습니다.'),
    [withLoading, setSuggestions, filters]
  );

  const fetchSuggestionById = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getSuggestionsService();
        const res = await service.getSuggestion(id);

        if (res.success && res.data) {
          setCurrentSuggestion(res.data);
        }
        return res;
      }, '건의사항을 불러오는데 실패했습니다.'),
    [withLoading, setCurrentSuggestion]
  );

  // ============================================================================
  // Mutations
  // ============================================================================

  const createSuggestion = useCallback(
    async (input: CreateSuggestionInput) =>
      withLoading(async () => {
        const service = getSuggestionsService();
        const res = await service.createSuggestion(input);

        if (res.success && res.data?.suggestion) {
          addSuggestion(res.data.suggestion);
        }
        return res;
      }, '건의사항 생성에 실패했습니다.'),
    [withLoading, addSuggestion]
  );

  const updateSuggestion = useCallback(
    async (input: UpdateSuggestionInput) =>
      withLoading(async () => {
        const service = getSuggestionsService();
        const res = await service.updateSuggestion(input);

        if (res.success && res.data?.suggestion) {
          updateSuggestionInContext(input.id, res.data.suggestion);
        }
        return res;
      }, '건의사항 수정에 실패했습니다.'),
    [withLoading, updateSuggestionInContext]
  );

  const updateSuggestionStatus = useCallback(
    async (input: UpdateSuggestionStatusInput) =>
      withLoading(async () => {
        const service = getSuggestionsService();
        const res = await service.updateSuggestionStatus(input);

        if (res.success && res.data?.suggestion) {
          // ✅ currentSuggestion + suggestions 목록 둘 다 갱신
          updateSuggestionInContext(input.id, res.data.suggestion);
          setCurrentSuggestion(res.data.suggestion);
        }
        return res;
      }, '건의사항 상태 변경에 실패했습니다.'),
    [withLoading, updateSuggestionInContext, setCurrentSuggestion]
  );

  const deleteSuggestion = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getSuggestionsService();
        const res = await service.deleteSuggestion(id);

        if (res.success) {
          removeSuggestion(id);
          if (currentSuggestion?.id === id) {
            setCurrentSuggestion(null);
          }
        }
        return res;
      }, '건의사항 삭제에 실패했습니다.'),
    [withLoading, removeSuggestion, currentSuggestion, setCurrentSuggestion]
  );

  return {
    ...context,

    // Queries
    fetchSuggestions,
    fetchMySuggestions,
    fetchSuggestionById,

    // Mutations
    createSuggestion,
    updateSuggestion,
    updateSuggestionStatus,
    deleteSuggestion,

    // 편의 값
    setFilters,
    filters,
    suggestions,
    currentSuggestion,
  };
};

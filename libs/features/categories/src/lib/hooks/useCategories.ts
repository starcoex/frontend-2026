import { useCallback, useRef } from 'react';
import type { ApiResponse } from '../types';
import { useCategoriesContext } from '../context';
import { getCategoriesService } from '../services';
import type { CreateCategoryInput, UpdateCategoryInput } from '../types';

export const useCategories = () => {
  const context = useCategoriesContext();

  const {
    setCategories,
    setCategoryTree,
    addCategory,
    updateCategoryInContext,
    removeCategory,
    setCurrentCategory,
    setLoading,
    setError,
    clearError,
    isLoading: contextIsLoading,
    categories,
    categoryTree,
    currentCategory,
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

  const fetchCategories = useCallback(
    async (parentId?: number) =>
      withLoading(async () => {
        const service = getCategoriesService();
        const res = await service.listCategories(parentId);

        if (res.success && res.data) {
          setCategories(res.data);
        }
        return res;
      }, '카테고리 목록을 불러오는데 실패했습니다.'),
    [withLoading, setCategories]
  );

  const fetchCategoryTree = useCallback(
    async (rootId?: number, maxDepth?: number) =>
      withLoading(async () => {
        const service = getCategoriesService();
        const res = await service.getCategoryTree(rootId, maxDepth);

        if (res.success && res.data) {
          setCategoryTree(res.data);
        }
        return res;
      }, '카테고리 트리를 불러오는데 실패했습니다.'),
    [withLoading, setCategoryTree]
  );

  const fetchCategoryById = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getCategoriesService();
        const res = await service.getCategoryById(id);

        if (res.success && res.data) {
          setCurrentCategory(res.data);
        }
        return res;
      }, '카테고리를 불러오는데 실패했습니다.'),
    [withLoading, setCurrentCategory]
  );

  const fetchCategoryBySlug = useCallback(
    async (slug: string) =>
      withLoading(async () => {
        const service = getCategoriesService();
        const res = await service.getCategoryBySlug(slug);

        if (res.success && res.data) {
          setCurrentCategory(res.data);
        }
        return res;
      }, '카테고리를 불러오는데 실패했습니다.'),
    [withLoading, setCurrentCategory]
  );

  // ============================================================================
  // Mutations
  // ============================================================================

  const createCategory = useCallback(
    async (input: CreateCategoryInput) =>
      withLoading(async () => {
        const service = getCategoriesService();
        const res = await service.createCategory(input);

        if (res.success && res.data?.category) {
          addCategory(res.data.category);
        }
        return res;
      }, '카테고리 생성에 실패했습니다.'),
    [withLoading, addCategory]
  );

  const updateCategory = useCallback(
    async (input: UpdateCategoryInput) =>
      withLoading(async () => {
        const service = getCategoriesService();
        const res = await service.updateCategory(input);

        if (res.success && res.data?.category) {
          updateCategoryInContext(input.id, res.data.category);
        }
        return res;
      }, '카테고리 수정에 실패했습니다.'),
    [withLoading, updateCategoryInContext]
  );

  const deleteCategory = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getCategoriesService();
        const res = await service.deleteCategory(id);

        if (res.success) {
          removeCategory(id);
          if (currentCategory?.id === id) {
            setCurrentCategory(null);
          }
        }
        return res;
      }, '카테고리 삭제에 실패했습니다.'),
    [withLoading, removeCategory, currentCategory, setCurrentCategory]
  );

  const deleteCategories = useCallback(
    async (ids: number[]) =>
      withLoading(async () => {
        const service = getCategoriesService();
        const res = await service.deleteCategories(ids);
        if (res.success) {
          ids.forEach((id) => removeCategory(id));
          if (currentCategory && ids.includes(currentCategory.id)) {
            setCurrentCategory(null);
          }
        }
        return res;
      }, '카테고리 다건 삭제에 실패했습니다.'),
    [withLoading, removeCategory, currentCategory, setCurrentCategory]
  );

  const moveCategory = useCallback(
    async (id: number, newParentId?: number) =>
      withLoading(async () => {
        const service = getCategoriesService();
        const res = await service.moveCategory(id, newParentId);

        if (res.success && res.data?.category) {
          updateCategoryInContext(id, res.data.category);
        }
        return res;
      }, '카테고리 이동에 실패했습니다.'),
    [withLoading, updateCategoryInContext]
  );

  return {
    ...context,

    // Queries
    fetchCategories,
    fetchCategoryTree,
    fetchCategoryById,
    fetchCategoryBySlug,

    // Mutations
    createCategory,
    updateCategory,
    deleteCategory,
    deleteCategories,
    moveCategory,

    // 편의 값
    categories,
    categoryTree,
    currentCategory,
  };
};

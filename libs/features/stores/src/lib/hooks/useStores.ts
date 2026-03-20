import { useCallback, useRef } from 'react';
import {
  CreateStoreInput,
  UpdateStoreInput,
  DeleteStoreInput,
  CreateBrandInput,
  UpdateBrandInput,
  DeleteBrandInput,
} from '@starcoex-frontend/graphql';
import type { ApiResponse } from '../types';
import { useStoresContext } from '../context';
import { getStoresService } from '../services';

export const useStores = () => {
  const context = useStoresContext();

  const {
    // 매장 관련
    setStores,
    addStore,
    updateStore: updateStoreInContext,
    removeStore,
    setCurrentStore,
    stores,
    currentStore,
    // 브랜드 관련
    setBrands,
    addBrand,
    updateBrand: updateBrandInContext,
    removeBrand,
    setCurrentBrand,
    brands,
    currentBrand,
    // 통계 관련
    statistics,
    setStatistics,
    // 필터 관련
    filters,
    // 공통
    setLoading,
    clearError,
    setError,
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
          const msg = res.error?.message ?? defaultErrorMessage;
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

  // ===== Store Queries =====

  /**
   * 매장 목록 조회
   */
  const fetchStores = useCallback(
    async () =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.listStores();

        if (res.success && res.data) {
          setStores(res.data);
        }
        return res;
      }, '매장 목록을 불러오는데 실패했습니다.'),
    [withLoading, setStores]
  );

  /**
   * 매장 상세 조회
   */
  const fetchStoreById = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.getStoreById(id);

        if (res.success && res.data) {
          setCurrentStore(res.data);
        }
        return res;
      }, '매장 정보를 불러오는데 실패했습니다.'),
    [withLoading, setCurrentStore]
  );

  /**
   * 매장 통계 조회
   */
  const fetchStatistics = useCallback(
    async () =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.getStoreStatistics();

        if (res.success && res.data) {
          setStatistics(res.data);
        }
        return res;
      }, '통계를 불러오는데 실패했습니다.'),
    [withLoading, setStatistics]
  );

  // ===== Brand Queries =====

  /**
   * 브랜드 목록 조회
   */
  const fetchBrands = useCallback(
    async () =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.listBrands();

        if (res.success && res.data) {
          setBrands(res.data);
        }
        return res;
      }, '브랜드 목록을 불러오는데 실패했습니다.'),
    [withLoading, setBrands]
  );

  /**
   * 브랜드 상세 조회
   */
  const fetchBrandById = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.getBrandById(id);

        if (res.success && res.data) {
          setCurrentBrand(res.data);
        }
        return res;
      }, '브랜드 정보를 불러오는데 실패했습니다.'),
    [withLoading, setCurrentBrand]
  );

  // ===== Store Mutations =====

  /**
   * 매장 생성
   */
  const createStore = useCallback(
    async (input: CreateStoreInput) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.createStore(input);

        if (res.success && res.data?.store) {
          addStore(res.data.store);
        }
        return res;
      }, '매장 생성에 실패했습니다.'),
    [withLoading, addStore]
  );

  /**
   * 매장 수정
   */
  const updateStore = useCallback(
    async (input: UpdateStoreInput) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.updateStore(input);

        if (res.success && res.data?.store) {
          updateStoreInContext(input.id, res.data.store);

          // 현재 매장이 수정된 매장이면 업데이트
          if (currentStore?.id === input.id) {
            setCurrentStore(res.data.store);
          }
        }
        return res;
      }, '매장 수정에 실패했습니다.'),
    [withLoading, updateStoreInContext, currentStore, setCurrentStore]
  );

  /**
   * 매장 삭제
   */
  const deleteStore = useCallback(
    async (input: DeleteStoreInput) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.deleteStore(input);

        if (res.success && res.data?.storeId) {
          removeStore(res.data.storeId);

          // 현재 매장이 삭제된 매장이면 초기화
          if (currentStore?.id === res.data.storeId) {
            setCurrentStore(null);
          }
        }
        return res;
      }, '매장 삭제에 실패했습니다.'),
    [withLoading, removeStore, currentStore, setCurrentStore]
  );

  const deleteStores = useCallback(
    async (ids: number[]) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.deleteStores(ids);
        if (res.success) {
          ids.forEach((id) => removeStore(id));
          if (currentStore && ids.includes(currentStore.id)) {
            setCurrentStore(null);
          }
        }
        return res;
      }, '매장 다건 삭제에 실패했습니다.'),
    [withLoading, removeStore, currentStore, setCurrentStore]
  );

  // ===== Brand Mutations =====

  /**
   * 브랜드 생성
   */
  const createBrand = useCallback(
    async (input: CreateBrandInput) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.createBrand(input);

        if (res.success && res.data?.brand) {
          addBrand(res.data.brand);
        }
        return res;
      }, '브랜드 생성에 실패했습니다.'),
    [withLoading, addBrand]
  );

  /**
   * 브랜드 수정
   */
  const updateBrand = useCallback(
    async (input: UpdateBrandInput) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.updateBrand(input);

        if (res.success && res.data?.brand) {
          updateBrandInContext(input.id, res.data.brand);

          // 현재 브랜드가 수정된 브랜드이면 업데이트
          if (currentBrand?.id === input.id) {
            setCurrentBrand(res.data.brand);
          }
        }
        return res;
      }, '브랜드 수정에 실패했습니다.'),
    [withLoading, updateBrandInContext, currentBrand, setCurrentBrand]
  );

  /**
   * 브랜드 삭제
   */
  const deleteBrand = useCallback(
    async (input: DeleteBrandInput) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.deleteBrand(input);

        if (res.success && res.data?.brandId) {
          removeBrand(res.data.brandId);

          // 현재 브랜드가 삭제된 브랜드이면 초기화
          if (currentBrand?.id === res.data.brandId) {
            setCurrentBrand(null);
          }
        }
        return res;
      }, '브랜드 삭제에 실패했습니다.'),
    [withLoading, removeBrand, currentBrand, setCurrentBrand]
  );

  const deleteBrands = useCallback(
    async (ids: number[]) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.deleteBrands(ids);
        if (res.success) {
          ids.forEach((id) => removeBrand(id));
          if (currentBrand && ids.includes(currentBrand.id)) {
            setCurrentBrand(null);
          }
        }
        return res;
      }, '브랜드 다건 삭제에 실패했습니다.'),
    [withLoading, removeBrand, currentBrand, setCurrentBrand]
  );

  // =========================================================================
  // 필터링된 매장 목록 (클라이언트 사이드)
  // =========================================================================

  const filteredStores = useCallback(() => {
    let result = [...stores];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(searchLower) ||
          s.location.toLowerCase().includes(searchLower) ||
          s.slug.toLowerCase().includes(searchLower)
      );
    }

    if (filters.brandId !== undefined) {
      result = result.filter((s) => s.brandId === filters.brandId);
    }

    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      result = result.filter((s) =>
        s.location.toLowerCase().includes(locationLower)
      );
    }

    if (filters.isActive !== undefined) {
      result = result.filter((s) => s.isActive === filters.isActive);
    }

    if (filters.isVisible !== undefined) {
      result = result.filter((s) => s.isVisible === filters.isVisible);
    }

    if (filters.pickupEnabled !== undefined) {
      result = result.filter((s) => s.pickupEnabled === filters.pickupEnabled);
    }

    if (filters.minRating !== undefined) {
      result = result.filter((s) => (s.rating ?? 0) >= filters.minRating!);
    }

    return result;
  }, [stores, filters]);

  // =========================================================================
  // 계산된 값
  // =========================================================================

  const computedValues = {
    // 전체 매장 수
    totalStores: stores.length,
    // 필터링된 매장 수
    filteredStoresCount: filteredStores().length,
    // 활성화된 매장 수
    activeStores: stores.filter((s) => s.isActive).length,
    // 노출 가능한 매장 수
    visibleStores: stores.filter((s) => s.isVisible).length,
    // 픽업 가능한 매장 수
    pickupEnabledStores: stores.filter((s) => s.pickupEnabled).length,

    // 전체 브랜드 수
    totalBrands: brands.length,
    // 활성화된 브랜드 수
    activeBrands: brands.filter((b) => b.isActive).length,

    // 통계 (명시적으로 포함)
    statistics,
  };

  return {
    ...context,
    ...computedValues,

    // Store Queries
    fetchStores,
    fetchStoreById,
    fetchStatistics,
    filteredStores,

    // Brand Queries
    fetchBrands,
    fetchBrandById,

    // Store Mutations
    createStore,
    updateStore,
    deleteStore,
    deleteStores,

    // Brand Mutations
    createBrand,
    updateBrand,
    deleteBrand,
    deleteBrands,
  };
};

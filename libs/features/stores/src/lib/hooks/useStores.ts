import { useCallback, useRef } from 'react';
import {
  CreateStoreInput,
  UpdateStoreInput,
  DeleteStoreInput,
  CreateBrandInput,
  UpdateBrandInput,
  DeleteBrandInput,
  AddStoreServiceInput,
  RemoveStoreServiceInput,
  AddStoreManagerInput,
  RemoveStoreManagerInput,
  CreateBusinessTypeInput,
  UpdateBusinessTypeInput,
  CreateServiceTypeInput,
  UpdateServiceTypeInput,
} from '@starcoex-frontend/graphql';
import type { ApiResponse } from '../types';
import { useStoresContext } from '../context';
import { getStoresService } from '../services';

export const useStores = () => {
  const context = useStoresContext();

  const {
    setStores,
    addStore,
    updateStore: updateStoreInContext,
    removeStore,
    setCurrentStore,
    stores,
    currentStore,
    setBrands,
    addBrand,
    updateBrand: updateBrandInContext,
    removeBrand,
    setCurrentBrand,
    brands,
    currentBrand,
    businessTypes,
    setBusinessTypes, // ✅ 신규
    serviceTypes,
    setServiceTypes, // ✅ 신규
    statistics,
    setStatistics,
    filters,
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

  // ===== Store Queries =====

  const fetchStores = useCallback(
    async () =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.listStores();
        if (res.success && res.data) setStores(res.data);
        return res;
      }, '매장 목록을 불러오는데 실패했습니다.'),
    [withLoading, setStores]
  );

  const fetchStoreById = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.getStoreById(id);
        if (res.success && res.data) setCurrentStore(res.data);
        return res;
      }, '매장 정보를 불러오는데 실패했습니다.'),
    [withLoading, setCurrentStore]
  );

  const fetchStatistics = useCallback(
    async () =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.getStoreStatistics();
        if (res.success && res.data) setStatistics(res.data);
        return res;
      }, '통계를 불러오는데 실패했습니다.'),
    [withLoading, setStatistics]
  );

  // ===== Brand Queries =====

  const fetchBrands = useCallback(
    async () =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.listBrands();
        if (res.success && res.data) setBrands(res.data);
        return res;
      }, '브랜드 목록을 불러오는데 실패했습니다.'),
    [withLoading, setBrands]
  );

  const fetchBrandById = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.getBrandById(id);
        if (res.success && res.data) setCurrentBrand(res.data);
        return res;
      }, '브랜드 정보를 불러오는데 실패했습니다.'),
    [withLoading, setCurrentBrand]
  );

  // ===== ServiceType Query ✅ 신규 =====

  const fetchServiceTypes = useCallback(
    async () =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.listServiceTypes();
        if (res.success && res.data) setServiceTypes(res.data);
        return res;
      }, '서비스 타입 목록을 불러오는데 실패했습니다.'),
    [withLoading, setServiceTypes]
  );

  // ===== BusinessType Queries ✅ 신규 =====

  const fetchBusinessTypes = useCallback(
    async () =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.listBusinessTypes();
        if (res.success && res.data) setBusinessTypes(res.data);
        return res;
      }, '비즈니스 타입 목록을 불러오는데 실패했습니다.'),
    [withLoading, setBusinessTypes]
  );

  // ===== Store Mutations =====

  const addStoreService = useCallback(
    async (input: AddStoreServiceInput) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.addStoreService(input);
        // 성공 시 해당 매장 재조회하여 storeServices 갱신
        if (res.success) {
          const storeRes = await service.getStoreById(input.storeId);
          if (storeRes.success && storeRes.data) {
            updateStoreInContext(input.storeId, storeRes.data);
            if (currentStore?.id === input.storeId)
              setCurrentStore(storeRes.data);
          }
        }
        return res;
      }, '서비스 추가에 실패했습니다.'),
    [withLoading, updateStoreInContext, currentStore, setCurrentStore]
  );

  const removeStoreService = useCallback(
    async (input: RemoveStoreServiceInput) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.removeStoreService(input);
        if (res.success) {
          const storeRes = await service.getStoreById(input.storeId);
          if (storeRes.success && storeRes.data) {
            updateStoreInContext(input.storeId, storeRes.data);
            if (currentStore?.id === input.storeId)
              setCurrentStore(storeRes.data);
          }
        }
        return res;
      }, '서비스 삭제에 실패했습니다.'),
    [withLoading, updateStoreInContext, currentStore, setCurrentStore]
  );

  const createStore = useCallback(
    async (input: CreateStoreInput) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.createStore(input);
        if (res.success && res.data?.store) addStore(res.data.store);
        return res;
      }, '매장 생성에 실패했습니다.'),
    [withLoading, addStore]
  );

  const updateStore = useCallback(
    async (input: UpdateStoreInput) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.updateStore(input);
        if (res.success && res.data?.store) {
          updateStoreInContext(input.id, res.data.store);
          if (currentStore?.id === input.id) setCurrentStore(res.data.store);
        }
        return res;
      }, '매장 수정에 실패했습니다.'),
    [withLoading, updateStoreInContext, currentStore, setCurrentStore]
  );

  const deleteStore = useCallback(
    async (input: DeleteStoreInput) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.deleteStore(input);
        if (res.success && res.data?.storeId) {
          removeStore(res.data.storeId);
          if (currentStore?.id === res.data.storeId) setCurrentStore(null);
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
          if (currentStore && ids.includes(currentStore.id))
            setCurrentStore(null);
        }
        return res;
      }, '매장 다건 삭제에 실패했습니다.'),
    [withLoading, removeStore, currentStore, setCurrentStore]
  );

  // ===== StoreManager Mutations ✅ 신규 =====

  const addStoreManager = useCallback(
    async (input: AddStoreManagerInput) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.addStoreManager(input);
        if (res.success) {
          const storeRes = await service.getStoreById(input.storeId);
          if (storeRes.success && storeRes.data) {
            updateStoreInContext(input.storeId, storeRes.data);
            if (currentStore?.id === input.storeId)
              setCurrentStore(storeRes.data);
          }
        }
        return res;
      }, '관리자 추가에 실패했습니다.'),
    [withLoading, updateStoreInContext, currentStore, setCurrentStore]
  );

  const removeStoreManager = useCallback(
    async (input: RemoveStoreManagerInput) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.removeStoreManager(input);
        if (res.success) {
          const storeRes = await service.getStoreById(input.storeId);
          if (storeRes.success && storeRes.data) {
            updateStoreInContext(input.storeId, storeRes.data);
            if (currentStore?.id === input.storeId)
              setCurrentStore(storeRes.data);
          }
        }
        return res;
      }, '관리자 삭제에 실패했습니다.'),
    [withLoading, updateStoreInContext, currentStore, setCurrentStore]
  );

  // ===== Brand Mutations =====

  const createBrand = useCallback(
    async (input: CreateBrandInput) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.createBrand(input);
        if (res.success && res.data?.brand) addBrand(res.data.brand);
        return res;
      }, '브랜드 생성에 실패했습니다.'),
    [withLoading, addBrand]
  );

  const updateBrand = useCallback(
    async (input: UpdateBrandInput) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.updateBrand(input);
        if (res.success && res.data?.brand) {
          updateBrandInContext(input.id, res.data.brand);
          if (currentBrand?.id === input.id) setCurrentBrand(res.data.brand);
        }
        return res;
      }, '브랜드 수정에 실패했습니다.'),
    [withLoading, updateBrandInContext, currentBrand, setCurrentBrand]
  );

  const deleteBrand = useCallback(
    async (input: DeleteBrandInput) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.deleteBrand(input);
        if (res.success && res.data?.brandId) {
          removeBrand(res.data.brandId);
          if (currentBrand?.id === res.data.brandId) setCurrentBrand(null);
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
          if (currentBrand && ids.includes(currentBrand.id))
            setCurrentBrand(null);
        }
        return res;
      }, '브랜드 다건 삭제에 실패했습니다.'),
    [withLoading, removeBrand, currentBrand, setCurrentBrand]
  );

  // ===== BusinessType Mutations (슈퍼 어드민) ✅ 신규 =====

  const createBusinessType = useCallback(
    async (input: CreateBusinessTypeInput) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.createBusinessType(input);
        if (res.success && res.data?.businessType) {
          // businessTypes 목록에 추가
          setBusinessTypes([...context.businessTypes, res.data.businessType]);
        }
        return res;
      }, '비즈니스 타입 생성에 실패했습니다.'),
    [withLoading, context.businessTypes, setBusinessTypes]
  );

  const updateBusinessType = useCallback(
    async (input: UpdateBusinessTypeInput) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.updateBusinessType(input);
        if (res.success && res.data?.businessType) {
          const updated = res.data.businessType;
          setBusinessTypes(
            context.businessTypes.map((bt) =>
              bt.id === updated.id ? updated : bt
            )
          );
        }
        return res;
      }, '비즈니스 타입 수정에 실패했습니다.'),
    [withLoading, context.businessTypes, setBusinessTypes]
  );

  // ===== ServiceType Mutations (슈퍼 어드민) ✅ 신규 =====

  // createServiceType / updateServiceType 에서 fetchBusinessTypes 대신
  // fetchServiceTypes도 함께 호출
  const createServiceType = useCallback(
    async (input: CreateServiceTypeInput) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.createServiceType(input);
        if (res.success) {
          await Promise.all([fetchBusinessTypes(), fetchServiceTypes()]);
        }
        return res;
      }, '서비스 타입 생성에 실패했습니다.'),
    [withLoading, fetchBusinessTypes, fetchServiceTypes]
  );

  const updateServiceType = useCallback(
    async (input: UpdateServiceTypeInput) =>
      withLoading(async () => {
        const service = getStoresService();
        const res = await service.updateServiceType(input);
        if (res.success) {
          await Promise.all([fetchBusinessTypes(), fetchServiceTypes()]);
        }
        return res;
      }, '서비스 타입 수정에 실패했습니다.'),
    [withLoading, fetchBusinessTypes, fetchServiceTypes]
  );

  // =========================================================================
  // 클라이언트 사이드 필터링
  // =========================================================================

  const filteredStores = useCallback(() => {
    let result = [...stores];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q) ||
          s.slug.toLowerCase().includes(q)
      );
    }

    if (filters.brandId !== undefined) {
      result = result.filter((s) => s.brandId === filters.brandId);
    }

    // businessTypeId 필터 (Store.businessTypeId 기준)
    if (filters.businessTypeId !== undefined) {
      result = result.filter(
        (s) => s.businessTypeId === filters.businessTypeId
      );
    }

    if (filters.location) {
      const q = filters.location.toLowerCase();
      result = result.filter((s) => s.location.toLowerCase().includes(q));
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
    totalStores: stores.length,
    filteredStoresCount: filteredStores().length,
    activeStores: stores.filter((s) => s.isActive).length,
    visibleStores: stores.filter((s) => s.isVisible).length,
    pickupEnabledStores: stores.filter((s) => s.pickupEnabled).length,
    totalBrands: brands.length,
    activeBrands: brands.filter((b) => b.isActive).length,
    statistics,
  };

  return {
    ...context,
    ...computedValues,

    // BusinessType Queries ✅ 신규
    fetchBusinessTypes,
    businessTypes,

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

    // StoreService Mutations ✅ 신규
    addStoreService,
    removeStoreService,

    // StoreManager Mutations ✅ 신규
    addStoreManager,
    removeStoreManager,

    // BusinessType/ServiceType Mutations ✅ 신규
    createBusinessType,
    updateBusinessType,
    createServiceType,
    updateServiceType,

    // ServiceType Query ✅ 신규
    fetchServiceTypes,
    serviceTypes,

    // Brand Mutations
    createBrand,
    updateBrand,
    deleteBrand,
    deleteBrands,
  };
};

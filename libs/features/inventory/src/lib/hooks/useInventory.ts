import { useCallback, useRef } from 'react';
import type {
  AddFuelStockInput,
  AddStockInput,
  ApiResponse,
  DispenseFuelInput,
  UpdateStoreInventoryInput,
} from '../types';
import { useInventoryContext } from '../context';
import { getInventoryService } from '../services';
import type { CreateStoreInventoryInput } from '../types';

export const useInventory = () => {
  const context = useInventoryContext();

  const {
    setInventories,
    addInventory,
    updateInventoryInContext,
    setCurrentInventory,
    setLowStockInventories,
    setLoading,
    setError,
    clearError,
    isLoading: contextIsLoading,
    inventories,
    currentInventory,
    lowStockInventories,
    filters,
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

  const fetchInventoryById = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getInventoryService();
        const res = await service.getInventoryById(id);

        if (res.success && res.data) {
          setCurrentInventory(res.data);
          updateInventoryInContext(id, res.data);
        }
        return res;
      }, '재고 정보를 불러오는데 실패했습니다.'),
    [withLoading, setCurrentInventory, updateInventoryInContext]
  );

  const fetchInventoriesByProduct = useCallback(
    async (productId: number, storeId?: number) =>
      withLoading(async () => {
        const service = getInventoryService();
        const res = await service.getInventoriesByProduct(productId, storeId);

        if (res.success && res.data) {
          setInventories(res.data);
        }
        return res;
      }, '재고 목록을 불러오는데 실패했습니다.'),
    [withLoading, setInventories]
  );

  const fetchStoreInventories = useCallback(
    async (storeId?: number) =>
      withLoading(async () => {
        const service = getInventoryService();
        const res = await service.getStoreInventories(storeId);

        if (res.success && res.data) {
          setInventories(res.data);
        }
        return res;
      }, '재고 목록을 불러오는데 실패했습니다.'),
    [withLoading, setInventories]
  );

  const fetchLowStockInventories = useCallback(
    async (storeId?: number) =>
      withLoading(async () => {
        const service = getInventoryService();
        const res = await service.getLowStockInventories(storeId);

        if (res.success && res.data) {
          setLowStockInventories(res.data);
        }
        return res;
      }, '재고 부족 목록을 불러오는데 실패했습니다.'),
    [withLoading, setLowStockInventories]
  );

  // ============================================================================
  // Mutations
  // ============================================================================

  const createInventory = useCallback(
    async (input: CreateStoreInventoryInput) =>
      withLoading(async () => {
        const service = getInventoryService();
        const res = await service.createStoreInventory(input);

        if (res.success && res.data?.inventory) {
          addInventory(res.data.inventory);
        }
        return res;
      }, '재고 생성에 실패했습니다.'),
    [withLoading, addInventory]
  );

  const updateStoreInventory = useCallback(
    async (input: UpdateStoreInventoryInput) =>
      withLoading(async () => {
        const service = getInventoryService();
        const res = await service.updateStoreInventory(input);
        if (res.success && res.data?.inventory) {
          updateInventoryInContext(input.id, res.data.inventory);
          // currentInventory도 동기화
          if (currentInventory?.id === input.id) {
            setCurrentInventory(res.data.inventory);
          }
        }
        return res;
      }, '재고 수정에 실패했습니다.'),
    [
      withLoading,
      updateInventoryInContext,
      currentInventory,
      setCurrentInventory,
    ]
  );

  const deleteStoreInventory = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getInventoryService();
        const res = await service.deleteStoreInventory(id);
        if (res.success) {
          setInventories(inventories.filter((inv) => inv.id !== id));
          if (currentInventory?.id === id) setCurrentInventory(null);
        }
        return res;
      }, '재고 삭제에 실패했습니다.'),
    [
      withLoading,
      inventories,
      setInventories,
      currentInventory,
      setCurrentInventory,
    ]
  );

  const deleteStoreInventories = useCallback(
    async (ids: number[]) =>
      withLoading(async () => {
        const service = getInventoryService();
        const res = await service.deleteStoreInventories(ids);
        if (res.success) {
          setInventories(inventories.filter((inv) => !ids.includes(inv.id)));
          if (currentInventory && ids.includes(currentInventory.id)) {
            setCurrentInventory(null);
          }
        }
        return res;
      }, '재고 다건 삭제에 실패했습니다.'),
    [
      withLoading,
      inventories,
      setInventories,
      currentInventory,
      setCurrentInventory,
    ]
  );

  const addStock = useCallback(
    async (input: AddStockInput) =>
      withLoading(async () => {
        const service = getInventoryService();
        const res = await service.addStock(input);
        if (res.success && res.data?.inventory) {
          updateInventoryInContext(res.data.inventory.id, res.data.inventory);
          if (currentInventory?.id === res.data.inventory.id) {
            setCurrentInventory(res.data.inventory);
          }
        }
        return res;
      }, '재고 입고 처리에 실패했습니다.'),
    [
      withLoading,
      updateInventoryInContext,
      currentInventory,
      setCurrentInventory,
    ]
  );

  const addFuelStock = useCallback(
    async (input: AddFuelStockInput) =>
      withLoading(async () => {
        const service = getInventoryService();
        const res = await service.addFuelStock(input);
        // 성공 시 해당 emails context 업데이트
        if (res.success && res.data?.inventory) {
          updateInventoryInContext(res.data.inventory.id, res.data.inventory);
        }
        return res;
      }, '연료 입고 처리에 실패했습니다.'),
    [withLoading, updateInventoryInContext]
  );

  const dispenseFuel = useCallback(
    async (input: DispenseFuelInput) =>
      withLoading(async () => {
        const service = getInventoryService();
        const res = await service.dispenseFuel(input);
        if (res.success && res.data?.inventory) {
          updateInventoryInContext(res.data.inventory.id, res.data.inventory);
        }
        return res;
      }, '연료 출고 처리에 실패했습니다.'),
    [withLoading, updateInventoryInContext]
  );

  // ============================================================================
  // 필터링된 재고 목록 (클라이언트 사이드)
  // ============================================================================

  const filteredInventories = useCallback(() => {
    let result = [...inventories];

    if (filters.storeId !== undefined)
      result = result.filter((inv) => inv.storeId === filters.storeId);
    if (filters.productId !== undefined)
      result = result.filter((inv) => inv.productId === filters.productId);
    if (filters.zone !== undefined)
      result = result.filter((inv) => inv.zone === filters.zone);
    if (filters.isAvailable !== undefined)
      result = result.filter((inv) => inv.isAvailable === filters.isAvailable);
    if (filters.isActive !== undefined)
      result = result.filter((inv) => inv.isActive === filters.isActive);
    if (filters.isLowStock)
      result = result.filter((inv) => inv.isLowStock === true);

    return result;
  }, [inventories, filters]);

  return {
    ...context,

    // Queries
    fetchInventoryById,
    fetchStoreInventories,
    fetchInventoriesByProduct,
    fetchLowStockInventories,
    filteredInventories,

    // Mutations
    createInventory,
    updateStoreInventory, // 신규
    deleteStoreInventory,
    deleteStoreInventories,
    addFuelStock, // 신규
    dispenseFuel, // 신규
    addStock, // 신규

    // 편의 값
    inventories,
    currentInventory,
    lowStockInventories,
    filters,
  };
};

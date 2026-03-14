import { useCallback, useRef } from 'react';
import type { ApiResponse } from '../types';
import { useProductsContext } from '../context';
import { getProductsService } from '../services';
import type {
  CreateProductInput,
  UpdateProductInput,
  CreateProductInventoryInput,
  UpdateProductInventoryInput,
} from '../types';

export const useProducts = () => {
  const context = useProductsContext();

  const {
    setProducts,
    addProduct,
    updateProductInContext,
    removeProduct,
    setCurrentProduct,
    setLoading,
    setError,
    clearError,
    isLoading: contextIsLoading,
    products,
    currentProduct,
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

  const fetchProducts = useCallback(
    async () =>
      withLoading(async () => {
        const service = getProductsService();
        const res = await service.listProducts();

        if (res.success && res.data) {
          setProducts(res.data);
        }
        return res;
      }, '제품 목록을 불러오는데 실패했습니다.'),
    [withLoading, setProducts]
  );

  const fetchProductById = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getProductsService();
        const res = await service.getProductById(id);

        if (res.success && res.data) {
          setCurrentProduct(res.data);
          // products 배열도 동기화 (재고 등 최신 데이터 반영)
          updateProductInContext(id, res.data);
        }
        return res;
      }, '제품 정보를 불러오는데 실패했습니다.'),
    [withLoading, setCurrentProduct, updateProductInContext]
  );

  const fetchProductByBarcode = useCallback(
    async (barcode: string) =>
      withLoading(async () => {
        const service = getProductsService();
        const res = await service.getProductByBarcode(barcode);

        if (res.success && res.data) {
          setCurrentProduct(res.data);
        }
        return res;
      }, '바코드로 제품을 찾는데 실패했습니다.'),
    [withLoading, setCurrentProduct]
  );

  // ============================================================================
  // Mutations
  // ============================================================================

  const createProduct = useCallback(
    async (input: CreateProductInput) =>
      withLoading(async () => {
        const service = getProductsService();
        const res = await service.createProduct(input);

        if (res.success && res.data?.product) {
          addProduct(res.data.product);
        }
        return res;
      }, '제품 생성에 실패했습니다.'),
    [withLoading, addProduct]
  );

  const updateProduct = useCallback(
    async (input: UpdateProductInput) =>
      withLoading(async () => {
        const service = getProductsService();
        const res = await service.updateProduct(input);

        if (res.success && res.data?.product) {
          updateProductInContext(input.id, res.data.product);
        }
        return res;
      }, '제품 수정에 실패했습니다.'),
    [withLoading, updateProductInContext]
  );

  const deleteProduct = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getProductsService();
        const res = await service.deleteProduct(id);

        if (res.success) {
          removeProduct(id);
          if (currentProduct?.id === id) {
            setCurrentProduct(null);
          }
        }
        return res;
      }, '제품 삭제에 실패했습니다.'),
    [withLoading, removeProduct, currentProduct, setCurrentProduct]
  );

  const createInventory = useCallback(
    async (input: CreateProductInventoryInput) =>
      withLoading(async () => {
        const service = getProductsService();
        const res = await service.createProductInventory(input);

        if (res.success && res.data) {
          const product = products.find((p) => p.id === input.productId);
          if (product) {
            updateProductInContext(input.productId, {
              inventories: [...product.inventories, res.data],
            });
          }
        }
        return res;
      }, '재고 생성에 실패했습니다.'),
    [withLoading, products, updateProductInContext]
  );

  const updateInventory = useCallback(
    async (input: UpdateProductInventoryInput) =>
      withLoading(async () => {
        const service = getProductsService();
        const res = await service.updateProductInventory(input);

        if (res.success && res.data) {
          const product = products.find((p) =>
            p.inventories.some((inv) => inv.id === input.id)
          );
          if (product) {
            updateProductInContext(product.id, {
              inventories: product.inventories.map((inv) =>
                inv.id === input.id ? res.data! : inv
              ),
            });
          }
        }
        return res;
      }, '재고 수정에 실패했습니다.'),
    [withLoading, products, updateProductInContext]
  );

  const deleteInventory = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getProductsService();
        const res = await service.deleteProductInventory(id);

        if (res.success) {
          const product = products.find((p) =>
            p.inventories.some((inv) => inv.id === id)
          );
          if (product) {
            updateProductInContext(product.id, {
              inventories: product.inventories.filter((inv) => inv.id !== id),
            });
          }
        }
        return res;
      }, '재고 삭제에 실패했습니다.'),
    [withLoading, products, updateProductInContext]
  );

  // ============================================================================
  // 필터링된 제품 목록 (클라이언트 사이드)
  // ============================================================================

  const filteredProducts = useCallback(() => {
    let result = [...products];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower) ||
          p.sku.toLowerCase().includes(searchLower)
      );
    }
    if (filters.categoryId !== undefined)
      result = result.filter((p) => p.categoryId === filters.categoryId);
    if (filters.brandId !== undefined)
      result = result.filter((p) => p.brandId === filters.brandId);
    if (filters.minPrice !== undefined)
      result = result.filter((p) => p.basePrice >= filters.minPrice!);
    if (filters.maxPrice !== undefined)
      result = result.filter((p) => p.basePrice <= filters.maxPrice!);
    if (filters.isActive !== undefined)
      result = result.filter((p) => p.isActive === filters.isActive);
    if (filters.isAvailable !== undefined)
      result = result.filter((p) => p.isAvailable === filters.isAvailable);
    if (filters.isFeatured !== undefined)
      result = result.filter((p) => p.isFeatured === filters.isFeatured);

    return result;
  }, [products, filters]);

  return {
    ...context,

    // Queries
    fetchProducts,
    fetchProductById,
    fetchProductByBarcode,
    filteredProducts,

    // Mutations
    createProduct,
    updateProduct,
    deleteProduct,
    createInventory,
    updateInventory,
    deleteInventory,

    // 편의 값
    products,
    currentProduct,
    filters,
  };
};

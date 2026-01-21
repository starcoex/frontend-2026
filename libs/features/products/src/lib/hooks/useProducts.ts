import { useCallback, useRef } from 'react';
import {
  CreateProductInput,
  UpdateProductInput,
  CreateProductInventoryInput,
  UpdateProductInventoryInput,
} from '@starcoex-frontend/graphql';
import type { ApiResponse } from '../types';
import { useProductsContext } from '../context';
import { getProductsService } from '../services';

export const useProducts = () => {
  const context = useProductsContext();

  const {
    // 제품 관련
    setProducts,
    addProduct,
    updateProduct: updateProductInContext,
    setCurrentProduct,
    products,
    currentProduct,
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

  // ===== Queries =====

  /**
   * 제품 목록 조회
   */
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

  /**
   * 제품 상세 조회
   */
  const fetchProductById = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getProductsService();
        const res = await service.findProductById(id);

        if (res.success && res.data) {
          setCurrentProduct(res.data);
        }
        return res;
      }, '제품 정보를 불러오는데 실패했습니다.'),
    [withLoading, setCurrentProduct]
  );

  // ===== Mutations =====

  /**
   * 제품 생성
   */
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

  /**
   * 제품 수정
   */
  const updateProduct = useCallback(
    async (input: UpdateProductInput) =>
      withLoading(async () => {
        const service = getProductsService();
        const res = await service.updateProduct(input);

        if (res.success && res.data?.product) {
          updateProductInContext(input.id, res.data.product);

          // 현재 제품이 수정된 제품이면 업데이트
          if (currentProduct?.id === input.id) {
            setCurrentProduct(res.data.product);
          }
        }
        return res;
      }, '제품 수정에 실패했습니다.'),
    [withLoading, updateProductInContext, currentProduct, setCurrentProduct]
  );

  /**
   * 제품 재고 생성
   */
  const createInventory = useCallback(
    async (input: CreateProductInventoryInput) =>
      withLoading(async () => {
        const service = getProductsService();
        const res = await service.createProductInventory(input);

        if (res.success && res.data) {
          // 해당 제품의 inventories 업데이트
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

  /**
   * 제품 재고 수정
   */
  const updateInventory = useCallback(
    async (input: UpdateProductInventoryInput) =>
      withLoading(async () => {
        const service = getProductsService();
        const res = await service.updateProductInventory(input);

        if (res.success && res.data) {
          // 해당 제품의 inventories 업데이트
          const product = products.find((p) =>
            p.inventories.some((inv) => inv.id === input.id)
          );
          if (product) {
            const updatedInventories = product.inventories.map((inv) =>
              inv.id === input.id ? res.data! : inv
            );
            updateProductInContext(product.id, {
              inventories: updatedInventories,
            });
          }
        }
        return res;
      }, '재고 수정에 실패했습니다.'),
    [withLoading, products, updateProductInContext]
  );

  /**
   * 제품 재고 삭제
   */
  const deleteInventory = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getProductsService();
        const res = await service.deleteProductInventory(id);

        if (res.success) {
          // 해당 제품의 inventories에서 제거
          const product = products.find((p) =>
            p.inventories.some((inv) => inv.id === id)
          );
          if (product) {
            const updatedInventories = product.inventories.filter(
              (inv) => inv.id !== id
            );
            updateProductInContext(product.id, {
              inventories: updatedInventories,
            });
          }
        }
        return res;
      }, '재고 삭제에 실패했습니다.'),
    [withLoading, products, updateProductInContext]
  );

  // =========================================================================
  // 필터링된 제품 목록 (클라이언트 사이드)
  // =========================================================================

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

    if (filters.categoryId !== undefined) {
      result = result.filter((p) => p.categoryId === filters.categoryId);
    }

    if (filters.brandId !== undefined) {
      result = result.filter((p) => p.brandId === filters.brandId);
    }

    if (filters.minPrice !== undefined) {
      result = result.filter((p) => p.basePrice >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter((p) => p.basePrice <= filters.maxPrice!);
    }

    if (filters.isActive !== undefined) {
      result = result.filter((p) => p.isActive === filters.isActive);
    }

    if (filters.isAvailable !== undefined) {
      result = result.filter((p) => p.isAvailable === filters.isAvailable);
    }

    if (filters.isFeatured !== undefined) {
      result = result.filter((p) => p.isFeatured === filters.isFeatured);
    }

    return result;
  }, [products, filters]);

  // =========================================================================
  // 계산된 값
  // =========================================================================

  const computedValues = {
    // 전체 제품 수
    totalProducts: products.length,
    // 필터링된 제품 수
    filteredProductsCount: filteredProducts().length,
    // 활성화된 제품 수
    activeProducts: products.filter((p) => p.isActive).length,
    // 판매 가능한 제품 수
    availableProducts: products.filter((p) => p.isAvailable).length,
    // 추천 제품 수
    featuredProducts: products.filter((p) => p.isFeatured).length,
    // 재고 부족 제품 (baseStock < 10)
    lowStockProducts: products.filter((p) => p.baseStock < 10).length,
  };

  return {
    ...context,
    ...computedValues,

    // Queries
    fetchProducts,
    fetchProductById,
    filteredProducts,

    // Mutations
    createProduct,
    updateProduct,
    createInventory,
    updateInventory,
    deleteInventory,
  };
};

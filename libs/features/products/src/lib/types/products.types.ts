import type { ApiResponse } from '../types';
import {
  // Inputs
  CreateProductInput,
  UpdateProductInput,
  CreateProductInventoryInput,
  UpdateProductInventoryInput,
  // Outputs
  CreateProductOutput,
  UpdateProductOutput,
  // Types
  Product,
  ProductInventory,
} from '@starcoex-frontend/graphql';

// ============================================================================
// 서비스 인터페이스
// ============================================================================
export interface IProductsService {
  // ===== Queries =====
  listProducts(): Promise<ApiResponse<Product[]>>;
  findProductById(id: number): Promise<ApiResponse<Product>>;

  // ===== Mutations =====
  createProduct(
    input: CreateProductInput
  ): Promise<ApiResponse<CreateProductOutput>>;
  updateProduct(
    input: UpdateProductInput
  ): Promise<ApiResponse<UpdateProductOutput>>;
  createProductInventory(
    input: CreateProductInventoryInput
  ): Promise<ApiResponse<ProductInventory>>;
  updateProductInventory(
    input: UpdateProductInventoryInput
  ): Promise<ApiResponse<ProductInventory>>;
  deleteProductInventory(id: number): Promise<ApiResponse<boolean>>;
}

// ============================================================================
// Context 상태 타입
// ============================================================================
export interface ProductsState {
  // 제품 목록
  products: Product[];

  // 현재 선택된 제품
  currentProduct: Product | null;

  // 필터/검색
  filters: ProductFilters;

  // 공통 로딩/에러
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// 필터 타입
// ============================================================================
export interface ProductFilters {
  search?: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  isAvailable?: boolean;
  isFeatured?: boolean;
}

// ============================================================================
// Context 액션 타입
// ============================================================================
export interface ProductsContextActions {
  // 제품 관련
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  removeProduct: (id: number) => void;
  setCurrentProduct: (product: Product | null) => void;
  loadProducts: () => Promise<void>; // 추가
  loadProductById: (id: number) => Promise<void>; // 추가

  // 필터 관련
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;

  // 공통
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

// Context 전체 타입
export type ProductsContextValue = ProductsState & ProductsContextActions;

// Re-export for convenience
export type {
  Product,
  ProductInventory,
  CreateProductInput,
  UpdateProductInput,
  CreateProductOutput,
  UpdateProductOutput,
};

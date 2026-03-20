import type { ApiResponse } from '../types';

// ============================================================================
// GraphQL 스키마 기반 타입
// ============================================================================

export interface ProductCategoryRef {
  id: number;
  name?: string;
}

export interface ProductBrandRef {
  id: number;
  name?: string;
}

export interface InitialInventoryInput {
  storeId: number;
  stock: number;
  storePrice?: number;
  minStock?: number;
  maxStock?: number;
  isAvailable?: boolean;
}

export interface ProductInventory {
  id: number;
  productId: number;
  storeId: number;
  stock: number;
  minStock: number;
  maxStock: number;
  storePrice?: number | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  brandId?: number | null;
  categoryId: number;
  metadata?: Record<string, any> | null;
  imageUrl?: string | null;
  imageUrls: string[];
  basePrice: number;
  salePrice?: number | null;
  sku: string;
  barcode?: string | null;
  isActive: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
  viewCount: number;
  orderCount: number;
  rating?: number | null;
  reviewCount: number;
  createdById: number;
  updatedById: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  inventories: ProductInventory[];
  // ─── 관계 필드 (GraphQL federation 응답 시 포함) ───
  category?: ProductCategoryRef | null;
  brand?: ProductBrandRef | null;
}

export interface ErrorInfo {
  code?: string | null;
  message: string;
  details?: string | null;
}

export interface CreateProductOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  product?: Product | null;
  creationMessage?: string | null;
  notificationMessage?: string | null;
  inventoryMessage?: string | null;
}

export interface UpdateProductOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  product?: Product | null;
  updateMessage?: string | null;
  notificationSent?: boolean | null;
  inventoryUpdateMessage?: string | null;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  description?: string;
  brandId?: number;
  categoryId: number;
  imageUrl?: string;
  basePrice: number;
  salePrice?: number;
  sku: string;
  barcode?: string;
  isActive?: boolean;
  isAvailable?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
  metadata?: Record<string, any>;
  imageUrls?: string[];
  tags?: string[];
  initialInventories?: InitialInventoryInput[]; // ← 변경
  pricingPolicy?: Record<string, any>;
}

export interface UpdateProductInput {
  id: number;
  name?: string;
  slug?: string;
  description?: string;
  brandId?: number;
  categoryId?: number;
  imageUrl?: string;
  basePrice?: number;
  salePrice?: number;
  sku?: string;
  barcode?: string;
  isActive?: boolean;
  isAvailable?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
  metadata?: Record<string, any>;
  imageUrls?: string[];
  tags?: string[];
  initialInventories?: InitialInventoryInput[]; // ← 변경
  pricingPolicy?: Record<string, any>;
  updateReason?: string;
}

export interface DeleteProductOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  deleteMessage?: string | null;
}

export interface CreateProductInventoryInput {
  productId: number; // 단독 재고 생성 시 필수 (CreateProductInventoryInput)
  storeId: number;
  stock?: number;
  isAvailable?: boolean;
  minStock?: number;
  maxStock?: number;
  storePrice?: number;
}

export interface UpdateProductInventoryInput {
  id: number;
  productId?: number;
  storeId?: number;
  stock?: number;
  isAvailable?: boolean;
  minStock?: number;
  maxStock?: number;
  storePrice?: number;
}

// ============================================================================
// 서비스 인터페이스
// ============================================================================

export interface IProductsService {
  listProducts(): Promise<ApiResponse<Product[]>>;
  getProductById(id: number): Promise<ApiResponse<Product>>;
  getProductByBarcode(barcode: string): Promise<ApiResponse<Product>>;
  createProduct(
    input: CreateProductInput
  ): Promise<ApiResponse<CreateProductOutput>>;
  updateProduct(
    input: UpdateProductInput
  ): Promise<ApiResponse<UpdateProductOutput>>;
  deleteProduct(id: number): Promise<ApiResponse<DeleteProductOutput>>;
  deleteProducts(ids: number[]): Promise<ApiResponse<boolean>>;
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

export interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  filters: ProductFilters;
  isLoading: boolean;
  error: string | null;
}

export interface ProductsContextActions {
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProductInContext: (id: number, updates: Partial<Product>) => void;
  removeProduct: (id: number) => void;
  setCurrentProduct: (product: Product | null) => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type ProductsContextValue = ProductsState & ProductsContextActions;

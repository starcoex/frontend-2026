import type { ApiResponse } from '../types';

// ============================================================================
// Federation stub 타입
// ============================================================================

export interface CategoryRef {
  id: number;
}
export interface BrandRef {
  id: number;
}
export interface StoreRef {
  id: number;
}

// ============================================================================
// 상품 타입 마스터
// ============================================================================

export interface ProductType {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  sortOrder: number;
  metadataSchema?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// ============================================================================
// 메타데이터 타입
// ============================================================================

export interface FuelProductMetadata {
  fuelType?: string;
  unit?: string;
  [key: string]: unknown;
}

export interface GasProductMetadata {
  gasType?: string;
  unit?: string;
  [key: string]: unknown;
}

export interface GeneralProductMetadata {
  variants?: Record<string, unknown>[];
  options?: Record<string, unknown>[];
  specifications?: Record<string, unknown>;
  [key: string]: unknown;
}

export type ProductMetadata =
  | FuelProductMetadata
  | GasProductMetadata
  | GeneralProductMetadata
  | Record<string, unknown>
  | null;

// ============================================================================
// 재고 타입
// ============================================================================

export interface ProductInventory {
  id: number;
  productId: number;
  storeId: number;
  stock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  storePrice?: number | null;
  costPrice?: number | null;
  isAvailable: boolean;
  createdById?: number | null;
  updatedById?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  store?: StoreRef | null;
  product?: Pick<Product, 'id' | 'name' | 'sku'> | null;
}

// ============================================================================
// 상품 타입
// ============================================================================

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  brandId?: number | null;
  categoryId: number;
  productTypeId?: number | null;
  metadata?: ProductMetadata;
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
  category?: CategoryRef | null;
  brand?: BrandRef | null;
  productType?: ProductType | null;
}

// ============================================================================
// 에러 타입
// ============================================================================

export interface ErrorInfo {
  code?: string | null;
  message: string;
  details?: string | null;
}

// ============================================================================
// Product Output 타입
// ============================================================================

export interface CreateProductOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  product?: Product | null;
  message?: string | null;
}

export interface UpdateProductOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  product?: Product | null;
  updateMessage?: string | null;
  notificationSent?: boolean | null;
  inventoryUpdateMessage?: string | null;
}

export interface DeleteProductOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  deleteMessage?: string | null;
}

// ============================================================================
// Product Input 타입
// ============================================================================

export interface InitialInventoryInput {
  storeId: number;
  stock?: number;
  minStock?: number;
  maxStock?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  storePrice?: number;
  costPrice?: number;
  isAvailable?: boolean;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  description?: string;
  brandId?: number;
  categoryId: number;
  productTypeId?: number;
  metadata?: ProductMetadata;
  imageUrl?: string;
  imageUrls?: string[];
  basePrice: number;
  salePrice?: number;
  sku: string;
  barcode?: string;
  isActive?: boolean;
  isAvailable?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
  initialInventories?: InitialInventoryInput[];
}

export interface UpdateProductInput {
  id: number;
  name?: string;
  slug?: string;
  description?: string;
  brandId?: number;
  categoryId?: number;
  productTypeId?: number;
  metadata?: ProductMetadata;
  imageUrl?: string;
  imageUrls?: string[];
  basePrice?: number;
  salePrice?: number;
  sku?: string;
  barcode?: string;
  isActive?: boolean;
  isAvailable?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
  initialInventories?: InitialInventoryInput[];
  updateReason?: string;
}

export interface CreateProductInventoryInput {
  productId: number;
  storeId: number;
  stock?: number;
  minStock?: number;
  maxStock?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  storePrice?: number;
  costPrice?: number;
  isAvailable?: boolean;
}

export interface UpdateProductInventoryInput {
  id: number;
  productId?: number;
  storeId?: number;
  stock?: number;
  minStock?: number;
  maxStock?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  storePrice?: number;
  costPrice?: number;
  isAvailable?: boolean;
}

// ============================================================================
// ProductType Input 타입 (stores의 ServiceType 패턴 동일)
// ============================================================================

export interface CreateProductTypeInput {
  code: string;
  name: string;
  description?: string;
  /** @default true */
  isActive?: boolean;
  /** @default 0 */
  sortOrder?: number;
  /** 타입별 메타데이터 스키마 */
  metadataSchema?: Record<string, unknown>;
}

export interface UpdateProductTypeInput {
  id: number;
  name?: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
  metadataSchema?: Record<string, unknown>;
}

// ============================================================================
// 서비스 인터페이스
// ============================================================================

export interface IProductsService {
  // ── Product ──
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
  // ── ProductType ──
  listProductTypes(): Promise<ApiResponse<ProductType[]>>;
  getProductTypeById(id: number): Promise<ApiResponse<ProductType>>;
  getProductTypeByCode(code: string): Promise<ApiResponse<ProductType>>;
  createProductType(
    input: CreateProductTypeInput
  ): Promise<ApiResponse<ProductType>>;
  updateProductType(
    input: UpdateProductTypeInput
  ): Promise<ApiResponse<ProductType>>;
  // ── Inventory ──
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
  productTypeId?: number;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  isAvailable?: boolean;
  isFeatured?: boolean;
}

export interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  /** ProductType 마스터 목록 */
  productTypes: ProductType[];
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
  setProductTypes: (productTypes: ProductType[]) => void;
  updateProductTypeInContext: (
    id: number,
    updates: Partial<ProductType>
  ) => void;
  addProductType: (productType: ProductType) => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type ProductsContextValue = ProductsState & ProductsContextActions;

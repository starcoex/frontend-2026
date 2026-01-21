import type { ApiResponse } from '../types';
import {
  // Inputs
  CreateStoreInput,
  UpdateStoreInput,
  DeleteStoreInput,
  CreateBrandInput,
  UpdateBrandInput,
  DeleteBrandInput,
  // Outputs
  CreateStoreOutput,
  UpdateStoreOutput,
  DeleteStoreOutput,
  CreateBrandOutput,
  UpdateBrandOutput,
  DeleteBrandOutput,
  // Types
  Store,
  Brand,
} from '@starcoex-frontend/graphql';

// ============================================================================
// 서비스 인터페이스
// ============================================================================
export interface IStoresService {
  // ===== Store Queries =====
  listStores(): Promise<ApiResponse<Store[]>>;
  getStoreById(id: number): Promise<ApiResponse<Store>>;

  // ===== Brand Queries =====
  listBrands(): Promise<ApiResponse<Brand[]>>;
  getBrandById(id: number): Promise<ApiResponse<Brand>>;

  // ===== Store Mutations =====
  createStore(input: CreateStoreInput): Promise<ApiResponse<CreateStoreOutput>>;
  updateStore(input: UpdateStoreInput): Promise<ApiResponse<UpdateStoreOutput>>;
  deleteStore(input: DeleteStoreInput): Promise<ApiResponse<DeleteStoreOutput>>;

  // ===== Brand Mutations =====
  createBrand(input: CreateBrandInput): Promise<ApiResponse<CreateBrandOutput>>;
  updateBrand(input: UpdateBrandInput): Promise<ApiResponse<UpdateBrandOutput>>;
  deleteBrand(input: DeleteBrandInput): Promise<ApiResponse<DeleteBrandOutput>>;
}

// ============================================================================
// Context 상태 타입
// ============================================================================
export interface StoresState {
  // 매장 목록
  stores: Store[];

  // 브랜드 목록
  brands: Brand[];

  // 현재 선택된 매장
  currentStore: Store | null;

  // 현재 선택된 브랜드
  currentBrand: Brand | null;

  // 필터/검색
  filters: StoreFilters;

  // 공통 로딩/에러
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// 필터 타입
// ============================================================================
export interface StoreFilters {
  search?: string;
  brandId?: number;
  location?: string;
  isActive?: boolean;
  isVisible?: boolean;
  pickupEnabled?: boolean;
  minRating?: number;
}

// ============================================================================
// Context 액션 타입
// ============================================================================
export interface StoresContextActions {
  // 매장 관련
  setStores: (stores: Store[]) => void;
  addStore: (store: Store) => void;
  updateStore: (id: number, updates: Partial<Store>) => void;
  removeStore: (id: number) => void;
  setCurrentStore: (store: Store | null) => void;
  loadStores: () => Promise<void>;
  loadStoreById: (id: number) => Promise<void>;

  // 브랜드 관련
  setBrands: (brands: Brand[]) => void;
  addBrand: (brand: Brand) => void;
  updateBrand: (id: number, updates: Partial<Brand>) => void;
  removeBrand: (id: number) => void;
  setCurrentBrand: (brand: Brand | null) => void;
  loadBrands: () => Promise<void>;
  loadBrandById: (id: number) => Promise<void>;

  // 필터 관련
  setFilters: (filters: Partial<StoreFilters>) => void;
  clearFilters: () => void;

  // 공통
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

// Context 전체 타입
export type StoresContextValue = StoresState & StoresContextActions;

// Re-export for convenience
export type {
  Store,
  Brand,
  CreateStoreInput,
  UpdateStoreInput,
  DeleteStoreInput,
  CreateBrandInput,
  UpdateBrandInput,
  DeleteBrandInput,
  CreateStoreOutput,
  UpdateStoreOutput,
  DeleteStoreOutput,
  CreateBrandOutput,
  UpdateBrandOutput,
  DeleteBrandOutput,
};

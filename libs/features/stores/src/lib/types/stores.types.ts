import type { ApiResponse } from '../types';
import {
  CreateStoreInput,
  UpdateStoreInput,
  DeleteStoreInput,
  CreateBrandInput,
  UpdateBrandInput,
  DeleteBrandInput,
  StoreAddressInput,
  StoreCoordinatesInput,
  CreateStoreOutput,
  UpdateStoreOutput,
  DeleteStoreOutput,
  CreateBrandOutput,
  UpdateBrandOutput,
  DeleteBrandOutput,
  StoreStatsOutput,
  Store,
  Brand,
  BusinessType,
  BrandBusinessType,
  ServiceType,
  StoreService,
  StoreManager,
  ManagerRole,
  AddStoreServiceInput,
  RemoveStoreServiceInput,
  AddStoreManagerInput,
  RemoveStoreManagerInput,
  // ✅ 신규
  CreateBusinessTypeInput,
  UpdateBusinessTypeInput,
  CreateServiceTypeInput,
  UpdateServiceTypeInput,
} from '@starcoex-frontend/graphql';

export interface AddStoreServiceOutput {
  success?: boolean | null;
  message?: string | null;
  error?: {
    code?: string | null;
    message: string;
    details?: string | null;
  } | null;
}

// ✅ 신규 Output 타입
export interface CreateBusinessTypeOutput {
  success: boolean;
  businessType?: BusinessType | null;
}

export interface UpdateBusinessTypeOutput {
  success: boolean;
  businessType?: BusinessType | null;
}

export interface CreateServiceTypeOutput {
  success: boolean;
  serviceType?: ServiceType | null;
}

export interface UpdateServiceTypeOutput {
  success: boolean;
  serviceType?: ServiceType | null;
}

// ============================================================================
// 서비스 인터페이스
// ============================================================================
export interface IStoresService {
  listStores(): Promise<ApiResponse<Store[]>>;
  getStoreById(id: number): Promise<ApiResponse<Store>>;
  getStoreStatistics(): Promise<ApiResponse<StoreStatsOutput>>;
  listBrands(): Promise<ApiResponse<Brand[]>>;
  getBrandById(id: number): Promise<ApiResponse<Brand>>;
  listBusinessTypes(): Promise<ApiResponse<BusinessType[]>>;
  listServiceTypes(): Promise<ApiResponse<ServiceType[]>>; // ✅ 신규
  createStore(input: CreateStoreInput): Promise<ApiResponse<CreateStoreOutput>>;
  updateStore(input: UpdateStoreInput): Promise<ApiResponse<UpdateStoreOutput>>;
  deleteStore(input: DeleteStoreInput): Promise<ApiResponse<DeleteStoreOutput>>;
  deleteStores(ids: number[]): Promise<ApiResponse<boolean>>;
  addStoreService(
    input: AddStoreServiceInput
  ): Promise<ApiResponse<AddStoreServiceOutput>>;
  removeStoreService(
    input: RemoveStoreServiceInput
  ): Promise<ApiResponse<AddStoreServiceOutput>>;
  addStoreManager(
    input: AddStoreManagerInput
  ): Promise<ApiResponse<AddStoreServiceOutput>>;
  removeStoreManager(
    input: RemoveStoreManagerInput
  ): Promise<ApiResponse<AddStoreServiceOutput>>;
  createBrand(input: CreateBrandInput): Promise<ApiResponse<CreateBrandOutput>>;
  updateBrand(input: UpdateBrandInput): Promise<ApiResponse<UpdateBrandOutput>>;
  deleteBrand(input: DeleteBrandInput): Promise<ApiResponse<DeleteBrandOutput>>;
  deleteBrands(ids: number[]): Promise<ApiResponse<boolean>>;
  // ✅ 신규
  createBusinessType(
    input: CreateBusinessTypeInput
  ): Promise<ApiResponse<CreateBusinessTypeOutput>>;
  updateBusinessType(
    input: UpdateBusinessTypeInput
  ): Promise<ApiResponse<UpdateBusinessTypeOutput>>;
  createServiceType(
    input: CreateServiceTypeInput
  ): Promise<ApiResponse<CreateServiceTypeOutput>>;
  updateServiceType(
    input: UpdateServiceTypeInput
  ): Promise<ApiResponse<UpdateServiceTypeOutput>>;
}

// ============================================================================
// Context 상태 타입
// ============================================================================
export interface StoresState {
  stores: Store[];
  brands: Brand[];
  businessTypes: BusinessType[];
  serviceTypes: ServiceType[]; // ✅ 신규
  currentStore: Store | null;
  currentBrand: Brand | null;
  statistics: StoreStatsOutput | null;
  filters: StoreFilters;
  isLoading: boolean;
  error: string | null;
}

export interface StoreFilters {
  search?: string;
  brandId?: number;
  businessTypeId?: number;
  location?: string;
  isActive?: boolean;
  isVisible?: boolean;
  pickupEnabled?: boolean;
  minRating?: number;
}

export interface StoresContextActions {
  setStores: (stores: Store[]) => void;
  addStore: (store: Store) => void;
  updateStore: (id: number, updates: Partial<Store>) => void;
  removeStore: (id: number) => void;
  setCurrentStore: (store: Store | null) => void;
  loadStores: () => Promise<void>;
  loadStoreById: (id: number) => Promise<void>;
  setBrands: (brands: Brand[]) => void;
  addBrand: (brand: Brand) => void;
  updateBrand: (id: number, updates: Partial<Brand>) => void;
  removeBrand: (id: number) => void;
  setCurrentBrand: (brand: Brand | null) => void;
  loadBrands: () => Promise<void>;
  loadBrandById: (id: number) => Promise<void>;
  setBusinessTypes: (businessTypes: BusinessType[]) => void;
  loadBusinessTypes: () => Promise<void>;
  // ✅ 신규
  setServiceTypes: (serviceTypes: ServiceType[]) => void;
  loadServiceTypes: () => Promise<void>;
  setStatistics: (statistics: StoreStatsOutput | null) => void;
  loadStatistics: () => Promise<void>;
  setFilters: (filters: Partial<StoreFilters>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type StoresContextValue = StoresState & StoresContextActions;

export type {
  Store,
  Brand,
  BusinessType,
  BrandBusinessType,
  ServiceType,
  StoreService,
  StoreManager,
  ManagerRole,
  CreateStoreInput,
  UpdateStoreInput,
  DeleteStoreInput,
  CreateBrandInput,
  UpdateBrandInput,
  DeleteBrandInput,
  CreateStoreOutput,
  UpdateStoreOutput,
  DeleteStoreOutput,
  StoreAddressInput,
  StoreCoordinatesInput,
  CreateBrandOutput,
  UpdateBrandOutput,
  DeleteBrandOutput,
  StoreStatsOutput,
  AddStoreServiceInput,
  RemoveStoreServiceInput,
  AddStoreManagerInput,
  RemoveStoreManagerInput,
  // ✅ 신규
  CreateBusinessTypeInput,
  UpdateBusinessTypeInput,
  CreateServiceTypeInput,
  UpdateServiceTypeInput,
};

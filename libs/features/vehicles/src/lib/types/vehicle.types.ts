import type { ApiResponse } from '../types';

// ============================================================================
// Enum 타입
// ============================================================================

export type VehicleBodyType = 'PASSENGER' | 'SUV' | 'VAN' | 'TRUCK';
export type VehicleSizeGrade = 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type VehicleDataSource =
  | 'API_AUTO'
  | 'API_MANUAL'
  | 'ADMIN_API'
  | 'ADMIN_MANUAL';
export type VehicleStatus =
  | 'ACTIVE'
  | 'PENDING_VERIFICATION'
  | 'MANUAL_REVIEW'
  | 'API_ERROR'
  | 'INACTIVE';
export type GradeSource =
  | 'MODEL_MATCH'
  | 'DIMENSION'
  | 'CLASS_FALLBACK'
  | 'MANUAL';
export type GradeConfidence = 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

// ============================================================================
// 엔티티 타입
// ============================================================================

export interface VehicleBrand {
  id: number;
  name: string;
  nameEn?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  models: VehicleModel[];
}

export interface VehicleModel {
  id: number;
  brandId: number;
  name: string;
  bodyType: VehicleBodyType;
  sizeGrade: VehicleSizeGrade;
  aliases?: string[] | null;
  apiClassName?: string | null;
  refLength?: number | null;
  refWidth?: number | null;
  yearFrom?: number | null;
  yearTo?: number | null;
  dataSource: VehicleDataSource;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  brand?: VehicleBrand | null;
}

export interface VehicleAdminEdit {
  id: number;
  vehicleId: number;
  adminId: number;
  editType: string;
  reason: string;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface VehicleDimensionRule {
  id: number;
  bodyType: VehicleBodyType;
  minLength: number;
  maxLength: number;
  sizeGrade: VehicleSizeGrade;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Vehicle {
  id: number;
  userId: number;
  carNo: string;
  ownerName: string;
  displayName?: string | null;
  dataSource: VehicleDataSource;
  status: VehicleStatus;
  isVerified: boolean;
  verifiedBy?: number | null;
  verifiedAt?: string | null;
  apiCarName?: string | null;
  apiCarTypeName?: string | null;
  apiCarClassName?: string | null;
  apiVin?: string | null;
  apiModelYear?: string | null;
  apiMakingDate?: string | null;
  apiFirstRegDate?: string | null;
  apiFuelType?: string | null;
  apiColor?: string | null;
  apiDisplacement?: number | null;
  apiSeatingCap?: number | null;
  apiBodyLength?: number | null;
  apiBodyWidth?: number | null;
  apiBodyHeight?: number | null;
  apiVehicleWeight?: number | null;
  apiTotalWeight?: number | null;
  apiEngineType?: string | null;
  apiMaxPower?: number | null;
  apiMaintenanceRaw?: Record<string, unknown> | null;
  apiInspectionRaw?: Record<string, unknown> | null;
  vehicleModelId?: number | null;
  resolvedGrade?: VehicleSizeGrade | null;
  resolvedBody?: VehicleBodyType | null;
  gradeSource?: GradeSource | null;
  gradeConfidence?: GradeConfidence | null;
  createdByAdmin?: number | null;
  adminReason?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  vehicleModel?: VehicleModel | null;
  adminEdits: VehicleAdminEdit[];
}

// ============================================================================
// Output 타입
// ============================================================================

export interface VehicleErrorInfo {
  code?: string | null;
  message: string;
  details?: string | null;
}

export interface CreateVehicleOutput {
  success?: boolean | null;
  error?: VehicleErrorInfo | null;
  vehicle?: Vehicle | null;
  gradeMessage?: string | null;
}

export interface CreateVehicleBrandOutput {
  success?: boolean | null;
  error?: VehicleErrorInfo | null;
  vehicleBrand?: VehicleBrand | null;
}

export interface CreateVehicleModelOutput {
  success?: boolean | null;
  error?: VehicleErrorInfo | null;
  vehicleModel?: VehicleModel | null;
}

export interface CreateVehicleDimensionRuleOutput {
  success?: boolean | null;
  error?: VehicleErrorInfo | null;
  rule?: VehicleDimensionRule | null;
}

export interface ResolveGradeOutput {
  success?: boolean | null;
  error?: VehicleErrorInfo | null;
  grade?: VehicleSizeGrade | null;
  bodyType?: VehicleBodyType | null;
  source: GradeSource;
  confidence: GradeConfidence;
  vehicleModelId?: number | null;
}

// ============================================================================
// Input 타입
// ============================================================================

export interface CreateVehicleInput {
  userId: number;
  carNo: string;
  ownerName: string;
  displayName?: string;
  dataSource?: VehicleDataSource;
  apiCarName?: string;
  apiCarTypeName?: string;
  apiCarClassName?: string;
  apiVin?: string;
  apiModelYear?: string;
  apiMakingDate?: string;
  apiFirstRegDate?: string;
  apiFuelType?: string;
  apiColor?: string;
  apiDisplacement?: number;
  apiSeatingCap?: number;
  apiBodyLength?: number;
  apiBodyWidth?: number;
  apiBodyHeight?: number;
  apiVehicleWeight?: number;
  apiTotalWeight?: number;
  apiEngineType?: string;
  apiMaxPower?: number;
}

export interface CreateVehicleBrandInput {
  name: string;
  nameEn?: string;
  isActive?: boolean;
}

export interface CreateVehicleModelInput {
  brandId: number;
  name: string;
  bodyType: VehicleBodyType;
  sizeGrade: VehicleSizeGrade;
  apiClassName?: string;
  refLength?: number;
  refWidth?: number;
  yearFrom?: number;
  yearTo?: number;
  dataSource?: VehicleDataSource;
  aliases?: string[];
}

export interface CreateVehicleDimensionRuleInput {
  bodyType: VehicleBodyType;
  minLength: number;
  maxLength: number;
  sizeGrade: VehicleSizeGrade;
}

export interface ResolveGradeInput {
  carName: string;
  carTypeName?: string;
  carClassName?: string;
  bodyLength?: number;
}

// ============================================================================
// 서비스 인터페이스
// ============================================================================

export interface IVehicleManagementService {
  // Queries
  getVehicleById(id: number): Promise<ApiResponse<Vehicle>>;
  getVehicleByCarNo(carNo: string): Promise<ApiResponse<Vehicle>>;
  myVehicles(limit?: number, offset?: number): Promise<ApiResponse<Vehicle[]>>;
  pendingReviewVehicles(
    limit?: number,
    offset?: number
  ): Promise<ApiResponse<Vehicle[]>>;
  adminVehicles(
    limit?: number,
    offset?: number,
    status?: string
  ): Promise<ApiResponse<Vehicle[]>>;
  lowConfidenceVehicles(
    limit?: number,
    offset?: number
  ): Promise<ApiResponse<Vehicle[]>>;
  vehicleBrands(onlyActive?: boolean): Promise<ApiResponse<VehicleBrand[]>>;
  vehicleBrand(id: number): Promise<ApiResponse<VehicleBrand>>;
  vehicleModelsByBrand(brandId: number): Promise<ApiResponse<VehicleModel[]>>;
  vehicleModelsByGrade(
    sizeGrade: string,
    bodyType?: string
  ): Promise<ApiResponse<VehicleModel[]>>;
  vehicleDimensionRules(
    bodyType?: string
  ): Promise<ApiResponse<VehicleDimensionRule[]>>;
  resolveVehicleGrade(
    input: ResolveGradeInput
  ): Promise<ApiResponse<ResolveGradeOutput>>;
  // Mutations
  createVehicle(
    input: CreateVehicleInput
  ): Promise<ApiResponse<CreateVehicleOutput>>;
  overrideVehicleGrade(
    vehicleId: number,
    sizeGrade: string,
    bodyType: string,
    reason: string
  ): Promise<ApiResponse<Vehicle>>;
  deleteVehicle(vehicleId: number): Promise<ApiResponse<boolean>>;
  updateVehicleStatus(
    vehicleId: number,
    status: string
  ): Promise<ApiResponse<Vehicle>>;
  createVehicleBrand(
    input: CreateVehicleBrandInput
  ): Promise<ApiResponse<CreateVehicleBrandOutput>>;
  createVehicleModel(
    input: CreateVehicleModelInput
  ): Promise<ApiResponse<CreateVehicleModelOutput>>;
  createVehicleDimensionRule(
    input: CreateVehicleDimensionRuleInput
  ): Promise<ApiResponse<CreateVehicleDimensionRuleOutput>>;
  updateVehicleBrand(
    id: number,
    input: CreateVehicleBrandInput
  ): Promise<ApiResponse<VehicleBrand>>;
  deleteVehicleBrand(id: number): Promise<ApiResponse<boolean>>;
  updateVehicleModel(
    id: number,
    input: CreateVehicleModelInput
  ): Promise<ApiResponse<VehicleModel>>;
  deleteVehicleModel(id: number): Promise<ApiResponse<boolean>>;
}

// ============================================================================
// Context 상태 타입
// ============================================================================

export interface VehicleState {
  vehicles: Vehicle[];
  currentVehicle: Vehicle | null;
  brands: VehicleBrand[];
  models: VehicleModel[];
  dimensionRules: VehicleDimensionRule[];
  isLoading: boolean;
  error: string | null;
}

export interface VehicleContextActions {
  setVehicles: (vehicles: Vehicle[]) => void;
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicleInContext: (id: number, updates: Partial<Vehicle>) => void;
  removeVehicle: (id: number) => void;
  setCurrentVehicle: (vehicle: Vehicle | null) => void;
  setBrands: (brands: VehicleBrand[]) => void;
  setModels: (models: VehicleModel[]) => void;
  setDimensionRules: (rules: VehicleDimensionRule[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type VehicleContextValue = VehicleState & VehicleContextActions;

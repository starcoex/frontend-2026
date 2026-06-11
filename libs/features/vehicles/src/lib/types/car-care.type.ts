import type { ApiResponse } from '../types';
import type {
  VehicleBodyType,
  VehicleSizeGrade,
  VehicleErrorInfo,
} from './vehicle.types';

// ============================================================================
// 엔티티 타입
// ============================================================================

export interface CarCarePrice {
  id: number;
  storeId: number;
  serviceTypeCode: string;
  bodyType: VehicleBodyType;
  sizeGrade: VehicleSizeGrade;
  price: number;
  unit: string;
  priceCondition?: Record<string, unknown> | null;
  productId?: number | null;
  lastPriceChangedAt?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CarCareSurcharge {
  id: number;
  storeId: number;
  surchargeType: string;
  description: string;
  minAmount?: number | null;
  maxAmount?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// ============================================================================
// Output 타입
// ============================================================================

export interface CreateCarCarePriceOutput {
  success?: boolean | null;
  error?: VehicleErrorInfo | null;
  carCarePrice?: CarCarePrice | null;
}

export interface CreateCarCareSurchargeOutput {
  success?: boolean | null;
  error?: VehicleErrorInfo | null;
  surcharge?: CarCareSurcharge | null;
}

// ============================================================================
// Input 타입
// ============================================================================

export interface CreateCarCarePriceInput {
  storeId: number;
  serviceTypeCode: string;
  bodyType: VehicleBodyType;
  sizeGrade: VehicleSizeGrade;
  price: number;
  unit?: string;
  priceCondition?: Record<string, unknown>;
  productId?: number;
}

export interface CreateCarCareSurchargeInput {
  storeId: number;
  surchargeType: string;
  description: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface UpdateCarCareSurchargeInput {
  id: number;
  storeId?: number;
  surchargeType?: string;
  description?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface UpdateCarCareSurchargeOutput {
  success?: boolean | null;
  error?: VehicleErrorInfo | null;
  surcharge?: CarCareSurcharge | null;
}

// ============================================================================
// 서비스 인터페이스
// ============================================================================

export interface ICarCareService {
  // Queries
  carCarePricesByStore(storeId: number): Promise<ApiResponse<CarCarePrice[]>>;
  carCarePriceByGrade(
    storeId: number,
    serviceTypeCode: string,
    bodyType: string,
    sizeGrade: string
  ): Promise<ApiResponse<CarCarePrice>>;
  carCareSurchargesByStore(
    storeId: number
  ): Promise<ApiResponse<CarCareSurcharge[]>>;
  // Mutations
  createCarCarePrice(
    input: CreateCarCarePriceInput
  ): Promise<ApiResponse<CreateCarCarePriceOutput>>;
  createCarCareSurcharge(
    input: CreateCarCareSurchargeInput
  ): Promise<ApiResponse<CreateCarCareSurchargeOutput>>;
  updateCarCarePrice(
    id: number,
    input: CreateCarCarePriceInput
  ): Promise<ApiResponse<CarCarePrice>>;
  updateCarCareSurcharge(
    input: UpdateCarCareSurchargeInput
  ): Promise<ApiResponse<UpdateCarCareSurchargeOutput>>;
  deleteCarCarePrice(id: number): Promise<ApiResponse<boolean>>;
  deleteCarCareSurcharge(id: number): Promise<ApiResponse<boolean>>;
}

// ============================================================================
// Context 상태 타입
// ============================================================================

export interface CarCareState {
  prices: CarCarePrice[];
  surcharges: CarCareSurcharge[];
  currentPrice: CarCarePrice | null;
  isLoading: boolean;
  error: string | null;
}

export interface CarCareContextActions {
  setPrices: (prices: CarCarePrice[]) => void;
  addPrice: (price: CarCarePrice) => void;
  updatePriceInContext: (id: number, updates: Partial<CarCarePrice>) => void;
  updateSurchargeInContext: (
    id: number,
    updates: Partial<CarCareSurcharge>
  ) => void;
  removePrice: (id: number) => void;
  setCurrentPrice: (price: CarCarePrice | null) => void;
  setSurcharges: (surcharges: CarCareSurcharge[]) => void;
  addSurcharge: (surcharge: CarCareSurcharge) => void;
  removeSurcharge: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type CarCareContextValue = CarCareState & CarCareContextActions;

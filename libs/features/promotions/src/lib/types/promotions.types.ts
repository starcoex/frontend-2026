import type { ApiResponse } from '../types';

// ============================================================================
// Enums
// ============================================================================

export type UsageStatus = 'USED' | 'CANCELLED' | 'REFUNDED';

export type PromotionType =
  | 'COUPON'
  | 'DISCOUNT'
  | 'BOGO'
  | 'FREE_SHIPPING'
  | 'POINT_MULTIPLIER'
  | 'BUNDLE'
  | 'TIME_BASED'
  | 'MEMBERSHIP';

export type DiscountType = 'FIXED' | 'PERCENTAGE' | 'FREE_ITEM' | 'UPGRADE';

export type PromotionTarget =
  | 'ALL'
  | 'NEW_CUSTOMERS'
  | 'EXISTING_CUSTOMERS'
  | 'VIP'
  | 'SPECIFIC_SEGMENT';

export type PromotionStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'ACTIVE'
  | 'PAUSED'
  | 'ENDED'
  | 'CANCELLED';

// ============================================================================
// 엔티티 타입
// ============================================================================

export interface PromotionRule {
  id: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  promotionId: number;
  name: string;
  condition: Record<string, any>;
  action: Record<string, any>;
  priority: number;
  isActive: boolean;
}

export interface PromotionUsage {
  id: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  promotionId: number;
  userId?: number | null;
  guestEmail?: string | null;
  orderId: number;
  storeId: number;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  usedAt: string;
  status: UsageStatus;
  cancelledAt?: string | null;
  refundedAt?: string | null;
  appliedRules?: Record<string, any> | null;
  metadata?: Record<string, any> | null;
}

export interface Promotion {
  id: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  name: string;
  code?: string | null;
  description?: string | null;
  type: PromotionType;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number | null;
  minOrderAmount?: number | null;
  maxOrderAmount?: number | null;
  targetCustomers: PromotionTarget;
  customerSegments: string[];
  excludedCustomers: number[];
  startDate: string;
  endDate: string;
  timeRestrictions?: Record<string, any> | null;
  totalLimit?: number | null;
  perUserLimit: number;
  dailyLimit?: number | null;
  currentUsage: number;
  additionalBenefits?: Record<string, any> | null;
  stackable: boolean;
  priority: number;
  autoApply: boolean;
  status: PromotionStatus;
  isActive: boolean;
  isVisible: boolean;
  imageUrl?: string | null;
  bannerImageUrl?: string | null;
  marketingMessage?: string | null;
  metadata?: Record<string, any> | null;
  createdById: number;
  updatedById: number;
  approvedAt?: string | null;
  approvedById?: number | null;
  usages: PromotionUsage[];
  rules: PromotionRule[];
  appliesToAllStores: boolean;
  applicableStoreIds: number[];
  applicableStores?: { id: number }[] | null;
  appliesToAllProducts: boolean;
  applicableProductIds: number[];
  applicableProducts?: { id: number }[] | null;
  appliesToAllCategories: boolean;
  applicableCategoryIds: number[];
  applicableCategories?: { id: number }[] | null;
}

// ============================================================================
// 통계 타입
// ============================================================================

export interface PromotionStatusCount {
  status: string;
  count: number;
}

export interface PromotionLast30DayStats {
  totalUsage: number;
  totalDiscount: number;
  totalRevenue: number;
  uniqueUsers: number;
}

export interface PromotionSummaryStats {
  statusCounts: PromotionStatusCount[];
  last30Days: PromotionLast30DayStats;
}

export interface PromotionListResult {
  items: Promotion[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================================
// Input 타입
// ============================================================================

export interface GetPromotionsInput {
  status?: string[];
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreatePromotionRuleInput {
  name: string;
  condition: Record<string, any>;
  action: Record<string, any>;
  priority?: number;
}

export interface CreatePromotionInput {
  name: string;
  code?: string | null; // null 허용 추가
  description?: string;
  type: PromotionType;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  maxOrderAmount?: number;
  targetCustomers?: PromotionTarget;
  customerSegments?: string[];
  excludedCustomers?: number[];
  startDate: string;
  endDate: string;
  totalLimit?: number;
  perUserLimit?: number;
  dailyLimit?: number;
  stackable?: boolean;
  priority?: number;
  autoApply?: boolean;
  status?: PromotionStatus;
  isActive?: boolean;
  isVisible?: boolean;
  imageUrl?: string;
  bannerImageUrl?: string;
  marketingMessage?: string;
  timeRestrictions?: Record<string, any>;
  additionalBenefits?: Record<string, any>;
  metadata?: Record<string, any>;
  rules?: CreatePromotionRuleInput[];
  advancedTargeting?: Record<string, any>;
  abTestConfig?: Record<string, any>;
  appliesToAllStores?: boolean;
  storeIds?: number[];
  appliesToAllProducts?: boolean;
  productIds?: number[];
  appliesToAllCategories?: boolean;
  categoryIds?: number[];
}

export interface UpdatePromotionInput extends Partial<CreatePromotionInput> {
  id: number;
}

export interface DeletePromotionInput {
  id: number;
  hardDelete?: boolean;
}

export interface BulkDeletePromotionsInput {
  ids: number[];
  hardDelete?: boolean;
}

export interface ChangePromotionStatusInput {
  id: number;
  status: PromotionStatus;
  reason?: string;
}

// ============================================================================
// Output 타입
// ============================================================================

export interface DeletePromotionOutput {
  success: boolean;
  message: string;
  deletedId: number;
}

export interface BulkDeletePromotionsOutput {
  success: boolean;
  message: string;
  successCount: number;
  failCount: number;
  deletedIds: number[];
  failedIds: number[];
}

export interface ChangePromotionStatusOutput {
  success: boolean;
  message: string;
  promotion: Promotion;
}

// ============================================================================
// Context 상태 타입
// ============================================================================

export interface PromotionFilters {
  status?: string[];
  search?: string;
}

export interface PromotionsState {
  promotions: Promotion[];
  currentPromotion: Promotion | null;
  summaryStats: PromotionSummaryStats | null;
  filters: PromotionFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
}

export interface PromotionsContextActions {
  setPromotions: (promotions: Promotion[]) => void;
  addPromotion: (promotion: Promotion) => void;
  updatePromotionInContext: (id: number, updates: Partial<Promotion>) => void;
  removePromotion: (id: number) => void;
  setCurrentPromotion: (promotion: Promotion | null) => void;
  setSummaryStats: (stats: PromotionSummaryStats | null) => void;
  setFilters: (filters: Partial<PromotionFilters>) => void;
  clearFilters: () => void;
  setPagination: (pagination: Partial<PromotionsState['pagination']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type PromotionsContextValue = PromotionsState & PromotionsContextActions;

// ============================================================================
// 서비스 인터페이스
// ============================================================================

export interface IPromotionsService {
  // Queries
  getPromotionById(id: number): Promise<ApiResponse<Promotion>>;
  findPromotionById(id: number): Promise<ApiResponse<Promotion>>;
  getPromotions(
    input: GetPromotionsInput
  ): Promise<ApiResponse<PromotionListResult>>;
  getPromotionSummaryStats(): Promise<ApiResponse<PromotionSummaryStats>>;

  // Mutations
  createPromotion(input: CreatePromotionInput): Promise<ApiResponse<Promotion>>;
  updatePromotion(input: UpdatePromotionInput): Promise<ApiResponse<Promotion>>;
  deletePromotion(
    input: DeletePromotionInput
  ): Promise<ApiResponse<DeletePromotionOutput>>;
  bulkDeletePromotions(
    input: BulkDeletePromotionsInput
  ): Promise<ApiResponse<BulkDeletePromotionsOutput>>;
  changePromotionStatus(
    input: ChangePromotionStatusInput
  ): Promise<ApiResponse<ChangePromotionStatusOutput>>;
}

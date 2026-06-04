import type { ApiResponse } from '../types';
import {
  // Inputs
  ExchangeCouponInput,
  GiftCouponInput,
  AccumulateStarsInput,
  UseCouponInput,
  MyCouponsFilter,
  CouponHistoryFilter,
  CreateGiftLinkInput,
  ClaimGiftInput,
  // Outputs
  ExchangeCouponOutput,
  GiftCouponOutput,
  AccumulateStarsOutput,
  UseCouponOutput,
  MyCouponsOutput,
  CouponDetailOutput,
  CouponHistoryOutput,
  GiftLinkInfoOutput,
  CreateGiftLinkOutput,
  ClaimGiftOutput,
  MembershipConfigOutput,
  // Types
  UserMembership,
  RewardCoupon,
  CouponHistoryItem,
  MembershipTier,
  StarHistory,
  CouponStatus,
} from '@starcoex-frontend/graphql';

// ============================================================================
// 멤버십 설정 타입 (비로그인 가능 - membershipConfig Query)
// ============================================================================
export interface MembershipConfig {
  welcomeStars: number;
  welcomeCouponDays: number;
  couponCost: number;
  starExpiryYears: number;
  tierThresholds: {
    SHINE: number;
    STAR: number;
  };
  earningRates: {
    GAS: number;
    OIL: number;
    CAR_CARE: number;
  };
}

// ============================================================================
// Admin Input 타입
// ============================================================================
export type AdminTierChangeReason =
  | 'MANUAL_ADJUSTMENT'
  | 'CUSTOMER_SERVICE'
  | 'PROMOTION'
  | 'ERROR_CORRECTION'
  | 'POLICY_CHANGE';

export interface AdjustUserTierInput {
  userId: number;
  newTier: MembershipTier;
  reason: AdminTierChangeReason;
  adminNote?: string;
  sendNotification: boolean;
}

export interface AdjustUserStarsInput {
  userId: number;
  amount: number;
  reason: string;
  sendNotification: boolean;
}

export interface ResetUserMembershipInput {
  userId: number;
  reason: string;
  sendNotification: boolean;
}

// ============================================================================
// Admin Output 타입
// ============================================================================
export interface AdjustUserTierOutput {
  success: boolean;
  message: string;
  membership: UserMembership;
  previousTier: string;
  newTier: string;
}

export interface AdjustUserStarsOutput {
  success: boolean;
  message: string;
  membership: UserMembership;
  adjustedAmount: number;
  previousStars: number;
  currentStars: number;
}

export interface ResetUserMembershipOutput {
  success: boolean;
  message: string;
}

export interface AdminMembershipDetailOutput {
  membership: UserMembership;
  totalActivities: number;
  totalCoupons: number;
  joinedAt: string;
}

// ✅ 신규: MembershipConfig DB 엔티티 (flat 구조, adminGetMembershipConfig 반환값)
export interface MembershipConfigEntity {
  id: number;
  welcomeStars: number;
  welcomeCouponDays: number;
  couponCost: number;
  starExpiryYears: number;
  tierThresholdShine: number;
  tierThresholdStar: number;
  earningRateGas: number;
  earningRateOil: number;
  earningRateCarCare: number;
  updatedAt: string;
  updatedBy?: number | null;
}

// ✅ 신규: UpdateMembershipConfigInput
export interface UpdateMembershipConfigInput {
  welcomeStars: number;
  welcomeCouponDays: number;
  couponCost: number;
  starExpiryYears: number;
  tierThresholdShine: number;
  tierThresholdStar: number;
  earningRateGas: number;
  earningRateOil: number;
  earningRateCarCare: number;
}

// ✅ 신규: UpdateMembershipConfigOutput
export interface UpdateMembershipConfigOutput {
  success: boolean;
  message: string;
  config?: MembershipConfigEntity | null;
}

// ============================================================================
// 신규: Admin 쿠폰 관련 Input 타입
// ============================================================================
export interface AdminMembershipListInput {
  tier?: MembershipTier;
  limit: number;
  offset: number;
}

export interface AdminStarHistoryInput {
  userId: number;
  limit: number;
  offset: number;
}

export interface AdminCouponListInput {
  userId: number;
  status?: CouponStatus;
  limit: number;
  offset: number;
}

export interface AdminIssueCouponInput {
  userId: number;
  couponName: string;
  couponType: string;
  expiryDays: number;
  issueReason?: string;
}

export interface AdminRevokeCouponInput {
  couponCode: string;
  reason: string;
}

export interface AdminBulkIssueCouponInput {
  userIds: number[];
  couponName: string;
  couponType: string;
  expiryDays: number;
  promotionName: string;
  issueReason?: string;
}

// ============================================================================
// 신규: Admin 쿠폰 관련 Output 타입
// ============================================================================
export interface AdminMembershipListOutput {
  memberships: UserMembership[];
  totalCount: number;
  hasMore: boolean;
}

export interface AdminStarHistoryOutput {
  histories: StarHistory[];
  totalCount: number;
  hasMore: boolean;
}

export interface AdminCouponListOutput {
  coupons: RewardCoupon[];
  totalCount: number;
  hasMore: boolean;
}

export interface AdminIssueCouponOutput {
  success: boolean;
  message: string;
  coupon?: RewardCoupon;
}

export interface AdminRevokeCouponOutput {
  success: boolean;
  message: string;
}

export interface BulkIssueResultItem {
  userId: number;
  success: boolean;
  couponCode?: string;
  errorMessage?: string;
}

export interface AdminBulkIssueCouponOutput {
  success: boolean;
  message: string;
  totalCount: number;
  successCount: number;
  failCount: number;
  results: BulkIssueResultItem[];
}

// ============================================================================
// 서비스 인터페이스
// ============================================================================
export interface ILoyaltyService {
  // ===== Queries =====
  getMembershipConfig(): Promise<ApiResponse<MembershipConfigOutput>>;
  getMyCoupons(filter?: MyCouponsFilter): Promise<ApiResponse<MyCouponsOutput>>;
  getCouponDetail(code: string): Promise<ApiResponse<CouponDetailOutput>>;
  getCouponHistory(
    filter?: CouponHistoryFilter
  ): Promise<ApiResponse<CouponHistoryOutput>>;
  getGiftLinkInfo(token: string): Promise<ApiResponse<GiftLinkInfoOutput>>;
  adminGetUserMembership(
    userId: number
  ): Promise<ApiResponse<AdminMembershipDetailOutput>>;

  // ===== 신규 Admin Queries =====
  adminGetMembershipList(
    input: AdminMembershipListInput
  ): Promise<ApiResponse<AdminMembershipListOutput>>;
  adminGetUserStarHistory(
    input: AdminStarHistoryInput
  ): Promise<ApiResponse<AdminStarHistoryOutput>>;
  adminGetUserCoupons(
    input: AdminCouponListInput
  ): Promise<ApiResponse<AdminCouponListOutput>>;

  // ===== Mutations =====
  useCoupon(input: UseCouponInput): Promise<ApiResponse<UseCouponOutput>>;
  exchangeCoupon(
    input: ExchangeCouponInput
  ): Promise<ApiResponse<ExchangeCouponOutput>>;
  giftCoupon(input: GiftCouponInput): Promise<ApiResponse<GiftCouponOutput>>;
  createGiftLink(
    input: CreateGiftLinkInput
  ): Promise<ApiResponse<CreateGiftLinkOutput>>;
  claimGift(input: ClaimGiftInput): Promise<ApiResponse<ClaimGiftOutput>>;
  accumulateStars(
    input: AccumulateStarsInput
  ): Promise<ApiResponse<AccumulateStarsOutput>>;
  adminAdjustUserTier(
    input: AdjustUserTierInput
  ): Promise<ApiResponse<AdjustUserTierOutput>>;
  adminAdjustUserStars(
    input: AdjustUserStarsInput
  ): Promise<ApiResponse<AdjustUserStarsOutput>>;
  adminResetUserMembership(
    input: ResetUserMembershipInput
  ): Promise<ApiResponse<ResetUserMembershipOutput>>;

  // ✅ 신규: 관리자 멤버십 설정 수정
  adminUpdateMembershipConfig(
    input: UpdateMembershipConfigInput
  ): Promise<ApiResponse<UpdateMembershipConfigOutput>>;

  // ===== 신규 Admin Mutations =====
  adminIssueCoupon(
    input: AdminIssueCouponInput
  ): Promise<ApiResponse<AdminIssueCouponOutput>>;
  adminRevokeCoupon(
    input: AdminRevokeCouponInput
  ): Promise<ApiResponse<AdminRevokeCouponOutput>>;
  adminBulkIssueCoupons(
    input: AdminBulkIssueCouponInput
  ): Promise<ApiResponse<AdminBulkIssueCouponOutput>>;
}

// ============================================================================
// Context 상태 타입
// ============================================================================
export interface LoyaltyState {
  // 멤버십 설정 (비로그인 가능)
  config: MembershipConfig | null;
  configLoading: boolean;
  configError: string | null;

  // 개인 멤버십 정보 (로그인 필요)
  membership: UserMembership | null;

  // 쿠폰 관련
  coupons: RewardCoupon[];
  couponHistory: CouponHistoryItem[];

  // 공통 로딩/에러
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// Context 액션 타입
// ============================================================================
export interface LoyaltyContextActions {
  // 설정 관련
  setConfig: (config: MembershipConfig | null) => void;
  setConfigLoading: (loading: boolean) => void;
  setConfigError: (error: string | null) => void;

  // 멤버십 관련
  setMembership: (membership: UserMembership | null) => void;

  // 쿠폰 관련
  setCoupons: (coupons: RewardCoupon[]) => void;
  addCoupon: (coupon: RewardCoupon) => void;
  updateCoupon: (code: string, updates: Partial<RewardCoupon>) => void;
  removeCoupon: (code: string) => void;
  setCouponHistory: (history: CouponHistoryItem[]) => void;

  // 공통
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

// Context 전체 타입
export type LoyaltyContextValue = LoyaltyState & LoyaltyContextActions;

// ============================================================================
// 유틸리티 타입
// ============================================================================

// 등급 표시 정보
export interface TierDisplayInfo {
  tier: MembershipTier;
  displayName: string;
  minStars: number;
  nextTier: MembershipTier | null;
  nextMinStars: number | null;
}

// Re-export for convenience
export type {
  UserMembership,
  RewardCoupon,
  CouponHistoryItem,
  MembershipTier,
  MembershipConfigOutput,
  StarHistory,
  CouponStatus,
};

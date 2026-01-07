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
};

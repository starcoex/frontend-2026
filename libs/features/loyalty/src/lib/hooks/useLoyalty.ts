import { useCallback, useRef } from 'react';
import {
  ExchangeCouponInput,
  GiftCouponInput,
  AccumulateStarsInput,
  UseCouponInput,
  MyCouponsFilter,
  CouponHistoryFilter,
  CreateGiftLinkInput,
  ClaimGiftInput,
} from '@starcoex-frontend/graphql';
import type {
  AdjustUserStarsInput,
  AdjustUserTierInput,
  AdminBulkIssueCouponInput,
  AdminCouponListInput,
  AdminIssueCouponInput,
  AdminMembershipListInput,
  AdminRevokeCouponInput,
  AdminStarHistoryInput,
  ApiResponse,
  MembershipConfig,
  ResetUserMembershipInput,
  UpdateMembershipConfigInput,
} from '../types';
import { useLoyaltyContext } from '../context';
import { getLoyaltyService } from '../services';

export const useLoyalty = () => {
  const context = useLoyaltyContext();

  const {
    // 설정 관련
    setConfig,
    setConfigLoading,
    setConfigError,
    config,
    configLoading,
    // 멤버십 관련
    setMembership,
    // 쿠폰 관련
    setCoupons,
    addCoupon,
    updateCoupon,
    removeCoupon,
    setCouponHistory,
    // 공통
    setLoading,
    clearError,
    setError,
    isLoading: contextIsLoading,
  } = context;

  const isLoadingRef = useRef(contextIsLoading);
  isLoadingRef.current = contextIsLoading;

  // 공통 로딩 래퍼
  const withLoading = useCallback(
    async <T>(
      operation: () => Promise<ApiResponse<T>>,
      defaultErrorMessage: string
    ): Promise<ApiResponse<T>> => {
      try {
        if (!isLoadingRef.current) {
          setLoading(true);
        }
        clearError();

        const res = await operation();

        if (!res.success) {
          const msg = (res as any).error?.message ?? defaultErrorMessage;
          setError(msg);
        }

        return res;
      } catch (e) {
        console.error(e);
        setError(defaultErrorMessage);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setError]
  );

  // 멤버십 설정 조회 (비로그인 가능)

  const fetchMembershipConfig = useCallback(async () => {
    // 이미 로드된 경우 스킵
    if (config || configLoading) {
      return { success: true, data: config } as ApiResponse<MembershipConfig>;
    }

    setConfigLoading(true);
    setConfigError(null);

    try {
      const service = getLoyaltyService();
      const res = await service.getMembershipConfig();

      if (res.success && res.data) {
        const configData: MembershipConfig = {
          welcomeStars: res.data.welcomeStars,
          welcomeCouponDays: res.data.welcomeCouponDays,
          couponCost: res.data.couponCost,
          starExpiryYears: res.data.starExpiryYears,
          tierThresholds: {
            SHINE: res.data.tierThresholds.SHINE,
            STAR: res.data.tierThresholds.STAR,
          },
          earningRates: {
            GAS: res.data.earningRates.GAS,
            OIL: res.data.earningRates.OIL,
            CAR_CARE: res.data.earningRates.CAR_CARE,
          },
        };
        setConfig(configData);
        return { success: true, data: configData };
      } else {
        setConfigError('멤버십 설정을 불러오는데 실패했습니다.');
        return res as unknown as ApiResponse<MembershipConfig>;
      }
    } catch (e) {
      console.error(e);
      setConfigError('멤버십 설정을 불러오는데 실패했습니다.');
      throw e;
    } finally {
      setConfigLoading(false);
    }
  }, [config, configLoading, setConfig, setConfigLoading, setConfigError]);

  // ===== Queries =====

  // 내 쿠폰 목록 조회
  const fetchMyCoupons = useCallback(
    async (filter?: MyCouponsFilter) =>
      withLoading(async () => {
        const service = getLoyaltyService();
        const res = await service.getMyCoupons(filter);

        if (res.success && res.data?.coupons) {
          setCoupons(res.data.coupons);
        }
        return res;
      }, '쿠폰 목록을 불러오는데 실패했습니다.'),
    [withLoading, setCoupons]
  );

  // 쿠폰 상세 조회 (QR/바코드 포함)
  const fetchCouponDetail = useCallback(
    async (code: string) =>
      withLoading(async () => {
        const service = getLoyaltyService();
        return await service.getCouponDetail(code);
      }, '쿠폰 정보를 불러오는데 실패했습니다.'),
    [withLoading]
  );

  // 쿠폰 사용/선물 내역 조회
  const fetchCouponHistory = useCallback(
    async (filter?: CouponHistoryFilter) =>
      withLoading(async () => {
        const service = getLoyaltyService();
        const res = await service.getCouponHistory(filter);

        if (res.success && res.data?.items) {
          setCouponHistory(res.data.items);
        }
        return res;
      }, '쿠폰 내역을 불러오는데 실패했습니다.'),
    [withLoading, setCouponHistory]
  );

  // 선물 링크 정보 조회 (비로그인 가능)
  const fetchGiftLinkInfo = useCallback(
    async (token: string) =>
      withLoading(async () => {
        const service = getLoyaltyService();
        return await service.getGiftLinkInfo(token);
      }, '선물 정보를 불러오는데 실패했습니다.'),
    [withLoading]
  );

  // ===== Mutations =====

  // 쿠폰 사용 처리
  const useCoupon = useCallback(
    async (input: UseCouponInput) =>
      withLoading(async () => {
        const service = getLoyaltyService();
        const res = await service.useCoupon(input);

        if (res.success) {
          updateCoupon(input.code, {
            status: 'USED',
            usedAt: new Date().toISOString(),
          });
        }
        return res;
      }, '쿠폰 사용에 실패했습니다.'),
    [withLoading, updateCoupon]
  );

  // 쿠폰 교환 (별 → 쿠폰)
  const exchangeCoupon = useCallback(
    async (input: ExchangeCouponInput) =>
      withLoading(async () => {
        const service = getLoyaltyService();
        const res = await service.exchangeCoupon(input);

        if (res.success && res.data?.coupon) {
          addCoupon(res.data.coupon);
        }
        return res;
      }, '쿠폰 교환에 실패했습니다.'),
    [withLoading, addCoupon]
  );

  // 쿠폰 선물하기 (이메일 기반)
  const giftCoupon = useCallback(
    async (input: GiftCouponInput) =>
      withLoading(async () => {
        const service = getLoyaltyService();
        const res = await service.giftCoupon(input);

        if (res.success) {
          removeCoupon(input.couponCode);
        }
        return res;
      }, '쿠폰 선물하기에 실패했습니다.'),
    [withLoading, removeCoupon]
  );

  // 선물 링크 생성 (딥링크용)
  const createGiftLink = useCallback(
    async (input: CreateGiftLinkInput) =>
      withLoading(async () => {
        const service = getLoyaltyService();
        const res = await service.createGiftLink(input);

        if (res.success) {
          removeCoupon(input.couponCode);
        }
        return res;
      }, '선물 링크 생성에 실패했습니다.'),
    [withLoading, removeCoupon]
  );

  // 선물 수령 (딥링크로 접속한 사용자)
  const claimGift = useCallback(
    async (input: ClaimGiftInput) =>
      withLoading(async () => {
        const service = getLoyaltyService();
        const res = await service.claimGift(input);

        if (res.success && res.data?.coupon) {
          addCoupon(res.data.coupon);
        }
        return res;
      }, '선물 수령에 실패했습니다.'),
    [withLoading, addCoupon]
  );

  // [관리자용] 별 적립
  const accumulateStars = useCallback(
    async (input: AccumulateStarsInput) =>
      withLoading(async () => {
        const service = getLoyaltyService();
        const res = await service.accumulateStars(input);

        if (res.success && res.data?.membership) {
          setMembership(res.data.membership);
        }
        return res;
      }, '별 적립에 실패했습니다.'),
    [withLoading, setMembership]
  );

  // [관리자] 유저 멤버십 상세 조회
  const adminGetUserMembership = useCallback(
    async (userId: number) =>
      withLoading(async () => {
        const service = getLoyaltyService();
        return await service.adminGetUserMembership(userId);
      }, '유저 멤버십 정보를 불러오는데 실패했습니다.'),
    [withLoading]
  );

  // [관리자] 유저 멤버십 등급 수동 변경
  const adminAdjustUserTier = useCallback(
    async (input: AdjustUserTierInput) =>
      withLoading(async () => {
        const service = getLoyaltyService();
        const res = await service.adminAdjustUserTier(input);

        if (res.success && res.data?.membership) {
          setMembership(res.data.membership);
        }
        return res;
      }, '등급 변경에 실패했습니다.'),
    [withLoading, setMembership]
  );

  // [관리자] 유저 별 수동 적립/차감
  const adminAdjustUserStars = useCallback(
    async (input: AdjustUserStarsInput) =>
      withLoading(async () => {
        const service = getLoyaltyService();
        const res = await service.adminAdjustUserStars(input);

        if (res.success && res.data?.membership) {
          setMembership(res.data.membership);
        }
        return res;
      }, '별 적립/차감에 실패했습니다.'),
    [withLoading, setMembership]
  );

  // [관리자] 유저 멤버십 초기화
  const adminResetUserMembership = useCallback(
    async (input: ResetUserMembershipInput) =>
      withLoading(async () => {
        const service = getLoyaltyService();
        return await service.adminResetUserMembership(input);
      }, '멤버십 초기화에 실패했습니다.'),
    [withLoading]
  );

  // ✅ 신규: [관리자] 멤버십 설정 DB 엔티티 조회
  const adminGetMembershipConfig = useCallback(
    async () =>
      withLoading(async () => {
        const service = getLoyaltyService();
        return await service.adminGetMembershipConfig();
      }, '관리자 멤버십 설정을 불러오는데 실패했습니다.'),
    [withLoading]
  );

  // ✅ 신규: [관리자] 멤버십 설정 수정
  const adminUpdateMembershipConfig = useCallback(
    async (input: UpdateMembershipConfigInput) =>
      withLoading(async () => {
        const service = getLoyaltyService();
        return await service.adminUpdateMembershipConfig(input);
      }, '멤버십 설정 저장에 실패했습니다.'),
    [withLoading]
  );

  // =========================================================================
  // 신규 Admin Queries
  // =========================================================================

  const adminGetMembershipList = useCallback(
    async (input: AdminMembershipListInput) =>
      withLoading(async () => {
        const service = getLoyaltyService();
        return await service.adminGetMembershipList(input);
      }, '멤버십 목록을 불러오는데 실패했습니다.'),
    [withLoading]
  );

  const adminGetUserStarHistory = useCallback(
    async (input: AdminStarHistoryInput) =>
      withLoading(async () => {
        const service = getLoyaltyService();
        return await service.adminGetUserStarHistory(input);
      }, '별 히스토리를 불러오는데 실패했습니다.'),
    [withLoading]
  );

  const adminGetUserCoupons = useCallback(
    async (input: AdminCouponListInput) =>
      withLoading(async () => {
        const service = getLoyaltyService();
        return await service.adminGetUserCoupons(input);
      }, '쿠폰 목록을 불러오는데 실패했습니다.'),
    [withLoading]
  );

  // =========================================================================
  // 신규 Admin Mutations (쿠폰)
  // =========================================================================

  const adminIssueCoupon = useCallback(
    async (input: AdminIssueCouponInput) =>
      withLoading(async () => {
        const service = getLoyaltyService();
        return await service.adminIssueCoupon(input);
      }, '쿠폰 발급에 실패했습니다.'),
    [withLoading]
  );

  const adminRevokeCoupon = useCallback(
    async (input: AdminRevokeCouponInput) =>
      withLoading(async () => {
        const service = getLoyaltyService();
        return await service.adminRevokeCoupon(input);
      }, '쿠폰 취소에 실패했습니다.'),
    [withLoading]
  );

  const adminBulkIssueCoupons = useCallback(
    async (input: AdminBulkIssueCouponInput) =>
      withLoading(async () => {
        const service = getLoyaltyService();
        return await service.adminBulkIssueCoupons(input);
      }, '쿠폰 일괄 발급에 실패했습니다.'),
    [withLoading]
  );

  // =========================================================================
  // 계산된 값 (서버에서 제공하는 값 활용)
  // =========================================================================

  const { membership } = context;

  // 서버에서 계산된 필드를 그대로 사용
  const computedValues = {
    // 다음 쿠폰까지 필요한 별 (서버 계산)
    starsToNextCoupon: membership?.starsToNextCoupon ?? 0,
    // 쿠폰 진행률 (서버 계산)
    couponProgress: membership?.couponProgress ?? 0,
    // 교환 가능한 쿠폰 수 (서버 계산)
    exchangeableCoupons: membership?.exchangeableCoupons ?? 0,
    // 다음 등급까지 필요한 별 (서버 계산)
    starsToNextTier: membership?.starsToNextTier ?? null,
    // 등급 진행률 (서버 계산)
    tierProgress: membership?.tierProgress ?? 0,
    // 등급 유지에 필요한 별 (서버 계산)
    starsToMaintainTier: membership?.starsToMaintainTier ?? 0,
    // 다음 등급명 (서버 계산)
    nextTierName: membership?.nextTierName ?? null,
    // 현재 등급 표시명 (서버 계산)
    currentTierDisplayName: membership?.currentTierDisplayName ?? 'WELCOME',
    // 심사일까지 남은 일수 (서버 계산)
    daysUntilReview: membership?.daysUntilReview ?? 0,
    availableStars: membership?.availableStars ?? 0, // 사용 가능한 별
    tierStars: membership?.tierStars ?? 0, // 현재 등급에서 적립한 별
  };

  return {
    ...context,
    ...computedValues,

    // 설정 조회
    fetchMembershipConfig,

    // Queries
    fetchMyCoupons,
    fetchCouponDetail,
    fetchCouponHistory,
    fetchGiftLinkInfo,

    // Mutations
    useCoupon,
    exchangeCoupon,
    giftCoupon,
    createGiftLink,
    claimGift,
    accumulateStars,

    // Admin Queries
    adminGetUserMembership,
    adminGetMembershipList,
    adminGetUserStarHistory,
    adminGetUserCoupons,
    adminGetMembershipConfig, // ✅ 신규

    // Admin Mutations
    adminAdjustUserTier,
    adminAdjustUserStars,
    adminResetUserMembership,
    adminIssueCoupon,
    adminRevokeCoupon,
    adminBulkIssueCoupons,
    adminUpdateMembershipConfig, // ✅ 신규
  };
};

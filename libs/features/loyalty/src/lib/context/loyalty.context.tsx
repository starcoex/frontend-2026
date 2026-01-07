import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import type {
  UserMembership,
  RewardCoupon,
  CouponHistoryItem,
} from '@starcoex-frontend/graphql';
import { LoyaltyState, LoyaltyContextValue, MembershipConfig } from '../types';

const LoyaltyContext = createContext<LoyaltyContextValue | undefined>(
  undefined
);

const initialState: LoyaltyState = {
  // 멤버십 설정 (비로그인 가능)
  config: null,
  configLoading: false,
  configError: null,

  // 개인 멤버십 정보 (로그인 필요)
  membership: null,

  // 쿠폰 관련
  coupons: [],
  couponHistory: [],

  // 공통 로딩/에러
  isLoading: false,
  error: null,
};

export const LoyaltyProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<LoyaltyState>(initialState);

  // =========================================================================
  // 설정 관련 액션
  // =========================================================================

  const setConfig = useCallback((config: MembershipConfig | null) => {
    setState((prev) => ({ ...prev, config }));
  }, []);

  const setConfigLoading = useCallback((configLoading: boolean) => {
    setState((prev) => ({ ...prev, configLoading }));
  }, []);

  const setConfigError = useCallback((configError: string | null) => {
    setState((prev) => ({ ...prev, configError, configLoading: false }));
  }, []);

  // =========================================================================
  // 멤버십 관련 액션
  // =========================================================================

  const setMembership = useCallback((membership: UserMembership | null) => {
    setState((prev) => ({ ...prev, membership }));
  }, []);

  // =========================================================================
  // 쿠폰 관련 액션
  // =========================================================================

  const setCoupons = useCallback((coupons: RewardCoupon[]) => {
    setState((prev) => ({ ...prev, coupons }));
  }, []);

  const addCoupon = useCallback((coupon: RewardCoupon) => {
    setState((prev) => ({ ...prev, coupons: [coupon, ...prev.coupons] }));
  }, []);

  const updateCoupon = useCallback(
    (code: string, updates: Partial<RewardCoupon>) => {
      setState((prev) => ({
        ...prev,
        coupons: prev.coupons.map((coupon) =>
          coupon.code === code ? { ...coupon, ...updates } : coupon
        ),
      }));
    },
    []
  );

  const removeCoupon = useCallback((code: string) => {
    setState((prev) => ({
      ...prev,
      coupons: prev.coupons.filter((coupon) => coupon.code !== code),
    }));
  }, []);

  const setCouponHistory = useCallback((couponHistory: CouponHistoryItem[]) => {
    setState((prev) => ({ ...prev, couponHistory }));
  }, []);

  // =========================================================================
  // 공통 액션
  // =========================================================================

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error, isLoading: false }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null, configError: null }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  // =========================================================================
  // Context Value
  // =========================================================================

  const value = useMemo<LoyaltyContextValue>(
    () => ({
      ...state,
      // 설정 관련
      setConfig,
      setConfigLoading,
      setConfigError,
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
      setError,
      clearError,
      reset,
    }),
    [
      state,
      setConfig,
      setConfigLoading,
      setConfigError,
      setMembership,
      setCoupons,
      addCoupon,
      updateCoupon,
      removeCoupon,
      setCouponHistory,
      setLoading,
      setError,
      clearError,
      reset,
    ]
  );

  return (
    <LoyaltyContext.Provider value={value}>{children}</LoyaltyContext.Provider>
  );
};

export const useLoyaltyContext = (): LoyaltyContextValue => {
  const ctx = useContext(LoyaltyContext);
  if (!ctx) {
    throw new Error('useLoyaltyContext must be used within a LoyaltyProvider');
  }
  return ctx;
};

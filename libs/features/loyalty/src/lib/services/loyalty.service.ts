import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  EXCHANGE_COUPON,
  GIFT_COUPON,
  ACCUMULATE_STARS,
  ExchangeCouponMutation,
  ExchangeCouponMutationVariables,
  GiftCouponMutation,
  GiftCouponMutationVariables,
  AccumulateStarsMutation,
  AccumulateStarsMutationVariables,
  ExchangeCouponInput,
  GiftCouponInput,
  AccumulateStarsInput,
  ExchangeCouponOutput,
  GiftCouponOutput,
  AccumulateStarsOutput,
  MyCouponsFilter,
  MyCouponsOutput,
  MyCouponsQuery,
  MyCouponsQueryVariables,
  GET_MY_COUPONS,
  CouponDetailOutput,
  CouponDetailQuery,
  CouponDetailQueryVariables,
  GET_COUPON_DETAIL,
  UseCouponInput,
  UseCouponOutput,
  UseCouponMutation,
  UseCouponMutationVariables,
  USE_COUPON,
  CouponHistoryFilter,
  CouponHistoryOutput,
  CouponHistoryQuery,
  CouponHistoryQueryVariables,
  GET_COUPON_HISTORY,
  CreateGiftLinkInput,
  GiftLinkInfoOutput,
  GiftLinkInfoQuery,
  GiftLinkInfoQueryVariables,
  GET_GIFT_LINK_INFO,
  CreateGiftLinkOutput,
  CreateGiftLinkMutation,
  CreateGiftLinkMutationVariables,
  CREATE_GIFT_LINK,
  ClaimGiftInput,
  ClaimGiftOutput,
  ClaimGiftMutation,
  ClaimGiftMutationVariables,
  CLAIM_GIFT,
  MembershipConfigQuery,
  GET_MEMBERSHIP_CONFIG,
  AdminMembershipDetailOutput,
  AdminGetUserMembershipQuery,
  AdminGetUserMembershipQueryVariables,
  ADMIN_GET_USER_MEMBERSHIP,
  ADMIN_ADJUST_USER_TIER,
  ADMIN_ADJUST_USER_STARS,
  ADMIN_RESET_USER_MEMBERSHIP,
  AdminAdjustUserTierMutationVariables,
  AdminAdjustUserTierMutation,
  AdminAdjustUserStarsMutation,
  AdminAdjustUserStarsMutationVariables,
  AdminResetUserMembershipMutation,
  AdminResetUserMembershipMutationVariables,
  ADMIN_GET_MEMBERSHIP_LIST,
  ADMIN_GET_USER_STAR_HISTORY,
  ADMIN_GET_USER_COUPONS,
  ADMIN_ISSUE_COUPON,
  ADMIN_REVOKE_COUPON,
  ADMIN_BULK_ISSUE_COUPONS,
  ADMIN_GET_MEMBERSHIP_CONFIG,
  ADMIN_UPDATE_MEMBERSHIP_CONFIG,
} from '@starcoex-frontend/graphql';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors';
import {
  AdjustUserStarsInput,
  AdjustUserStarsOutput,
  AdjustUserTierInput,
  AdjustUserTierOutput,
  AdminBulkIssueCouponInput,
  AdminBulkIssueCouponOutput,
  AdminCouponListInput,
  AdminCouponListOutput,
  AdminIssueCouponInput,
  AdminIssueCouponOutput,
  AdminMembershipListInput,
  AdminMembershipListOutput,
  AdminRevokeCouponInput,
  AdminRevokeCouponOutput,
  AdminStarHistoryInput,
  AdminStarHistoryOutput,
  ApiResponse,
  ILoyaltyService,
  MembershipConfigEntity,
  MembershipConfigOutput,
  ResetUserMembershipInput,
  ResetUserMembershipOutput,
  UpdateMembershipConfigInput,
  UpdateMembershipConfigOutput,
} from '../types';

export class LoyaltyService implements ILoyaltyService {
  constructor(private client: ApolloClient) {}

  // 공통 mutation helper
  private async mutate<
    TData = any,
    TVars extends OperationVariables = OperationVariables
  >(mutation: any, variables: TVars): Promise<ApiResponse<TData>> {
    try {
      const { data, error, extensions } = await this.client.mutate<
        TData,
        TVars
      >({
        mutation,
        variables,
        errorPolicy: 'all',
        fetchPolicy: 'network-only',
      });

      if (error) {
        const gqlError: GraphQLFormattedError = {
          message: error.message ?? '요청 처리 중 오류가 발생했습니다.',
          locations: undefined,
          path: undefined,
          extensions: (extensions ?? {}) as Record<string, unknown>,
        };
        const apiError = apiErrorFromGraphQLErrors([gqlError]);
        return createErrorResponse<TData>(apiError);
      }

      return { success: true, data: data as TData };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse<TData>(apiError);
    }
  }

  // 공통 query helper
  private async query<
    TData = any,
    TVars extends OperationVariables = OperationVariables
  >(query: any, variables?: TVars): Promise<ApiResponse<TData>> {
    try {
      const result = await this.client.query<TData, TVars>({
        query,
        variables: variables as TVars,
        errorPolicy: 'all',
        fetchPolicy: 'network-only',
      } as any);

      const { data, error, extensions } = result as {
        data?: TData;
        error?: { message?: string };
        extensions?: Record<string, unknown>;
      };

      if (error) {
        const gqlError: GraphQLFormattedError = {
          message: error.message ?? '요청 처리 중 오류가 발생했습니다.',
          locations: undefined,
          path: undefined,
          extensions: extensions ?? {},
        };
        const apiError = apiErrorFromGraphQLErrors([gqlError]);
        return createErrorResponse<TData>(apiError);
      }

      return { success: true, data: data as TData };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse<TData>(apiError);
    }
  }

  // ===== Queries =====

  /**
   * 멤버십 설정 조회 (비로그인 가능)
   * - 랜딩 페이지, 마케팅 페이지에서 사용
   */
  async getMembershipConfig(): Promise<ApiResponse<MembershipConfigOutput>> {
    const res = await this.query<MembershipConfigQuery>(GET_MEMBERSHIP_CONFIG);
    if (res.success && res.data?.membershipConfig) {
      return { success: true, data: res.data.membershipConfig };
    }
    return res as unknown as ApiResponse<MembershipConfigOutput>;
  }

  async getMyCoupons(
    filter?: MyCouponsFilter
  ): Promise<ApiResponse<MyCouponsOutput>> {
    const res = await this.query<MyCouponsQuery, MyCouponsQueryVariables>(
      GET_MY_COUPONS,
      { filter }
    );
    if (res.success && res.data?.myCoupons) {
      return { success: true, data: res.data.myCoupons };
    }
    return res as unknown as ApiResponse<MyCouponsOutput>;
  }

  async getCouponDetail(
    code: string
  ): Promise<ApiResponse<CouponDetailOutput>> {
    const res = await this.query<CouponDetailQuery, CouponDetailQueryVariables>(
      GET_COUPON_DETAIL,
      { code }
    );
    if (res.success && res.data?.coupon) {
      return { success: true, data: res.data.coupon };
    }
    return res as ApiResponse<CouponDetailOutput>;
  }

  async getCouponHistory(
    filter?: CouponHistoryFilter
  ): Promise<ApiResponse<CouponHistoryOutput>> {
    const res = await this.query<
      CouponHistoryQuery,
      CouponHistoryQueryVariables
    >(GET_COUPON_HISTORY, { filter });
    if (res.success && res.data?.couponHistory) {
      return { success: true, data: res.data.couponHistory };
    }
    return res as unknown as ApiResponse<CouponHistoryOutput>;
  }

  async getGiftLinkInfo(
    token: string
  ): Promise<ApiResponse<GiftLinkInfoOutput>> {
    const res = await this.query<GiftLinkInfoQuery, GiftLinkInfoQueryVariables>(
      GET_GIFT_LINK_INFO,
      { token }
    );
    if (res.success && res.data?.giftLinkInfo) {
      return { success: true, data: res.data.giftLinkInfo };
    }
    return res as unknown as ApiResponse<GiftLinkInfoOutput>;
  }

  async adminGetUserMembership(
    userId: number
  ): Promise<ApiResponse<AdminMembershipDetailOutput>> {
    const res = await this.query<
      AdminGetUserMembershipQuery,
      AdminGetUserMembershipQueryVariables
    >(ADMIN_GET_USER_MEMBERSHIP, { userId });
    if (res.success && res.data?.adminGetUserMembership) {
      return { success: true, data: res.data.adminGetUserMembership };
    }
    return res as unknown as ApiResponse<AdminMembershipDetailOutput>;
  }

  // ✅ 신규: [관리자] 멤버십 설정 DB 엔티티 조회
  async adminGetMembershipConfig(): Promise<
    ApiResponse<MembershipConfigEntity>
  > {
    const res = await this.query<{
      adminGetMembershipConfig: MembershipConfigEntity;
    }>(ADMIN_GET_MEMBERSHIP_CONFIG);
    if (res.success && res.data?.adminGetMembershipConfig) {
      return { success: true, data: res.data.adminGetMembershipConfig };
    }
    return res as unknown as ApiResponse<MembershipConfigEntity>;
  }

  // ===== Mutations =====

  async useCoupon(
    input: UseCouponInput
  ): Promise<ApiResponse<UseCouponOutput>> {
    const res = await this.mutate<
      UseCouponMutation,
      UseCouponMutationVariables
    >(USE_COUPON, { input });
    if (res.success && res.data?.useCoupon) {
      return { success: true, data: res.data.useCoupon };
    }
    return res as unknown as ApiResponse<UseCouponOutput>;
  }

  async exchangeCoupon(
    input: ExchangeCouponInput
  ): Promise<ApiResponse<ExchangeCouponOutput>> {
    const res = await this.mutate<
      ExchangeCouponMutation,
      ExchangeCouponMutationVariables
    >(EXCHANGE_COUPON, { input });
    if (res.success && res.data?.exchangeCoupon) {
      return { success: true, data: res.data.exchangeCoupon };
    }
    return res as ApiResponse<ExchangeCouponOutput>;
  }

  async giftCoupon(
    input: GiftCouponInput
  ): Promise<ApiResponse<GiftCouponOutput>> {
    const res = await this.mutate<
      GiftCouponMutation,
      GiftCouponMutationVariables
    >(GIFT_COUPON, { input });
    if (res.success && res.data?.giftCoupon) {
      return { success: true, data: res.data.giftCoupon };
    }
    return res as ApiResponse<GiftCouponOutput>;
  }

  async createGiftLink(
    input: CreateGiftLinkInput
  ): Promise<ApiResponse<CreateGiftLinkOutput>> {
    const res = await this.mutate<
      CreateGiftLinkMutation,
      CreateGiftLinkMutationVariables
    >(CREATE_GIFT_LINK, { input });
    if (res.success && res.data?.createGiftLink) {
      return { success: true, data: res.data.createGiftLink };
    }
    return res as ApiResponse<CreateGiftLinkOutput>;
  }

  async claimGift(
    input: ClaimGiftInput
  ): Promise<ApiResponse<ClaimGiftOutput>> {
    const res = await this.mutate<
      ClaimGiftMutation,
      ClaimGiftMutationVariables
    >(CLAIM_GIFT, { input });
    if (res.success && res.data?.claimGift) {
      return { success: true, data: res.data.claimGift };
    }
    return res as ApiResponse<ClaimGiftOutput>;
  }

  async accumulateStars(
    input: AccumulateStarsInput
  ): Promise<ApiResponse<AccumulateStarsOutput>> {
    const res = await this.mutate<
      AccumulateStarsMutation,
      AccumulateStarsMutationVariables
    >(ACCUMULATE_STARS, { input });
    if (res.success && res.data?.accumulateStars) {
      return { success: true, data: res.data.accumulateStars };
    }
    return res as ApiResponse<AccumulateStarsOutput>;
  }

  async adminAdjustUserTier(
    input: AdjustUserTierInput
  ): Promise<ApiResponse<AdjustUserTierOutput>> {
    const res = await this.mutate<
      AdminAdjustUserTierMutation,
      AdminAdjustUserTierMutationVariables
    >(ADMIN_ADJUST_USER_TIER, { input });
    if (res.success && res.data?.adminAdjustUserTier) {
      return { success: true, data: res.data.adminAdjustUserTier };
    }
    return res as unknown as ApiResponse<AdjustUserTierOutput>;
  }

  async adminAdjustUserStars(
    input: AdjustUserStarsInput
  ): Promise<ApiResponse<AdjustUserStarsOutput>> {
    const res = await this.mutate<
      AdminAdjustUserStarsMutation,
      AdminAdjustUserStarsMutationVariables
    >(ADMIN_ADJUST_USER_STARS, { input });
    if (res.success && res.data?.adminAdjustUserStars) {
      return { success: true, data: res.data.adminAdjustUserStars };
    }
    return res as unknown as ApiResponse<AdjustUserStarsOutput>;
  }

  async adminResetUserMembership(
    input: ResetUserMembershipInput
  ): Promise<ApiResponse<ResetUserMembershipOutput>> {
    const res = await this.mutate<
      AdminResetUserMembershipMutation,
      AdminResetUserMembershipMutationVariables
    >(ADMIN_RESET_USER_MEMBERSHIP, { input });
    if (res.success && res.data?.adminResetUserMembership) {
      return { success: true, data: res.data.adminResetUserMembership };
    }
    return res as unknown as ApiResponse<ResetUserMembershipOutput>;
  }

  // ✅ 신규: [관리자] 멤버십 설정 수정
  async adminUpdateMembershipConfig(
    input: UpdateMembershipConfigInput
  ): Promise<ApiResponse<UpdateMembershipConfigOutput>> {
    const res = await this.mutate<
      { adminUpdateMembershipConfig: UpdateMembershipConfigOutput },
      { input: UpdateMembershipConfigInput }
    >(ADMIN_UPDATE_MEMBERSHIP_CONFIG, { input });
    if (res.success && res.data?.adminUpdateMembershipConfig) {
      return { success: true, data: res.data.adminUpdateMembershipConfig };
    }
    return res as unknown as ApiResponse<UpdateMembershipConfigOutput>;
  }

  // ===== 신규 Admin Queries =====

  async adminGetMembershipList(
    input: AdminMembershipListInput
  ): Promise<ApiResponse<AdminMembershipListOutput>> {
    const res = await this.query<
      { adminGetMembershipList: AdminMembershipListOutput },
      { input: AdminMembershipListInput }
    >(ADMIN_GET_MEMBERSHIP_LIST, { input });
    if (res.success && res.data?.adminGetMembershipList) {
      return { success: true, data: res.data.adminGetMembershipList };
    }
    return res as unknown as ApiResponse<AdminMembershipListOutput>;
  }

  async adminGetUserStarHistory(
    input: AdminStarHistoryInput
  ): Promise<ApiResponse<AdminStarHistoryOutput>> {
    const res = await this.query<
      { adminGetUserStarHistory: AdminStarHistoryOutput },
      { input: AdminStarHistoryInput }
    >(ADMIN_GET_USER_STAR_HISTORY, { input });
    if (res.success && res.data?.adminGetUserStarHistory) {
      return { success: true, data: res.data.adminGetUserStarHistory };
    }
    return res as unknown as ApiResponse<AdminStarHistoryOutput>;
  }

  async adminGetUserCoupons(
    input: AdminCouponListInput
  ): Promise<ApiResponse<AdminCouponListOutput>> {
    const res = await this.query<
      { adminGetUserCoupons: AdminCouponListOutput },
      { input: AdminCouponListInput }
    >(ADMIN_GET_USER_COUPONS, { input });
    if (res.success && res.data?.adminGetUserCoupons) {
      return { success: true, data: res.data.adminGetUserCoupons };
    }
    return res as unknown as ApiResponse<AdminCouponListOutput>;
  }

  // ===== 신규 Admin Mutations =====

  async adminIssueCoupon(
    input: AdminIssueCouponInput
  ): Promise<ApiResponse<AdminIssueCouponOutput>> {
    const res = await this.mutate<
      { adminIssueCoupon: AdminIssueCouponOutput },
      { input: AdminIssueCouponInput }
    >(ADMIN_ISSUE_COUPON, { input });
    if (res.success && res.data?.adminIssueCoupon) {
      return { success: true, data: res.data.adminIssueCoupon };
    }
    return res as unknown as ApiResponse<AdminIssueCouponOutput>;
  }

  async adminRevokeCoupon(
    input: AdminRevokeCouponInput
  ): Promise<ApiResponse<AdminRevokeCouponOutput>> {
    const res = await this.mutate<
      { adminRevokeCoupon: AdminRevokeCouponOutput },
      { input: AdminRevokeCouponInput }
    >(ADMIN_REVOKE_COUPON, { input });
    if (res.success && res.data?.adminRevokeCoupon) {
      return { success: true, data: res.data.adminRevokeCoupon };
    }
    return res as unknown as ApiResponse<AdminRevokeCouponOutput>;
  }

  async adminBulkIssueCoupons(
    input: AdminBulkIssueCouponInput
  ): Promise<ApiResponse<AdminBulkIssueCouponOutput>> {
    const res = await this.mutate<
      { adminBulkIssueCoupons: AdminBulkIssueCouponOutput },
      { input: AdminBulkIssueCouponInput }
    >(ADMIN_BULK_ISSUE_COUPONS, { input });
    if (res.success && res.data?.adminBulkIssueCoupons) {
      return { success: true, data: res.data.adminBulkIssueCoupons };
    }
    return res as unknown as ApiResponse<AdminBulkIssueCouponOutput>;
  }
}

import { gql } from '@apollo/client';

// ===== Fragments =====

export const LOYALTY_ERROR_INFO_FIELDS = gql`
  fragment LoyaltyErrorInfoFields on ErrorInfo {
    code
    message
    details
  }
`;

export const REWARD_COUPON_FIELDS = gql`
  fragment RewardCouponFields on RewardCoupon {
    id
    code
    name
    type
    status
    userId
    expiresAt
    usedAt
    usedAtStoreId
    isGifted
    giftedFrom
    giftedAt
    expiryNotifiedAt
    issueType # ✅ 추가
    issueReason # ✅ 추가
    createdAt
    updatedAt
  }
`;

export const USER_MEMBERSHIP_FIELDS = gql`
  fragment UserMembershipFields on UserMembership {
    userId
    currentTier
    availableStars
    tierStars
    tierStartDate
    nextReviewDate
    createdAt
    updatedAt

    # 계산된 필드
    starsToNextCoupon
    couponProgress
    exchangeableCoupons
    starsToNextTier
    tierProgress
    starsToMaintainTier
    nextTierName
    currentTierDisplayName
    daysUntilReview
  }
`;

export const COUPON_HISTORY_ITEM_FIELDS = gql`
  fragment CouponHistoryItemFields on CouponHistoryItem {
    id
    action
    couponCode
    couponName
    actionDate
    relatedUserName
    relatedUserId
    storeId
    message
  }
`;

export const GIFT_LINK_INFO_FIELDS = gql`
  fragment GiftLinkInfoFields on GiftLinkInfoOutput {
    isValid
    couponName
    couponType
    message
    expiresAt
    senderMessage
  }
`;

// ===== Queries =====

// ✅ 추가: 멤버십 설정 조회 (비로그인 가능)
export const GET_MEMBERSHIP_CONFIG = gql`
  query MembershipConfig {
    membershipConfig {
      welcomeStars
      welcomeCouponDays
      couponCost
      starExpiryYears
      tierThresholds {
        SHINE
        STAR
      }
      earningRates {
        GAS
        OIL
        CAR_CARE
      }
    }
  }
`;

// ✅ 추가: 설정 관련 Fragment (선택적)
export const MEMBERSHIP_CONFIG_FIELDS = gql`
  fragment MembershipConfigFields on MembershipConfigOutput {
    welcomeStars
    welcomeCouponDays
    couponCost
    starExpiryYears
    tierThresholds {
      SHINE
      STAR
    }
    earningRates {
      GAS
      OIL
      CAR_CARE
    }
  }
`;

/**
 * 참고: 이 스키마는 Federation Subgraph로 'User' 타입을 확장하고 있습니다.
 * 따라서 별도의 GetQuery보다는 메인 유저 쿼리(예: me, getUser)에서
 * 아래 Fragment를 사용하여 멤버십 정보를 함께 조회하는 패턴을 사용합니다.
 */
export const USER_LOYALTY_INFO_ON_USER = gql`
  ${USER_MEMBERSHIP_FIELDS}
  fragment UserLoyaltyInfoOnUser on User {
    membership {
      ...UserMembershipFields
    }
  }
`;

// 내 쿠폰 목록 조회
export const GET_MY_COUPONS = gql`
  ${REWARD_COUPON_FIELDS}
  query MyCoupons($filter: MyCouponsFilter) {
    myCoupons(filter: $filter) {
      coupons {
        ...RewardCouponFields
      }
      totalCount
      hasMore
    }
  }
`;

// 쿠폰 상세 조회 (QR/바코드용)
export const GET_COUPON_DETAIL = gql`
  ${REWARD_COUPON_FIELDS}
  query CouponDetail($code: String!) {
    coupon(code: $code) {
      coupon {
        ...RewardCouponFields
      }
      qrData
      barcodeData
    }
  }
`;

// 쿠폰 사용/선물 내역 조회
export const GET_COUPON_HISTORY = gql`
  ${COUPON_HISTORY_ITEM_FIELDS}
  query CouponHistory($filter: CouponHistoryFilter) {
    couponHistory(filter: $filter) {
      items {
        ...CouponHistoryItemFields
      }
      totalCount
      hasMore
    }
  }
`;

// 선물 링크 정보 조회 (수령 전 미리보기, 비로그인 가능)
export const GET_GIFT_LINK_INFO = gql`
  ${GIFT_LINK_INFO_FIELDS}
  query GiftLinkInfo($token: String!) {
    giftLinkInfo(token: $token) {
      ...GiftLinkInfoFields
    }
  }
`;

// ===== Mutations =====

// 쿠폰 사용 처리
export const USE_COUPON = gql`
  mutation UseCoupon($input: UseCouponInput!) {
    useCoupon(input: $input) {
      success
      message
    }
  }
`;

// 쿠폰 교환 (별 사용)
export const EXCHANGE_COUPON = gql`
  ${LOYALTY_ERROR_INFO_FIELDS}
  ${REWARD_COUPON_FIELDS}
  mutation ExchangeCoupon($input: ExchangeCouponInput!) {
    exchangeCoupon(input: $input) {
      success
      message
      coupon {
        ...RewardCouponFields
      }
      error {
        ...LoyaltyErrorInfoFields
      }
    }
  }
`;

// 쿠폰 선물하기 (이메일 기반)
export const GIFT_COUPON = gql`
  ${LOYALTY_ERROR_INFO_FIELDS}
  ${REWARD_COUPON_FIELDS}
  mutation GiftCoupon($input: GiftCouponInput!) {
    giftCoupon(input: $input) {
      success
      message
      coupon {
        ...RewardCouponFields
      }
      error {
        ...LoyaltyErrorInfoFields
      }
    }
  }
`;

// 선물 링크 생성 (딥링크용)
export const CREATE_GIFT_LINK = gql`
  ${LOYALTY_ERROR_INFO_FIELDS}
  mutation CreateGiftLink($input: CreateGiftLinkInput!) {
    createGiftLink(input: $input) {
      success
      message
      giftToken
      giftUrl
      error {
        ...LoyaltyErrorInfoFields
      }
    }
  }
`;

// 선물 수령 (딥링크로 접속한 사용자)
export const CLAIM_GIFT = gql`
  ${LOYALTY_ERROR_INFO_FIELDS}
  ${REWARD_COUPON_FIELDS}
  mutation ClaimGift($input: ClaimGiftInput!) {
    claimGift(input: $input) {
      success
      message
      coupon {
        ...RewardCouponFields
      }
      error {
        ...LoyaltyErrorInfoFields
      }
    }
  }
`;

// [관리자/시스템] 별 적립
export const ACCUMULATE_STARS = gql`
  ${LOYALTY_ERROR_INFO_FIELDS}
  ${USER_MEMBERSHIP_FIELDS}
  mutation AccumulateStars($input: AccumulateStarsInput!) {
    accumulateStars(input: $input) {
      success
      message
      earnedStars
      membership {
        ...UserMembershipFields
      }
      error {
        ...LoyaltyErrorInfoFields
      }
    }
  }
`;

// ===== Admin Queries =====

// [관리자] 유저 멤버십 상세 조회
export const ADMIN_GET_USER_MEMBERSHIP = gql`
  ${USER_MEMBERSHIP_FIELDS}
  query AdminGetUserMembership($userId: Int!) {
    adminGetUserMembership(userId: $userId) {
      membership {
        ...UserMembershipFields
      }
      totalActivities
      totalCoupons
      joinedAt
    }
  }
`;

// ✅ 신규: [관리자] 멤버십 설정 DB 엔티티 조회 (flat 구조)
export const ADMIN_GET_MEMBERSHIP_CONFIG = gql`
  query AdminGetMembershipConfig {
    adminGetMembershipConfig {
      id
      welcomeStars
      welcomeCouponDays
      couponCost
      starExpiryYears
      tierThresholdShine
      tierThresholdStar
      earningRateGas
      earningRateOil
      earningRateCarCare
      updatedAt
      updatedBy
    }
  }
`;

// ===== Admin Mutations =====

// ✅ 신규: [관리자] 멤버십 설정 수정
export const ADMIN_UPDATE_MEMBERSHIP_CONFIG = gql`
  mutation AdminUpdateMembershipConfig($input: UpdateMembershipConfigInput!) {
    adminUpdateMembershipConfig(input: $input) {
      success
      message
      config {
        id
        welcomeStars
        welcomeCouponDays
        couponCost
        starExpiryYears
        tierThresholdShine
        tierThresholdStar
        earningRateGas
        earningRateOil
        earningRateCarCare
        updatedAt
        updatedBy
      }
    }
  }
`;

// [관리자] 유저 멤버십 등급 수동 변경
export const ADMIN_ADJUST_USER_TIER = gql`
  ${LOYALTY_ERROR_INFO_FIELDS}
  ${USER_MEMBERSHIP_FIELDS}
  mutation AdminAdjustUserTier($input: AdjustUserTierInput!) {
    adminAdjustUserTier(input: $input) {
      success
      message
      membership {
        ...UserMembershipFields
      }
      previousTier
      newTier
    }
  }
`;

// [관리자] 유저 별 수동 적립/차감
export const ADMIN_ADJUST_USER_STARS = gql`
  ${USER_MEMBERSHIP_FIELDS}
  mutation AdminAdjustUserStars($input: AdjustUserStarsInput!) {
    adminAdjustUserStars(input: $input) {
      success
      message
      membership {
        ...UserMembershipFields
      }
      adjustedAmount
      previousStars
      currentStars
    }
  }
`;

// [관리자] 유저 멤버십 초기화
export const ADMIN_RESET_USER_MEMBERSHIP = gql`
  mutation AdminResetUserMembership($input: ResetUserMembershipInput!) {
    adminResetUserMembership(input: $input) {
      success
      message
    }
  }
`;

// [관리자] 전체 멤버십 목록 (등급 필터 + 페이지네이션)
export const ADMIN_GET_MEMBERSHIP_LIST = gql`
  ${USER_MEMBERSHIP_FIELDS}
  query AdminGetMembershipList($input: AdminMembershipListInput!) {
    adminGetMembershipList(input: $input) {
      memberships {
        ...UserMembershipFields
      }
      totalCount
      hasMore
    }
  }
`;

// [관리자] 유저 별 적립/사용/소멸 히스토리
export const ADMIN_GET_USER_STAR_HISTORY = gql`
  query AdminGetUserStarHistory($input: AdminStarHistoryInput!) {
    adminGetUserStarHistory(input: $input) {
      histories {
        id
        userId
        amount
        reason
        category
        expiresAt
        usedAmount
        referenceId
        createdAt
        updatedAt
        deletedAt
      }
      totalCount
      hasMore
    }
  }
`;

// [관리자] 유저 쿠폰 목록 조회
export const ADMIN_GET_USER_COUPONS = gql`
  ${REWARD_COUPON_FIELDS}
  query AdminGetUserCoupons($input: AdminCouponListInput!) {
    adminGetUserCoupons(input: $input) {
      coupons {
        ...RewardCouponFields
      }
      totalCount
      hasMore
    }
  }
`;

// ===== 신규 Admin Mutations =====

// [관리자] 유저에게 쿠폰 수동 발급
export const ADMIN_ISSUE_COUPON = gql`
  ${REWARD_COUPON_FIELDS}
  mutation AdminIssueCoupon($input: AdminIssueCouponInput!) {
    adminIssueCoupon(input: $input) {
      success
      message
      coupon {
        ...RewardCouponFields
      }
    }
  }
`;

// [관리자] 유저 쿠폰 강제 취소
export const ADMIN_REVOKE_COUPON = gql`
  mutation AdminRevokeCoupon($input: AdminRevokeCouponInput!) {
    adminRevokeCoupon(input: $input) {
      success
      message
    }
  }
`;

// [관리자] 프로모션 쿠폰 일괄 발급
export const ADMIN_BULK_ISSUE_COUPONS = gql`
  mutation AdminBulkIssueCoupons($input: AdminBulkIssueCouponInput!) {
    adminBulkIssueCoupons(input: $input) {
      success
      message
      totalCount
      successCount
      failCount
      results {
        userId
        success
        couponCode
        errorMessage
      }
    }
  }
`;

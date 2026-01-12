import { gql } from '@apollo/client';
import { USER_MEMBERSHIP_FIELDS } from './loyalty.queries.js';

export const ERROR_INFO_FIELDS = gql`
  fragment ErrorInfoFields on ErrorInfo {
    code
    message
    details
  }
`;

// [수정됨] Auth Service에서도 인식 가능한 기본 유저 필드 (Membership 제외)
export const CORE_USER_FIELDS = gql`
  fragment CoreUserFields on User {
    id
    accessToken
    avatarUrl
    createdAt
    deletedAt
    email
    emailVerified
    emailVerifiedAt
    hasBusiness
    isActive
    isSocialUser
    lastLoginAt
    marketingConsent
    marketingConsentDate
    marketingConsentIp
    marketingConsentSource
    name
    password
    phoneNumber
    refreshToken
    rememberMe
    role
    socialAccountsCount
    termsAccepted
    termsAcceptedAt
    twoFactorEnabled
    updatedAt
    userType
    telecomOperator
    realPhoneNumber
    realName
    realGender
    realBirthDate
    isForeigner
    identityVerifiedAt
    identityVerified
    ci
    activation {
      twoFactorSecret
      twoFactorActivated
      userId
      updatedAt
      socialLinkToken
      socialLinkExpiresAt
      socialLinkData
      resetPasswordToken
      resetPasswordExpiresAt
      id
      emergencyEmailCodeExpiresAt
      emergencyEmailCode
      emailChangeToken
      emailChangeNewEmail
      emailChangeExpiresAt
      deletedAt
      createdAt
    }
    avatar {
      userId
      url
      updatedAt
      publicId
      id
      deletedAt
      createdAt
      altText
    }
    business {
      apiResponse {
        data {
          b_no
          b_stt
          b_stt_cd
          end_dt
          invoice_apply_dt
          rbf_tax_type
          rbf_tax_type_cd
          tax_type
          tax_type_cd
          tax_type_change_dt
          utcc_yn
        }
      }
      businessAddress
      businessItem
      businessName
      businessNumber
      businessStatusCode
      businessType
      createdAt
      deletedAt
      establishmentDate
      id
      isValidated
      representativeName
      updatedAt
      userId
      validatedAt
      validationData
      validationMethod
    }
  }
`;

export const USER_FIELDS = gql`
  ${CORE_USER_FIELDS}
  ${USER_MEMBERSHIP_FIELDS}
  fragment UserFields on User {
    ...CoreUserFields
    membership {
      ...UserMembershipFields
    }
  }
`;

export const TWO_FACTOR_STATUS_FIELDS = gql`
  fragment TwoFactorStatusFields on TwoFactorStatus {
    isEnabled
    isSocialUser
    success
  }
`;

export const BUSINESS_UPDATE_INFO_FIELDS = gql`
  fragment BusinessUpdateInfoFields on BusinessUpdateInfo {
    field
    previousValue
    newValue
  }
`;

export const EMAIL_CHANGE_INFO_FIELDS = gql`
  fragment EmailChangeInfoFields on EmailChangeInfo {
    maskedEmail
    originalEmail
    isVerified
    verifiedAt
  }
`;

export const IDENTITY_VERIFICATION_FIELDS = gql`
  fragment IdentityVerificationFields on IdentityVerification {
    id
    identityVerificationId
    storeId
    channelKey
    status
    statusMessage
    verifiedCustomer
    userId
    verifiedAt
    errorCode
    errorMessage
    expiresAt
  }
`;

// 페이지네이션 정보
export const PAGINATION_INFO_FIELDS = gql`
  fragment PaginationInfoFields on PaginationInfo {
    total
    page
    limit
    totalPages
    hasNextPage
    hasPreviousPage
  }
`;

// 사용자 초대 정보
export const USER_INVITATION_FIELDS = gql`
  fragment UserInvitationFields on UserInvitation {
    id
    email
    userType
    role
    status
    invitedBy
    adminMessage
    expiresAt
    acceptedAt
    cancelledAt
    cancelledBy
    resentCount
    lastResentAt
    createdAt
    updatedAt
  }
`;

// 통계 관련 Fragments
export const OVERVIEW_STATS_FIELDS = gql`
  fragment OverviewStatsFields on OverviewStats {
    totalUsers
    activeUsers
    inactiveUsers
    deletedUsers
    activeRate
  }
`;

export const VERIFICATION_STATS_FIELDS = gql`
  fragment VerificationStatsFields on VerificationStats {
    emailUnverifiedUsers
    emailVerifiedUsers
    identityVerifiedUsers
    verificationRate
  }
`;

export const USER_TYPE_STATS_FIELDS = gql`
  fragment UserTypeStatsFields on UserTypeStats {
    businessUsers
    individualUsers
    socialUsers
    socialUserRate
  }
`;

export const GROWTH_STATS_FIELDS = gql`
  fragment GrowthStatsFields on GrowthStats {
    recentUsers7Days
    recentUsers30Days
    dailyAverage7Days
    dailyAverage30Days
  }
`;

/**
 * Queries
 */

// 현재 로그인한 사용자 조회
export const GET_LOGGED_IN_USER = gql`
  ${USER_FIELDS}
  query GetLoggedInUser {
    getLoggedInUser {
      ...UserFields
    }
  }
`;

// 2FA 상태 조회
export const GET_2FA_STATUS = gql`
  ${TWO_FACTOR_STATUS_FIELDS}
  query Get2FAStatus {
    get2FAStatus {
      ...TwoFactorStatusFields
    }
  }
`;

// 소셜 로그인 URL 생성
export const GET_SOCIAL_LOGIN_URL = gql`
  query GetSocialLoginUrl($input: SocialLoginStartInput!) {
    getSocialLoginUrl(input: $input) {
      success
      error {
        ...ErrorInfoFields
      }
      loginUrl
      provider
    }
  }
  ${ERROR_INFO_FIELDS}
`;

// 연결된 소셜 계정 제공자 목록
export const GET_CONNECTED_SOCIAL_PROVIDERS = gql`
  query GetConnectedSocialProviders {
    getConnectedSocialProviders
  }
`;

// 본인인증 단건 조회
export const GET_IDENTITY_VERIFICATION = gql`
  ${IDENTITY_VERIFICATION_FIELDS}
  query GetIdentityVerification($identityVerificationId: String!) {
    identityVerification(identityVerificationId: $identityVerificationId) {
      ...IdentityVerificationFields
    }
  }
`;

// 본인인증 클라이언트 설정 조회 (JSON string)
export const GET_IDENTITY_VERIFICATION_CONFIG = gql`
  query GetIdentityVerificationConfig {
    getIdentityVerificationConfig
  }
`;

// 본인인증 요청 데이터 생성 (JSON string)
export const GENERATE_VERIFICATION_REQUEST = gql`
  query GenerateVerificationRequest(
    $identityVerificationId: String!
    $customRedirectPath: String
  ) {
    generateVerificationRequest(
      identityVerificationId: $identityVerificationId
      customRedirectPath: $customRedirectPath
    )
  }
`;

// 본인인증 URL 생성 (SSR용)
export const GENERATE_VERIFICATION_URL = gql`
  query GenerateVerificationUrl(
    $identityVerificationId: String!
    $customRedirectPath: String
  ) {
    generateVerificationUrl(
      identityVerificationId: $identityVerificationId
      customRedirectPath: $customRedirectPath
    )
  }
`;

export const VALIDATE_BUSINESS_NUMBER = gql`
  ${ERROR_INFO_FIELDS}
  query ValidateBusinessNumber($businessNumber: String!) {
    validateBusinessNumber(businessNumber: $businessNumber) {
      isValid
      rawData
      statusCode
      statusMessage
      success
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

/**
 * ========================================
 * 새로 추가: 관리자 전용 Queries
 * ========================================
 */

// 전체 사용자 목록 조회 (관리자 전용)
export const GET_ALL_USERS = gql`
  ${USER_FIELDS}
  ${PAGINATION_INFO_FIELDS}
  ${ERROR_INFO_FIELDS}
  query GetAllUsers(
    $page: Int
    $limit: Int
    $search: String
    $role: [String!]
    $status: [String!]
  ) {
    getAllUsers(
      page: $page
      limit: $limit
      search: $search
      role: $role
      status: $status
    ) {
      success
      users {
        ...UserFields
      }
      pagination {
        ...PaginationInfoFields
      }
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// 특정 사용자 조회 (관리자 전용)
export const GET_USER_BY_ID = gql`
  ${USER_FIELDS}
  query GetUserById($id: Int!) {
    getUserById(id: $id) {
      ...UserFields
    }
  }
`;

// 사용자 통계 (관리자 전용)
export const GET_USERS_STATS = gql`
  ${OVERVIEW_STATS_FIELDS}
  ${VERIFICATION_STATS_FIELDS}
  ${USER_TYPE_STATS_FIELDS}
  ${GROWTH_STATS_FIELDS}
  ${ERROR_INFO_FIELDS}
  query GetUsersStats {
    getUsersStats {
      success
      overview {
        ...OverviewStatsFields
      }
      verification {
        ...VerificationStatsFields
      }
      userTypes {
        ...UserTypeStatsFields
      }
      growth {
        ...GrowthStatsFields
      }
      roleDistribution
      timestamp
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// 초대 목록 조회
export const GET_INVITATIONS = gql`
  ${USER_INVITATION_FIELDS}
  ${PAGINATION_INFO_FIELDS}
  ${ERROR_INFO_FIELDS}
  query GetInvitations($page: Int, $limit: Int, $status: InvitationStatus) {
    getInvitations(page: $page, limit: $limit, status: $status) {
      success
      invitations {
        ...UserInvitationFields
      }
      pagination {
        ...PaginationInfoFields
      }
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// ✅ 초대 토큰 검증 (공개 API)
export const VERIFY_INVITATION_TOKEN = gql`
  query VerifyInvitationToken($token: String!) {
    verifyInvitationToken(token: $token) {
      valid
      email
      role
      userType
      adminMessage
    }
  }
`;

/**
 * Mutations
 */

// 회원가입
export const REGISTER_USER = gql`
  ${ERROR_INFO_FIELDS}
  ${CORE_USER_FIELDS}
  mutation RegisterUser($registerInput: RegisterUserInput!) {
    registerUser(registerInput: $registerInput) {
      success
      message
      verificationMessage
      marketingConsentMessage
      error {
        ...ErrorInfoFields
      }
      user {
        ...CoreUserFields
      }
    }
  }
`;

// 이메일 인증 코드 확인
export const VERIFY_ACTIVATION_CODE = gql`
  ${ERROR_INFO_FIELDS}
  mutation VerifyActivationCode($verifyInput: VerifyActivationCodeInput!) {
    verifyActivationCode(verifyInput: $verifyInput) {
      success
      verified
      successMessage
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// 이메일 인증 코드 재발송
export const RESEND_ACTIVATION_CODE = gql`
  ${ERROR_INFO_FIELDS}
  ${CORE_USER_FIELDS}
  mutation ResendActivationCode($input: ResendActivationCodeInput!) {
    resendActivationCode(input: $input) {
      success
      message
      error {
        ...ErrorInfoFields
      }
      user {
        ...CoreUserFields
      }
    }
  }
`;

// 1단계 로그인
export const LOGIN_STEP1 = gql`
  ${ERROR_INFO_FIELDS}
  ${CORE_USER_FIELDS}
  mutation LoginStep1($loginInput: LoginUser1Input!) {
    loginStep1(loginInput: $loginInput) {
      success
      requires2FA
      tempToken
      accessToken
      refreshToken
      error {
        ...ErrorInfoFields
      }
      user {
        ...CoreUserFields
      }
    }
  }
`;

// 2단계 로그인 (2FA)
export const LOGIN_STEP2 = gql`
  ${ERROR_INFO_FIELDS}
  mutation LoginStep2($loginInput: LoginUser2Input!) {
    loginStep2(loginInput: $loginInput) {
      success
      accessToken
      refreshToken
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// 사용자 계정 탈퇴 (Soft Delete)
export const DELETE_ACCOUNT = gql`
  ${ERROR_INFO_FIELDS}
  mutation DeleteAccount {
    deleteAccount {
      deletedAt
      message
      success
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// 2FA QR 코드 생성
export const GENERATE_2FA_QR = gql`
  ${ERROR_INFO_FIELDS}
  mutation Generate2FAQr {
    generate2FAQR {
      success
      qrCodeImage
      manualEntryKey
      statusMessage
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// 2FA 활성화
export const ENABLE_2FA = gql`
  ${ERROR_INFO_FIELDS}
  mutation Enable2FA($input: Enable2FAInput!) {
    enable2FA(input: $input) {
      success
      statusMessage
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// 2FA 비활성화
export const DISABLE_2FA = gql`
  ${ERROR_INFO_FIELDS}
  mutation Disable2FA($input: Disable2FAInput!) {
    disable2FA(input: $input) {
      success
      statusMessage
      accessToken
      refreshToken
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// 긴급 이메일 코드 요청 (2FA 복구)
export const REQUEST_EMERGENCY_EMAIL_CODE = gql`
  ${ERROR_INFO_FIELDS}
  mutation RequestEmergencyEmailCode($input: RequestEmergencyCodeInput!) {
    requestEmergencyEmailCode(input: $input) {
      success
      statusMessage
      emailSent
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// 로그인 과정에서 2FA 비활성화
export const DISABLE_2FA_DURING_LOGIN = gql`
  ${ERROR_INFO_FIELDS}
  mutation Disable2FADuringLogin($input: Disable2FADuringLoginInput!) {
    disable2FADuringLogin(input: $input) {
      success
      statusMessage
      accessToken
      refreshToken
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// 로그아웃
export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

// 모든 디바이스에서 로그아웃
export const LOGOUT_ALL = gql`
  mutation LogoutAll {
    logoutAll
  }
`;

// 토큰 갱신
export const REFRESH_TOKEN = gql`
  ${ERROR_INFO_FIELDS}
  ${CORE_USER_FIELDS}
  mutation RefreshToken {
    refreshToken {
      success
      accessToken
      refreshToken
      error {
        ...ErrorInfoFields
      }
      user {
        ...CoreUserFields
      }
    }
  }
`;

// 비밀번호 변경
export const CHANGE_PASSWORD = gql`
  ${ERROR_INFO_FIELDS}
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      success
      statusMessage
      emailSent
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// 비밀번호 찾기(재설정 이메일 발송)
export const FORGOT_PASSWORD = gql`
  ${ERROR_INFO_FIELDS}
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      success
      statusMessage
      emailSent
      resetToken
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// 비밀번호 재설정
export const RESET_PASSWORD = gql`
  ${ERROR_INFO_FIELDS}
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      success
      statusMessage
      emailSent
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// 이름 변경
export const UPDATE_USER_NAME = gql`
  ${ERROR_INFO_FIELDS}
  ${CORE_USER_FIELDS}
  mutation UpdateUserName($input: UpdateNameInput!) {
    updateUserName(input: $input) {
      success
      statusMessage
      newName
      error {
        ...ErrorInfoFields
      }
      user {
        ...CoreUserFields
      }
    }
  }
`;

// 이메일 변경 요청
export const REQUEST_EMAIL_CHANGE = gql`
  ${ERROR_INFO_FIELDS}
  mutation RequestEmailChange($input: ChangeEmailInput!) {
    requestEmailChange(input: $input) {
      success
      statusMessage
      verificationMessage
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// 이메일 변경 확인
export const VERIFY_EMAIL_CHANGE = gql`
  ${ERROR_INFO_FIELDS}
  ${EMAIL_CHANGE_INFO_FIELDS}
  mutation VerifyEmailChange($input: EmailChangeVerifyInput!) {
    verifyEmailChange(input: $input) {
      success
      statusMessage
      completedAt
      newEmail {
        ...EmailChangeInfoFields
      }
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// 전화번호 변경
export const UPDATE_PHONE_NUMBER = gql`
  ${ERROR_INFO_FIELDS}
  mutation UpdatePhoneNumber($input: UpdatePhoneInput!) {
    updatePhoneNumber(input: $input) {
      success
      statusMessage
      maskedPhoneNumber
      updatedAt
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// 아바타  삭제
export const DELETE_AVATAR = gql`
  ${ERROR_INFO_FIELDS}
  mutation DeleteAvatar($input: DeleteAvatarInput!) {
    deleteAvatar(input: $input) {
      message
      success
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// 사업자 정보 업데이트
export const UPDATE_BUSINESS = gql`
  ${ERROR_INFO_FIELDS}
  ${BUSINESS_UPDATE_INFO_FIELDS}
  mutation UpdateBusiness($input: UpdateBusinessInput!) {
    updateBusiness(input: $input) {
      success
      statusMessage
      updatedAt
      requiresRevalidation
      changes {
        ...BusinessUpdateInfoFields
      }
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// 소셜 이메일 인증 완료
export const VERIFY_SOCIAL_EMAIL = gql`
  ${ERROR_INFO_FIELDS}
  ${CORE_USER_FIELDS}
  mutation VerifySocialEmail($input: VerifySocialEmailInput!) {
    verifySocialEmail(input: $input) {
      success
      accessToken
      refreshToken
      error {
        ...ErrorInfoFields
      }
      user {
        ...CoreUserFields
      }
    }
  }
`;

// 소셜 이메일 인증 코드 재발송
export const RESEND_SOCIAL_ACTIVATION_CODE = gql`
  ${ERROR_INFO_FIELDS}
  mutation ResendSocialActivationCode($input: ResendSocialActivationInput!) {
    resendSocialActivationCode(input: $input) {
      success
      message
      verificationCode
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// 소셜 계정 연결 해제
export const UNLINK_SOCIAL_ACCOUNT = gql`
  ${ERROR_INFO_FIELDS}
  mutation UnlinkSocialAccount($input: UnlinkSocialAccountInput!) {
    unlinkSocialAccount(input: $input) {
      success
      message
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// 본인인증 요청 시작
export const REQUEST_IDENTITY_VERIFICATION = gql`
  ${IDENTITY_VERIFICATION_FIELDS}
  mutation RequestIdentityVerification(
    $input: RequestIdentityVerificationInput!
  ) {
    requestIdentityVerification(input: $input) {
      success
      message
      identityVerificationId
      errorCode
      identityVerification {
        ...IdentityVerificationFields
      }
    }
  }
`;

// 본인인증 결과 검증
export const VERIFY_IDENTITY_VERIFICATION = gql`
  ${ERROR_INFO_FIELDS}
  ${IDENTITY_VERIFICATION_FIELDS}
  mutation VerifyIdentityVerification(
    $input: VerifyIdentityVerificationInput!
  ) {
    verifyIdentityVerification(input: $input) {
      success
      message
      identityVerificationId
      errorCode
      identityVerification {
        ...IdentityVerificationFields
      }
    }
  }
`;

/**
 * ========================================
 * 새로 추가: 관리자 전용 Mutations
 * ========================================
 */

// 관리자가 사용자 정보 수정
export const UPDATE_USER_BY_ADMIN = gql`
  ${USER_FIELDS}
  mutation UpdateUserByAdmin($id: Int!, $input: UpdateUserByAdminInput!) {
    updateUserByAdmin(id: $id, input: $input) {
      ...UserFields
    }
  }
`;

// 관리자가 사용자 삭제
export const DELETE_USER_BY_ADMIN = gql`
  ${USER_FIELDS}
  mutation DeleteUserByAdmin($id: Int!) {
    deleteUserByAdmin(id: $id) {
      ...UserFields
    }
  }
`;

// 사용자 초대 (이메일 발송)
export const INVITE_USER = gql`
  ${USER_INVITATION_FIELDS}
  ${ERROR_INFO_FIELDS}
  mutation InviteUser($input: InviteUserInput!) {
    inviteUser(input: $input) {
      success
      invitationId
      email
      expiresAt
      message
      invitation {
        ...UserInvitationFields
      }
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// 초대 취소
export const CANCEL_INVITATION = gql`
  ${USER_INVITATION_FIELDS}
  ${ERROR_INFO_FIELDS}
  mutation CancelInvitation($invitationId: Int!) {
    cancelInvitation(invitationId: $invitationId) {
      success
      invitation {
        ...UserInvitationFields
      }
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// 초대 재발송
export const RESEND_INVITATION = gql`
  ${ERROR_INFO_FIELDS}
  mutation ResendInvitation($invitationId: Int!) {
    resendInvitation(invitationId: $invitationId) {
      success
      expiresAt
      error {
        ...ErrorInfoFields
      }
    }
  }
`;

// ✅ 초대 수락 (공개 API)
export const ACCEPT_INVITATION = gql`
  mutation AcceptInvitation($token: String!, $input: AcceptInvitationInput!) {
    acceptInvitation(token: $token, input: $input) {
      success
      message
      email
      verificationMessage
    }
  }
`;

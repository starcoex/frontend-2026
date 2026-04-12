import { gql } from '@apollo/client';
import { USER_MEMBERSHIP_FIELDS } from './loyalty.queries.js';

// ─── Shared Fragments ────────────────────────────────────────────────────────

export const AUTH_ERROR_INFO_FIELDS = gql`
  fragment AuthErrorInfoFields on ErrorInfo {
    code
    message
    details
  }
`;

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

// ─── User Fragments ───────────────────────────────────────────────────────────

export const ACTIVATION_FIELDS = gql`
  fragment ActivationFields on Activation {
    id
    twoFactorSecret
    twoFactorActivated
    emergencyEmailCode
    emergencyEmailCodeExpiresAt
    emailChangeToken
    emailChangeExpiresAt
    emailChangeNewEmail
    resetPasswordToken
    resetPasswordExpiresAt
    socialLinkToken
    socialLinkExpiresAt
    socialLinkData
    userId
    createdAt
    updatedAt
  }
`;

export const AVATAR_FIELDS = gql`
  fragment AvatarFields on Avatar {
    id
    url
    altText
    publicId
    userId
    createdAt
    updatedAt
  }
`;

export const BUSINESS_FIELDS = gql`
  fragment BusinessFields on Business {
    id
    businessNumber
    representativeName
    businessName
    establishmentDate
    businessAddress
    businessType
    businessItem
    businessStatusCode
    isValidated
    validatedAt
    validationMethod
    userId
    createdAt
    updatedAt
  }
`;

export const CORE_USER_FIELDS = gql`
  ${ACTIVATION_FIELDS}
  ${AVATAR_FIELDS}
  ${BUSINESS_FIELDS}
  fragment CoreUserFields on User {
    id
    email
    password
    name
    phoneNumber
    userType
    role
    isActive
    rememberMe
    marketingConsent
    marketingConsentDate
    marketingConsentIp
    marketingConsentSource
    emailVerified
    emailVerifiedAt
    termsAccepted
    termsAcceptedAt
    accessToken
    refreshToken
    isSocialUser
    identityVerified
    identityVerifiedAt
    realName
    realPhoneNumber
    realBirthDate
    realGender
    ci
    telecomOperator
    isForeigner
    avatarUrl
    hasBusiness
    twoFactorEnabled
    socialAccountsCount
    createdAt
    updatedAt
    deletedAt
    lastLoginAt
    activation {
      ...ActivationFields
    }
    avatar {
      ...AvatarFields
    }
    business {
      ...BusinessFields
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

// ─── Domain Fragments ─────────────────────────────────────────────────────────

export const TWO_FACTOR_STATUS_FIELDS = gql`
  fragment TwoFactorStatusFields on TwoFactorStatus {
    isEnabled
    isSocialUser
    success
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
    createdAt
    updatedAt
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

export const BUSINESS_UPDATE_INFO_FIELDS = gql`
  fragment BusinessUpdateInfoFields on BusinessUpdateInfo {
    field
    previousValue
    newValue
  }
`;

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

// ─── Stats Fragments ──────────────────────────────────────────────────────────

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

// ─── Output Fragments ─────────────────────────────────────────────────────────

export const REGISTER_USER_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  fragment RegisterUserOutputFields on RegisterUserOutput {
    success
    message
    verificationMessage
    marketingConsentMessage
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const VERIFY_ACTIVATION_CODE_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  fragment VerifyActivationCodeOutputFields on VerifyActivationCodeOutput {
    success
    verified
    successMessage
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const RESEND_ACTIVATION_CODE_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  fragment ResendActivationCodeOutputFields on ResendActivationCodeOutput {
    success
    message
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const LOGIN_STEP1_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  ${CORE_USER_FIELDS}
  fragment LoginStep1OutputFields on LoginUser1Output {
    success
    requires2FA
    tempToken
    accessToken
    refreshToken
    error {
      ...AuthErrorInfoFields
    }
    user {
      ...CoreUserFields
    }
  }
`;

export const LOGIN_STEP2_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  fragment LoginStep2OutputFields on LoginUser2Output {
    success
    accessToken
    refreshToken
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const REFRESH_TOKEN_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  ${CORE_USER_FIELDS}
  fragment RefreshTokenOutputFields on RefreshTokenOutput {
    success
    accessToken
    refreshToken
    error {
      ...AuthErrorInfoFields
    }
    user {
      ...CoreUserFields
    }
  }
`;

export const DELETE_ACCOUNT_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  fragment DeleteAccountOutputFields on DeleteAccountOutput {
    success
    message
    deletedAt
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const GENERATE_2FA_QR_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  fragment Generate2FAQROutputFields on Generate2FAQROutput {
    success
    qrCodeImage
    manualEntryKey
    statusMessage
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const ENABLE_2FA_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  fragment Enable2FAOutputFields on Enable2FAOutput {
    success
    statusMessage
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const DISABLE_2FA_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  fragment Disable2FAOutputFields on Disable2FAOutput {
    success
    statusMessage
    accessToken
    refreshToken
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const REQUEST_EMERGENCY_CODE_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  fragment RequestEmergencyCodeOutputFields on RequestEmergencyCodeOutput {
    success
    statusMessage
    emailSent
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const CHANGE_PASSWORD_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  fragment ChangePasswordOutputFields on ChangePasswordOutput {
    success
    statusMessage
    emailSent
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const FORGOT_PASSWORD_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  fragment ForgotPasswordOutputFields on ForgotPasswordOutput {
    success
    statusMessage
    emailSent
    resetToken
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const RESET_PASSWORD_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  fragment ResetPasswordOutputFields on ResetPasswordOutput {
    success
    statusMessage
    emailSent
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const UPDATE_NAME_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  ${CORE_USER_FIELDS}
  fragment UpdateNameOutputFields on UpdateNameOutput {
    success
    statusMessage
    newName
    error {
      ...AuthErrorInfoFields
    }
    user {
      ...CoreUserFields
    }
  }
`;

export const CHANGE_EMAIL_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  fragment ChangeEmailOutputFields on ChangeEmailOutput {
    success
    statusMessage
    verificationMessage
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const EMAIL_CHANGE_VERIFY_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  ${EMAIL_CHANGE_INFO_FIELDS}
  fragment EmailChangeVerifyOutputFields on EmailChangeVerifyOutput {
    success
    statusMessage
    completedAt
    newEmail {
      ...EmailChangeInfoFields
    }
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const UPDATE_PHONE_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  fragment UpdatePhoneOutputFields on UpdatePhoneOutput {
    success
    statusMessage
    maskedPhoneNumber
    updatedAt
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const UPDATE_BUSINESS_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  ${BUSINESS_UPDATE_INFO_FIELDS}
  fragment UpdateBusinessOutputFields on UpdateBusinessOutput {
    success
    statusMessage
    updatedAt
    requiresRevalidation
    changes {
      ...BusinessUpdateInfoFields
    }
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const DELETE_AVATAR_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  fragment DeleteAvatarOutputFields on DeleteAvatarOutput {
    success
    message
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const SOCIAL_LOGIN_START_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  fragment SocialLoginStartOutputFields on SocialLoginStartOutput {
    success
    loginUrl
    provider
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const VERIFY_SOCIAL_EMAIL_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  ${CORE_USER_FIELDS}
  fragment VerifySocialEmailOutputFields on VerifySocialEmailOutput {
    success
    accessToken
    refreshToken
    error {
      ...AuthErrorInfoFields
    }
    user {
      ...CoreUserFields
    }
  }
`;

export const RESEND_SOCIAL_ACTIVATION_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  fragment ResendSocialActivationOutputFields on ResendSocialActivationOutput {
    success
    message
    verificationCode
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const UNLINK_SOCIAL_ACCOUNT_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  fragment UnlinkSocialAccountOutputFields on UnlinkSocialAccountOutput {
    success
    message
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const IDENTITY_VERIFICATION_RESPONSE_FIELDS = gql`
  ${IDENTITY_VERIFICATION_FIELDS}
  fragment IdentityVerificationResponseFields on IdentityVerificationResponse {
    success
    message
    identityVerificationId
    errorCode
    identityVerification {
      ...IdentityVerificationFields
    }
  }
`;

export const NTS_VALIDATION_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  fragment NTSValidationOutputFields on NTSValidationOutput {
    success
    isValid
    statusCode
    statusMessage
    rawData
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const PAGINATED_USERS_RESPONSE_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  ${USER_FIELDS}
  ${PAGINATION_INFO_FIELDS}
  fragment PaginatedUsersResponseFields on PaginatedUsersResponse {
    success
    users {
      ...UserFields
    }
    pagination {
      ...PaginationInfoFields
    }
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const USERS_STATS_RESPONSE_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  ${OVERVIEW_STATS_FIELDS}
  ${VERIFICATION_STATS_FIELDS}
  ${USER_TYPE_STATS_FIELDS}
  ${GROWTH_STATS_FIELDS}
  fragment UsersStatsResponseFields on UsersStatsResponse {
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
      ...AuthErrorInfoFields
    }
  }
`;

export const INVITE_USER_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  ${USER_INVITATION_FIELDS}
  fragment InviteUserOutputFields on InviteUserOutput {
    success
    invitationId
    email
    expiresAt
    message
    invitation {
      ...UserInvitationFields
    }
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const PAGINATED_INVITATIONS_RESPONSE_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  ${USER_INVITATION_FIELDS}
  ${PAGINATION_INFO_FIELDS}
  fragment PaginatedInvitationsResponseFields on PaginatedInvitationsResponse {
    success
    invitations {
      ...UserInvitationFields
    }
    pagination {
      ...PaginationInfoFields
    }
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const CANCEL_INVITATION_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  ${USER_INVITATION_FIELDS}
  fragment CancelInvitationOutputFields on CancelInvitationOutput {
    success
    invitation {
      ...UserInvitationFields
    }
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const RESEND_INVITATION_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  fragment ResendInvitationOutputFields on ResendInvitationOutput {
    success
    expiresAt
    error {
      ...AuthErrorInfoFields
    }
  }
`;

export const CREATE_GUEST_USER_OUTPUT_FIELDS = gql`
  ${AUTH_ERROR_INFO_FIELDS}
  ${CORE_USER_FIELDS}
  fragment CreateGuestUserOutputFields on CreateGuestUserOutput {
    success
    message
    error {
      ...AuthErrorInfoFields
    }
    user {
      ...CoreUserFields
    }
  }
`;

export const CHANGE_ROLE_OUTPUT_FIELDS = gql`
  fragment ChangeRoleOutputFields on ChangeRoleOutput {
    success
    message
    user {
      id
      email
      name
      role
      userType
    }
  }
`;

export const ADMIN_MASTER_KEY_OUTPUT_FIELDS = gql`
  fragment AdminMasterKeyOutputFields on AdminMasterKeyOutput {
    success
    message
    user {
      id
      email
      name
      role
      userType
    }
  }
`;

// ─── Auth Queries ─────────────────────────────────────────────────────────────

export const GET_LOGGED_IN_USER = gql`
  ${USER_FIELDS}
  query GetLoggedInUser {
    getLoggedInUser {
      ...UserFields
    }
  }
`;

export const GET_2FA_STATUS = gql`
  ${TWO_FACTOR_STATUS_FIELDS}
  query Get2FAStatus {
    get2FAStatus {
      ...TwoFactorStatusFields
    }
  }
`;

export const GET_SOCIAL_LOGIN_URL = gql`
  ${SOCIAL_LOGIN_START_OUTPUT_FIELDS}
  query GetSocialLoginUrl($input: SocialLoginStartInput!) {
    getSocialLoginUrl(input: $input) {
      ...SocialLoginStartOutputFields
    }
  }
`;

export const GET_CONNECTED_SOCIAL_PROVIDERS = gql`
  query GetConnectedSocialProviders {
    getConnectedSocialProviders
  }
`;

export const GET_IDENTITY_VERIFICATION = gql`
  ${IDENTITY_VERIFICATION_FIELDS}
  query GetIdentityVerification($identityVerificationId: String!) {
    identityVerification(identityVerificationId: $identityVerificationId) {
      ...IdentityVerificationFields
    }
  }
`;

export const GET_IDENTITY_VERIFICATION_CONFIG = gql`
  query GetIdentityVerificationConfig {
    getIdentityVerificationConfig
  }
`;

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
  ${NTS_VALIDATION_OUTPUT_FIELDS}
  query ValidateBusinessNumber($businessNumber: String!) {
    validateBusinessNumber(businessNumber: $businessNumber) {
      ...NTSValidationOutputFields
    }
  }
`;

// ─── Admin Queries ────────────────────────────────────────────────────────────

export const GET_ALL_USERS = gql`
  ${PAGINATED_USERS_RESPONSE_FIELDS}
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
      ...PaginatedUsersResponseFields
    }
  }
`;

export const GET_USER_BY_ID = gql`
  ${USER_FIELDS}
  query GetUserById($id: Int!) {
    getUserById(id: $id) {
      ...UserFields
    }
  }
`;

export const GET_USERS_STATS = gql`
  ${USERS_STATS_RESPONSE_FIELDS}
  query GetUsersStats {
    getUsersStats {
      ...UsersStatsResponseFields
    }
  }
`;

export const GET_INVITATIONS = gql`
  ${PAGINATED_INVITATIONS_RESPONSE_FIELDS}
  query GetInvitations($page: Int, $limit: Int, $status: InvitationStatus) {
    getInvitations(page: $page, limit: $limit, status: $status) {
      ...PaginatedInvitationsResponseFields
    }
  }
`;

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

// ─── Auth Mutations ───────────────────────────────────────────────────────────

export const REGISTER_USER = gql`
  ${REGISTER_USER_OUTPUT_FIELDS}
  mutation RegisterUser($registerInput: RegisterUserInput!) {
    registerUser(registerInput: $registerInput) {
      ...RegisterUserOutputFields
    }
  }
`;

export const VERIFY_ACTIVATION_CODE = gql`
  ${VERIFY_ACTIVATION_CODE_OUTPUT_FIELDS}
  mutation VerifyActivationCode($verifyInput: VerifyActivationCodeInput!) {
    verifyActivationCode(verifyInput: $verifyInput) {
      ...VerifyActivationCodeOutputFields
    }
  }
`;

export const RESEND_ACTIVATION_CODE = gql`
  ${RESEND_ACTIVATION_CODE_OUTPUT_FIELDS}
  mutation ResendActivationCode($input: ResendActivationCodeInput!) {
    resendActivationCode(input: $input) {
      ...ResendActivationCodeOutputFields
    }
  }
`;

export const LOGIN_STEP1 = gql`
  ${LOGIN_STEP1_OUTPUT_FIELDS}
  mutation LoginStep1($loginInput: LoginUser1Input!) {
    loginStep1(loginInput: $loginInput) {
      ...LoginStep1OutputFields
    }
  }
`;

export const LOGIN_STEP2 = gql`
  ${LOGIN_STEP2_OUTPUT_FIELDS}
  mutation LoginStep2($loginInput: LoginUser2Input!) {
    loginStep2(loginInput: $loginInput) {
      ...LoginStep2OutputFields
    }
  }
`;

export const REFRESH_TOKEN = gql`
  ${REFRESH_TOKEN_OUTPUT_FIELDS}
  mutation RefreshToken {
    refreshToken {
      ...RefreshTokenOutputFields
    }
  }
`;

export const DELETE_ACCOUNT = gql`
  ${DELETE_ACCOUNT_OUTPUT_FIELDS}
  mutation DeleteAccount {
    deleteAccount {
      ...DeleteAccountOutputFields
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const LOGOUT_ALL = gql`
  mutation LogoutAll {
    logoutAll
  }
`;

export const GENERATE_2FA_QR = gql`
  ${GENERATE_2FA_QR_OUTPUT_FIELDS}
  mutation Generate2FAQr {
    generate2FAQR {
      ...Generate2FAQROutputFields
    }
  }
`;

export const ENABLE_2FA = gql`
  ${ENABLE_2FA_OUTPUT_FIELDS}
  mutation Enable2FA($input: Enable2FAInput!) {
    enable2FA(input: $input) {
      ...Enable2FAOutputFields
    }
  }
`;

export const DISABLE_2FA = gql`
  ${DISABLE_2FA_OUTPUT_FIELDS}
  mutation Disable2FA($input: Disable2FAInput!) {
    disable2FA(input: $input) {
      ...Disable2FAOutputFields
    }
  }
`;

export const REQUEST_EMERGENCY_EMAIL_CODE = gql`
  ${REQUEST_EMERGENCY_CODE_OUTPUT_FIELDS}
  mutation RequestEmergencyEmailCode($input: RequestEmergencyCodeInput!) {
    requestEmergencyEmailCode(input: $input) {
      ...RequestEmergencyCodeOutputFields
    }
  }
`;

export const DISABLE_2FA_DURING_LOGIN = gql`
  ${DISABLE_2FA_OUTPUT_FIELDS}
  mutation Disable2FADuringLogin($input: Disable2FADuringLoginInput!) {
    disable2FADuringLogin(input: $input) {
      ...Disable2FAOutputFields
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  ${CHANGE_PASSWORD_OUTPUT_FIELDS}
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      ...ChangePasswordOutputFields
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  ${FORGOT_PASSWORD_OUTPUT_FIELDS}
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      ...ForgotPasswordOutputFields
    }
  }
`;

export const RESET_PASSWORD = gql`
  ${RESET_PASSWORD_OUTPUT_FIELDS}
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      ...ResetPasswordOutputFields
    }
  }
`;

export const UPDATE_USER_NAME = gql`
  ${UPDATE_NAME_OUTPUT_FIELDS}
  mutation UpdateUserName($input: UpdateNameInput!) {
    updateUserName(input: $input) {
      ...UpdateNameOutputFields
    }
  }
`;

export const REQUEST_EMAIL_CHANGE = gql`
  ${CHANGE_EMAIL_OUTPUT_FIELDS}
  mutation RequestEmailChange($input: ChangeEmailInput!) {
    requestEmailChange(input: $input) {
      ...ChangeEmailOutputFields
    }
  }
`;

export const VERIFY_EMAIL_CHANGE = gql`
  ${EMAIL_CHANGE_VERIFY_OUTPUT_FIELDS}
  mutation VerifyEmailChange($input: EmailChangeVerifyInput!) {
    verifyEmailChange(input: $input) {
      ...EmailChangeVerifyOutputFields
    }
  }
`;

export const UPDATE_PHONE_NUMBER = gql`
  ${UPDATE_PHONE_OUTPUT_FIELDS}
  mutation UpdatePhoneNumber($input: UpdatePhoneInput!) {
    updatePhoneNumber(input: $input) {
      ...UpdatePhoneOutputFields
    }
  }
`;

export const UPDATE_BUSINESS = gql`
  ${UPDATE_BUSINESS_OUTPUT_FIELDS}
  mutation UpdateBusiness($input: UpdateBusinessInput!) {
    updateBusiness(input: $input) {
      ...UpdateBusinessOutputFields
    }
  }
`;

export const DELETE_AVATAR = gql`
  ${DELETE_AVATAR_OUTPUT_FIELDS}
  mutation DeleteAvatar($input: DeleteAvatarInput!) {
    deleteAvatar(input: $input) {
      ...DeleteAvatarOutputFields
    }
  }
`;

export const VERIFY_SOCIAL_EMAIL = gql`
  ${VERIFY_SOCIAL_EMAIL_OUTPUT_FIELDS}
  mutation VerifySocialEmail($input: VerifySocialEmailInput!) {
    verifySocialEmail(input: $input) {
      ...VerifySocialEmailOutputFields
    }
  }
`;

export const RESEND_SOCIAL_ACTIVATION_CODE = gql`
  ${RESEND_SOCIAL_ACTIVATION_OUTPUT_FIELDS}
  mutation ResendSocialActivationCode($input: ResendSocialActivationInput!) {
    resendSocialActivationCode(input: $input) {
      ...ResendSocialActivationOutputFields
    }
  }
`;

export const UNLINK_SOCIAL_ACCOUNT = gql`
  ${UNLINK_SOCIAL_ACCOUNT_OUTPUT_FIELDS}
  mutation UnlinkSocialAccount($input: UnlinkSocialAccountInput!) {
    unlinkSocialAccount(input: $input) {
      ...UnlinkSocialAccountOutputFields
    }
  }
`;

export const REQUEST_IDENTITY_VERIFICATION = gql`
  ${IDENTITY_VERIFICATION_RESPONSE_FIELDS}
  mutation RequestIdentityVerification(
    $input: RequestIdentityVerificationInput!
  ) {
    requestIdentityVerification(input: $input) {
      ...IdentityVerificationResponseFields
    }
  }
`;

export const VERIFY_IDENTITY_VERIFICATION = gql`
  ${IDENTITY_VERIFICATION_RESPONSE_FIELDS}
  mutation VerifyIdentityVerification(
    $input: VerifyIdentityVerificationInput!
  ) {
    verifyIdentityVerification(input: $input) {
      ...IdentityVerificationResponseFields
    }
  }
`;

// ─── Admin Mutations ──────────────────────────────────────────────────────────

export const UPDATE_USER_BY_ADMIN = gql`
  ${USER_FIELDS}
  mutation UpdateUserByAdmin($id: Int!, $input: UpdateUserByAdminInput!) {
    updateUserByAdmin(id: $id, input: $input) {
      ...UserFields
    }
  }
`;

export const DELETE_USER_BY_ADMIN = gql`
  ${USER_FIELDS}
  mutation DeleteUserByAdmin($id: Int!) {
    deleteUserByAdmin(id: $id) {
      ...UserFields
    }
  }
`;

export const DELETE_USERS_BY_ADMIN = gql`
  mutation DeleteUsersByAdmin($ids: [Int!]!) {
    deleteUsersByAdmin(ids: $ids)
  }
`;

export const INVITE_USER = gql`
  ${INVITE_USER_OUTPUT_FIELDS}
  mutation InviteUser($input: InviteUserInput!) {
    inviteUser(input: $input) {
      ...InviteUserOutputFields
    }
  }
`;

export const CANCEL_INVITATION = gql`
  ${CANCEL_INVITATION_OUTPUT_FIELDS}
  mutation CancelInvitation($invitationId: Int!) {
    cancelInvitation(invitationId: $invitationId) {
      ...CancelInvitationOutputFields
    }
  }
`;

export const RESEND_INVITATION = gql`
  ${RESEND_INVITATION_OUTPUT_FIELDS}
  mutation ResendInvitation($invitationId: Int!) {
    resendInvitation(invitationId: $invitationId) {
      ...ResendInvitationOutputFields
    }
  }
`;

export const DELETE_INVITATION = gql`
  mutation DeleteInvitation($invitationId: Int!) {
    deleteInvitation(invitationId: $invitationId) {
      success
      message
    }
  }
`;

export const DELETE_INVITATIONS = gql`
  mutation DeleteInvitations($ids: [Int!]!) {
    deleteInvitations(ids: $ids) {
      success
      deletedCount
    }
  }
`;

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

export const PROMOTE_TO_SUPER_ADMIN_WITH_MASTER_KEY = gql`
  ${ADMIN_MASTER_KEY_OUTPUT_FIELDS}
  mutation PromoteToSuperAdminWithMasterKey($input: AdminMasterKeyInput!) {
    promoteToSuperAdminWithMasterKey(input: $input) {
      ...AdminMasterKeyOutputFields
    }
  }
`;

export const CHANGE_USER_ROLE = gql`
  ${CHANGE_ROLE_OUTPUT_FIELDS}
  mutation ChangeUserRole($input: ChangeRoleInput!) {
    changeUserRole(input: $input) {
      ...ChangeRoleOutputFields
    }
  }
`;

export const CREATE_GUEST_USER_BY_ADMIN = gql`
  ${CREATE_GUEST_USER_OUTPUT_FIELDS}
  mutation CreateGuestUserByAdmin($input: CreateGuestUserInput!) {
    createGuestUserByAdmin(input: $input) {
      ...CreateGuestUserOutputFields
    }
  }
`;

// ─── Deprecated aliases (하위 호환) ──────────────────────────────────────────
/** @deprecated AUTH_ERROR_INFO_FIELDS 로 교체 */
export const ERROR_INFO_FIELDS = AUTH_ERROR_INFO_FIELDS;

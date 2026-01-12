import {
  LoginUser1Input,
  LoginUser2Input,
  RegisterUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
  SocialLoginStartInput,
  VerifyActivationCodeInput,
  ResendActivationCodeInput,
  User,
  SocialProvider,
  VerifySocialEmailInput,
  ResendSocialActivationInput,
  UnlinkSocialAccountInput,
  UpdateNameInput,
  ChangeEmailInput,
  EmailChangeVerifyInput,
  UpdatePhoneInput,
  UpdateBusinessInput,
  Enable2FaInput,
  Disable2FaInput,
  RequestEmergencyCodeInput,
  Disable2FaDuringLoginInput,
  RequestIdentityVerificationInput,
  VerifyIdentityVerificationInput,
  DeleteAvatarInput,
  Generate2FaQrMutation,
  LoginStep1Mutation,
  LoginStep2Mutation,
  RefreshTokenMutation,
  RegisterUserMutation,
  VerifyActivationCodeMutation,
  ResendActivationCodeMutation,
  ForgotPasswordMutation,
  ResetPasswordMutation,
  ChangePasswordMutation,
  GetSocialLoginUrlQuery,
  VerifySocialEmailMutation,
  ResendSocialActivationCodeMutation,
  UnlinkSocialAccountMutation,
  UpdateUserNameMutation,
  RequestEmailChangeMutation,
  VerifyEmailChangeMutation,
  UpdatePhoneNumberMutation,
  UpdateBusinessMutation,
  DeleteAvatarMutation,
  Enable2FaMutation,
  Disable2FaMutation,
  RequestEmergencyEmailCodeMutation,
  GetIdentityVerificationConfigQuery,
  GetIdentityVerificationQuery,
  GenerateVerificationRequestQuery,
  RequestIdentityVerificationMutation,
  VerifyIdentityVerificationMutation,
  Get2FaStatusQuery,
  DeleteAccountMutation,
  ValidateBusinessNumberQuery,
  GetAllUsersQuery,
  GetUserByIdQuery,
  GetUsersStatsQuery,
  InvitationStatus,
  GetInvitationsQuery,
  UpdateUserByAdminInput,
  UpdateUserByAdminMutation,
  DeleteUserByAdminMutation,
  InviteUserInput,
  InviteUserMutation,
  CancelInvitationMutation,
  ResendInvitationMutation,
  VerifyInvitationTokenQuery,
  AcceptInvitationInput,
  AcceptInvitationMutation,
} from '@starcoex-frontend/graphql';
import { ApiResponse } from './common.types';

export interface IAuthService {
  // 인증 상태
  checkAuthStatus(): Promise<{ isAuthenticated: boolean; user?: User }>;
  getCurrentUser(): Promise<User>;

  // 로그인/로그아웃
  loginStep1(input: LoginUser1Input): Promise<ApiResponse<LoginStep1Mutation>>;
  loginStep2(input: LoginUser2Input): Promise<ApiResponse<LoginStep2Mutation>>;
  logout(): Promise<ApiResponse>;
  logoutAll(): Promise<ApiResponse>;

  // 토큰
  refreshToken: () => Promise<ApiResponse<RefreshTokenMutation>>;

  // 회원가입/인증
  register(
    input: RegisterUserInput
  ): Promise<ApiResponse<RegisterUserMutation>>;
  verifyActivationCode(
    input: VerifyActivationCodeInput
  ): Promise<ApiResponse<VerifyActivationCodeMutation>>;
  resendActivationCode(
    input: ResendActivationCodeInput
  ): Promise<ApiResponse<ResendActivationCodeMutation>>;

  // 비밀번호
  forgotPassword(
    input: ForgotPasswordInput
  ): Promise<ApiResponse<ForgotPasswordMutation>>;
  resetPassword(
    input: ResetPasswordInput
  ): Promise<ApiResponse<ResetPasswordMutation>>;
  changePassword(
    input: ChangePasswordInput
  ): Promise<ApiResponse<ChangePasswordMutation>>;

  // 소셜 로그인
  getConnectedSocialProviders(): Promise<ApiResponse<SocialProvider[]>>;
  getSocialLoginUrl(
    input: SocialLoginStartInput
  ): Promise<ApiResponse<GetSocialLoginUrlQuery>>;
  verifySocialEmail(
    input: VerifySocialEmailInput
  ): Promise<ApiResponse<VerifySocialEmailMutation>>;
  resendSocialActivationCode(
    input: ResendSocialActivationInput
  ): Promise<ApiResponse<ResendSocialActivationCodeMutation>>;
  unlinkSocialAccount(
    input: UnlinkSocialAccountInput
  ): Promise<ApiResponse<UnlinkSocialAccountMutation>>;

  // 사용자 정보 관리 메서드들
  updateUserName: (
    input: UpdateNameInput
  ) => Promise<ApiResponse<UpdateUserNameMutation>>; // 새로 추가
  requestEmailChange(
    input: ChangeEmailInput
  ): Promise<ApiResponse<RequestEmailChangeMutation>>;
  verifyEmailChange(
    input: EmailChangeVerifyInput
  ): Promise<ApiResponse<VerifyEmailChangeMutation>>;
  updatePhoneNumber(
    input: UpdatePhoneInput
  ): Promise<ApiResponse<UpdatePhoneNumberMutation>>;
  updateBusiness(
    input: UpdateBusinessInput
  ): Promise<ApiResponse<UpdateBusinessMutation>>;
  deleteAvatar(
    input: DeleteAvatarInput
  ): Promise<ApiResponse<DeleteAvatarMutation>>;
  deleteAccount(): Promise<ApiResponse<DeleteAccountMutation>>;

  // 2FA 관리
  generateTwoFactorQR: () => Promise<ApiResponse<Generate2FaQrMutation>>;
  enableTwoFactor: (
    input: Enable2FaInput
  ) => Promise<ApiResponse<Enable2FaMutation>>;
  disableTwoFactor: (
    input: Disable2FaInput
  ) => Promise<ApiResponse<Disable2FaMutation>>;
  requestEmergencyEmailCode: (
    input: RequestEmergencyCodeInput
  ) => Promise<ApiResponse<RequestEmergencyEmailCodeMutation>>;
  disableTwoFactorDuringLogin: (
    input: Disable2FaDuringLoginInput
  ) => Promise<ApiResponse<Disable2FaMutation>>;
  getTwoFactorStatus: () => Promise<ApiResponse<Get2FaStatusQuery>>;

  // 본인인증 관련 메서드들
  getIdentityVerification(
    identityVerificationId: string
  ): Promise<ApiResponse<GetIdentityVerificationQuery>>;
  getIdentityVerificationConfig(): Promise<
    ApiResponse<GetIdentityVerificationConfigQuery>
  >;
  generateVerificationRequest(input: {
    identityVerificationId: string;
    customRedirectPath?: string;
  }): Promise<ApiResponse<GenerateVerificationRequestQuery>>;
  requestIdentityVerification(
    input: RequestIdentityVerificationInput
  ): Promise<ApiResponse<RequestIdentityVerificationMutation>>;
  verifyIdentityVerification(
    input: VerifyIdentityVerificationInput
  ): Promise<ApiResponse<VerifyIdentityVerificationMutation>>;
  validateBusinessNumber(
    businessNumber: string
  ): Promise<ApiResponse<ValidateBusinessNumberQuery>>;

  // ✅ 새로 추가: 관리자 전용 메서드들
  getAllUsers(variables: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string[];
    status?: string[];
  }): Promise<ApiResponse<GetAllUsersQuery>>;
  getUserById(id: number): Promise<ApiResponse<GetUserByIdQuery>>;
  getUsersStats(): Promise<ApiResponse<GetUsersStatsQuery>>;
  getInvitations(variables: {
    page?: number;
    limit?: number;
    status?: InvitationStatus;
  }): Promise<ApiResponse<GetInvitationsQuery>>;
  updateUserByAdmin(
    id: number,
    input: UpdateUserByAdminInput
  ): Promise<ApiResponse<UpdateUserByAdminMutation>>;
  deleteUserByAdmin(
    id: number
  ): Promise<ApiResponse<DeleteUserByAdminMutation>>;
  inviteUser(input: InviteUserInput): Promise<ApiResponse<InviteUserMutation>>;
  cancelInvitation(
    invitationId: number
  ): Promise<ApiResponse<CancelInvitationMutation>>;
  resendInvitation(
    invitationId: number
  ): Promise<ApiResponse<ResendInvitationMutation>>;
  verifyInvitationToken(
    token: string
  ): Promise<ApiResponse<VerifyInvitationTokenQuery>>;
  acceptInvitation(
    token: string,
    input: AcceptInvitationInput
  ): Promise<ApiResponse<AcceptInvitationMutation>>;

  // 유틸리티 메서드들 (추가)
  clearAuthCache(): void;
}

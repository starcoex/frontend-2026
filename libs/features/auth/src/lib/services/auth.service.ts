import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';

import {
  GET_LOGGED_IN_USER,
  GET_2FA_STATUS,
  GET_SOCIAL_LOGIN_URL,
  GET_CONNECTED_SOCIAL_PROVIDERS,
  GET_IDENTITY_VERIFICATION,
  GET_IDENTITY_VERIFICATION_CONFIG,
  GENERATE_VERIFICATION_REQUEST,
  REGISTER_USER,
  VERIFY_ACTIVATION_CODE,
  RESEND_ACTIVATION_CODE,
  LOGIN_STEP1,
  LOGIN_STEP2,
  GENERATE_2FA_QR,
  ENABLE_2FA,
  DISABLE_2FA,
  REQUEST_EMERGENCY_EMAIL_CODE,
  DISABLE_2FA_DURING_LOGIN,
  LOGOUT,
  LOGOUT_ALL,
  CHANGE_PASSWORD,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  UPDATE_USER_NAME,
  REQUEST_EMAIL_CHANGE,
  VERIFY_EMAIL_CHANGE,
  UPDATE_PHONE_NUMBER,
  UPDATE_BUSINESS,
  VERIFY_SOCIAL_EMAIL,
  RESEND_SOCIAL_ACTIVATION_CODE,
  UNLINK_SOCIAL_ACCOUNT,
  REQUEST_IDENTITY_VERIFICATION,
  VERIFY_IDENTITY_VERIFICATION,
  // 아래 타입들은 @graphql-codegen/typescript-operations 로 생성되었다고 가정
  GetLoggedInUserQuery,
  GetSocialLoginUrlQueryVariables,
  GetConnectedSocialProvidersQuery,
  GetIdentityVerificationQueryVariables,
  GetIdentityVerificationConfigQuery,
  GenerateVerificationRequestQuery,
  GenerateVerificationRequestQueryVariables,
  RegisterUserMutationVariables,
  VerifyActivationCodeMutationVariables,
  ResendActivationCodeMutationVariables,
  Enable2FaMutationVariables,
  Disable2FaMutationVariables,
  RequestEmergencyEmailCodeMutationVariables,
  Disable2FaDuringLoginMutationVariables,
  LogoutMutation,
  LogoutAllMutation,
  ChangePasswordMutationVariables,
  ForgotPasswordMutationVariables,
  ResetPasswordMutationVariables,
  UpdateUserNameMutationVariables,
  RequestEmailChangeMutationVariables,
  VerifyEmailChangeMutationVariables,
  UpdatePhoneNumberMutationVariables,
  UpdateBusinessMutationVariables,
  VerifySocialEmailMutationVariables,
  ResendSocialActivationCodeMutationVariables,
  UnlinkSocialAccountMutationVariables,
  RequestIdentityVerificationMutationVariables,
  VerifyIdentityVerificationMutationVariables,
  Get2FaStatusQuery,
  // 필요한 모델 타입들 (예시)
  LoginUser1Input,
  LoginUser2Input,
  User,
  SocialProvider,
  RegisterUserInput,
  VerifyActivationCodeInput,
  ResendActivationCodeInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
  SocialLoginStartInput,
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
  type Disable2FaDuringLoginInput,
  type RequestIdentityVerificationInput,
  type VerifyIdentityVerificationInput,
  REFRESH_TOKEN,
  DeleteAvatarMutationVariables,
  DeleteAvatarInput,
  DELETE_AVATAR,
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
  GetIdentityVerificationQuery,
  RequestIdentityVerificationMutation,
  VerifyIdentityVerificationMutation,
  DeleteAccountMutation,
  DELETE_ACCOUNT,
  ValidateBusinessNumberQuery,
  ValidateBusinessNumberQueryVariables,
  VALIDATE_BUSINESS_NUMBER,
  GetAllUsersQuery,
  GetAllUsersQueryVariables,
  GET_ALL_USERS,
  GetUserByIdQuery,
  GetUserByIdQueryVariables,
  GET_USER_BY_ID,
  GetUsersStatsQuery,
  GET_USERS_STATS,
  InvitationStatus,
  GetInvitationsQuery,
  GetInvitationsQueryVariables,
  GET_INVITATIONS,
  UpdateUserByAdminInput,
  UpdateUserByAdminMutation,
  UPDATE_USER_BY_ADMIN,
  UpdateUserByAdminMutationVariables,
  DeleteUserByAdminMutation,
  DeleteUserByAdminMutationVariables,
  DELETE_USER_BY_ADMIN,
  InviteUserInput,
  InviteUserMutation,
  InviteUserMutationVariables,
  INVITE_USER,
  CancelInvitationMutation,
  CancelInvitationMutationVariables,
  CANCEL_INVITATION,
  ResendInvitationMutation,
  ResendInvitationMutationVariables,
  RESEND_INVITATION,
} from '@starcoex-frontend/graphql';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors/api-error';
import { IAuthService, ApiResponse } from '../types';

export class AuthService implements IAuthService {
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
        // error + extensions 로 GraphQLFormattedError 비슷한 형태 구성
        const gqlError: GraphQLFormattedError = {
          message: error.message ?? '요청 처리 중 오류가 발생했습니다.',
          locations: undefined,
          path: undefined,
          extensions: (extensions ?? {}) as Record<string, unknown>,
        };

        const apiError = apiErrorFromGraphQLErrors([gqlError]);
        return createErrorResponse<TData>(apiError);
      }

      return {
        success: true,
        data: data as TData,
      };
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
  >(
    query: any,
    variables?: TVars,
    options?: {
      fetchPolicy?: 'cache-first' | 'network-only' | 'cache-and-network';
    } // ✅ 옵션 추가
  ): Promise<ApiResponse<TData>> {
    try {
      // TS가 QueryOptions 타입을 너무 좁게 잡기 때문에 options를 any로 우회
      const result = await this.client.query<TData, TVars>({
        query,
        variables: variables as TVars,
        errorPolicy: 'all',
        fetchPolicy: options?.fetchPolicy || 'cache-first', // ✅ 기본값 cache-first
      } as any);

      // 실제 런타임 구조에 맞게 최소 필드만 가진 타입으로 캐스팅
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

      return {
        success: true,
        data: data as TData,
      };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse<TData>(apiError);
    }
  }

  // ✅ checkAuthStatus - 항상 최신 상태 확인
  async checkAuthStatus(): Promise<{ isAuthenticated: boolean; user?: User }> {
    const res = await this.query<GetLoggedInUserQuery>(
      GET_LOGGED_IN_USER,
      undefined,
      { fetchPolicy: 'network-only' } // ✅ 인증은 항상 최신
    );

    const user = res.success ? res.data?.getLoggedInUser : undefined;
    if (user) {
      return { isAuthenticated: true, user: user as User };
    }
    return { isAuthenticated: false };
  }

  async getCurrentUser(): Promise<User> {
    const status = await this.checkAuthStatus();
    if (!status.isAuthenticated || !status.user) {
      throw new Error('로그인된 사용자 정보를 찾을 수 없습니다.');
    }
    return status.user;
  }

  async loginStep1(
    input: LoginUser1Input
  ): Promise<ApiResponse<LoginStep1Mutation>> {
    return this.mutate<LoginStep1Mutation, { loginInput: LoginUser1Input }>(
      LOGIN_STEP1,
      { loginInput: input }
    );
  }

  async loginStep2(
    input: LoginUser2Input
  ): Promise<ApiResponse<LoginStep2Mutation>> {
    return this.mutate<LoginStep2Mutation, { loginInput: LoginUser2Input }>(
      LOGIN_STEP2,
      { loginInput: input }
    );
  }

  async logout(): Promise<ApiResponse> {
    const res = await this.mutate<LogoutMutation, Record<string, never>>(
      LOGOUT,
      {} as Record<string, never>
    );
    if (!res.success) return res;
    return {
      success: true,
      message: '로그아웃되었습니다.',
    };
  }

  async logoutAll(): Promise<ApiResponse> {
    const res = await this.mutate<LogoutAllMutation, Record<string, never>>(
      LOGOUT_ALL,
      {} as Record<string, never>
    );
    if (!res.success) return res;
    return {
      success: true,
      message: '모든 기기에서 로그아웃되었습니다.',
    };
  }

  async refreshToken(): Promise<ApiResponse<RefreshTokenMutation>> {
    return this.mutate<RefreshTokenMutation, Record<string, never>>(
      REFRESH_TOKEN,
      {} as Record<string, never>
    );
  }

  async register(
    input: RegisterUserInput
  ): Promise<ApiResponse<RegisterUserMutation>> {
    return this.mutate<RegisterUserMutation, RegisterUserMutationVariables>(
      REGISTER_USER,
      { registerInput: input }
    );
  }

  async verifyActivationCode(
    input: VerifyActivationCodeInput
  ): Promise<ApiResponse<VerifyActivationCodeMutation>> {
    return this.mutate<
      VerifyActivationCodeMutation,
      VerifyActivationCodeMutationVariables
    >(VERIFY_ACTIVATION_CODE, { verifyInput: input });
  }

  async resendActivationCode(
    input: ResendActivationCodeInput
  ): Promise<ApiResponse<ResendActivationCodeMutation>> {
    return this.mutate<
      ResendActivationCodeMutation,
      ResendActivationCodeMutationVariables
    >(RESEND_ACTIVATION_CODE, { input });
  }

  async forgotPassword(
    input: ForgotPasswordInput
  ): Promise<ApiResponse<ForgotPasswordMutation>> {
    return this.mutate<ForgotPasswordMutation, ForgotPasswordMutationVariables>(
      FORGOT_PASSWORD,
      { input }
    );
  }

  async resetPassword(
    input: ResetPasswordInput
  ): Promise<ApiResponse<ResetPasswordMutation>> {
    return this.mutate<ResetPasswordMutation, ResetPasswordMutationVariables>(
      RESET_PASSWORD,
      { input }
    );
  }

  async changePassword(
    input: ChangePasswordInput
  ): Promise<ApiResponse<ChangePasswordMutation>> {
    return this.mutate<ChangePasswordMutation, ChangePasswordMutationVariables>(
      CHANGE_PASSWORD,
      { input }
    );
  }

  async getConnectedSocialProviders(): Promise<ApiResponse<SocialProvider[]>> {
    const res = await this.query<GetConnectedSocialProvidersQuery>(
      GET_CONNECTED_SOCIAL_PROVIDERS
    );
    if (!res.success) return res as unknown as ApiResponse<SocialProvider[]>;

    const list = (res.data?.getConnectedSocialProviders ??
      []) as SocialProvider[];
    return { success: true, data: list };
  }

  async getSocialLoginUrl(
    input: SocialLoginStartInput
  ): Promise<ApiResponse<GetSocialLoginUrlQuery>> {
    return this.mutate<GetSocialLoginUrlQuery, GetSocialLoginUrlQueryVariables>(
      GET_SOCIAL_LOGIN_URL,
      { input }
    );
  }

  async verifySocialEmail(
    input: VerifySocialEmailInput
  ): Promise<ApiResponse<VerifySocialEmailMutation>> {
    return this.mutate<
      VerifySocialEmailMutation,
      VerifySocialEmailMutationVariables
    >(VERIFY_SOCIAL_EMAIL, { input });
  }

  async resendSocialActivationCode(
    input: ResendSocialActivationInput
  ): Promise<ApiResponse<ResendSocialActivationCodeMutation>> {
    return this.mutate<
      ResendSocialActivationCodeMutation,
      ResendSocialActivationCodeMutationVariables
    >(RESEND_SOCIAL_ACTIVATION_CODE, { input });
  }

  async unlinkSocialAccount(
    input: UnlinkSocialAccountInput
  ): Promise<ApiResponse<UnlinkSocialAccountMutation>> {
    return this.mutate<
      UnlinkSocialAccountMutation,
      UnlinkSocialAccountMutationVariables
    >(UNLINK_SOCIAL_ACCOUNT, { input });
  }

  async updateUserName(
    input: UpdateNameInput
  ): Promise<ApiResponse<UpdateUserNameMutation>> {
    return this.mutate<UpdateUserNameMutation, UpdateUserNameMutationVariables>(
      UPDATE_USER_NAME,
      { input }
    );
  }

  async requestEmailChange(
    input: ChangeEmailInput
  ): Promise<ApiResponse<RequestEmailChangeMutation>> {
    return this.mutate<
      RequestEmailChangeMutation,
      RequestEmailChangeMutationVariables
    >(REQUEST_EMAIL_CHANGE, { input });
  }

  async verifyEmailChange(
    input: EmailChangeVerifyInput
  ): Promise<ApiResponse<VerifyEmailChangeMutation>> {
    return this.mutate<
      VerifyEmailChangeMutation,
      VerifyEmailChangeMutationVariables
    >(VERIFY_EMAIL_CHANGE, { input });
  }

  async updatePhoneNumber(
    input: UpdatePhoneInput
  ): Promise<ApiResponse<UpdatePhoneNumberMutation>> {
    return this.mutate<
      UpdatePhoneNumberMutation,
      UpdatePhoneNumberMutationVariables
    >(UPDATE_PHONE_NUMBER, { input });
  }

  async updateBusiness(
    input: UpdateBusinessInput
  ): Promise<ApiResponse<UpdateBusinessMutation>> {
    return this.mutate<UpdateBusinessMutation, UpdateBusinessMutationVariables>(
      UPDATE_BUSINESS,
      { input }
    );
  }

  async deleteAvatar(
    input: DeleteAvatarInput
  ): Promise<ApiResponse<DeleteAvatarMutation>> {
    return this.mutate<DeleteAvatarMutation, DeleteAvatarMutationVariables>(
      DELETE_AVATAR,
      { input }
    );
  }

  async deleteAccount(): Promise<ApiResponse<DeleteAccountMutation>> {
    // 인자가 없는 Mutation이므로 빈 객체({})를 변수로 전달
    return this.mutate<DeleteAccountMutation, Record<string, never>>(
      DELETE_ACCOUNT,
      {} as Record<string, never>
    );
  }

  async generateTwoFactorQR(): Promise<ApiResponse<Generate2FaQrMutation>> {
    return this.mutate<Generate2FaQrMutation, object>(
      GENERATE_2FA_QR,
      {} as object
    );
  }

  async enableTwoFactor(
    input: Enable2FaInput
  ): Promise<ApiResponse<Enable2FaMutation>> {
    return this.mutate<Enable2FaMutation, Enable2FaMutationVariables>(
      ENABLE_2FA,
      { input }
    );
  }

  async disableTwoFactor(
    input: Disable2FaInput
  ): Promise<ApiResponse<Disable2FaMutation>> {
    return this.mutate<Disable2FaMutation, Disable2FaMutationVariables>(
      DISABLE_2FA,
      { input }
    );
  }

  async requestEmergencyEmailCode(
    input: RequestEmergencyCodeInput
  ): Promise<ApiResponse<RequestEmergencyEmailCodeMutation>> {
    return this.mutate<
      RequestEmergencyEmailCodeMutation,
      RequestEmergencyEmailCodeMutationVariables
    >(REQUEST_EMERGENCY_EMAIL_CODE, { input });
  }

  async disableTwoFactorDuringLogin(
    input: Disable2FaDuringLoginInput
  ): Promise<ApiResponse<Disable2FaMutation>> {
    return this.mutate<
      Disable2FaMutation,
      Disable2FaDuringLoginMutationVariables
    >(DISABLE_2FA_DURING_LOGIN, { input });
  }

  async getTwoFactorStatus(): Promise<ApiResponse<Get2FaStatusQuery>> {
    return this.query<Get2FaStatusQuery>(GET_2FA_STATUS);
  }

  async getIdentityVerification(
    identityVerificationId: string
  ): Promise<ApiResponse<GetIdentityVerificationQuery>> {
    return this.query<
      GetIdentityVerificationQuery,
      GetIdentityVerificationQueryVariables
    >(GET_IDENTITY_VERIFICATION, { identityVerificationId });
  }

  async getIdentityVerificationConfig(): Promise<
    ApiResponse<GetIdentityVerificationConfigQuery>
  > {
    return this.query<GetIdentityVerificationConfigQuery>(
      GET_IDENTITY_VERIFICATION_CONFIG
    );
  }

  async generateVerificationRequest(input: {
    identityVerificationId: string;
    customRedirectPath?: string;
  }): Promise<ApiResponse<GenerateVerificationRequestQuery>> {
    return this.query<
      GenerateVerificationRequestQuery,
      GenerateVerificationRequestQueryVariables
    >(GENERATE_VERIFICATION_REQUEST, {
      identityVerificationId: input.identityVerificationId,
      customRedirectPath: input.customRedirectPath,
    });
  }

  async requestIdentityVerification(
    input: RequestIdentityVerificationInput
  ): Promise<ApiResponse<RequestIdentityVerificationMutation>> {
    return this.mutate<
      RequestIdentityVerificationMutation,
      RequestIdentityVerificationMutationVariables
    >(REQUEST_IDENTITY_VERIFICATION, { input });
  }

  async verifyIdentityVerification(
    input: VerifyIdentityVerificationInput
  ): Promise<ApiResponse<VerifyIdentityVerificationMutation>> {
    return this.mutate<
      VerifyIdentityVerificationMutation,
      VerifyIdentityVerificationMutationVariables
    >(VERIFY_IDENTITY_VERIFICATION, { input });
  }

  async validateBusinessNumber(
    businessNumber: string
  ): Promise<ApiResponse<ValidateBusinessNumberQuery>> {
    return this.query<
      ValidateBusinessNumberQuery,
      ValidateBusinessNumberQueryVariables
    >(VALIDATE_BUSINESS_NUMBER, { businessNumber });
  }

  // ✅ getAllUsers - 캐시 우선
  async getAllUsers(variables: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string[];
    status?: string[];
  }): Promise<ApiResponse<GetAllUsersQuery>> {
    return this.query<GetAllUsersQuery, GetAllUsersQueryVariables>(
      GET_ALL_USERS,
      variables,
      { fetchPolicy: 'cache-first' } // ✅ 캐시 활용
    );
  }

  // ✅ getUserById - 캐시 우선 (상세 페이지는 최신 데이터 필요하면 network-only)
  async getUserById(id: number): Promise<ApiResponse<GetUserByIdQuery>> {
    // ✅ 입력 검증
    if (!id || id <= 0 || isNaN(id)) {
      console.error('❌ Invalid user ID:', id);
      return {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '유효하지 않은 사용자 ID입니다.',
        },
      };
    }

    return this.query<GetUserByIdQuery, GetUserByIdQueryVariables>(
      GET_USER_BY_ID,
      { id },
      { fetchPolicy: 'network-only' } // ✅ 상세 페이지는 최신 데이터
    );
  }

  // ✅ getUsersStats - 캐시 우선
  async getUsersStats(): Promise<ApiResponse<GetUsersStatsQuery>> {
    return this.query<GetUsersStatsQuery>(
      GET_USERS_STATS,
      undefined,
      { fetchPolicy: 'cache-first' } // ✅ 캐시 활용
    );
  }

  // 초대 목록 조회
  async getInvitations(variables: {
    page?: number;
    limit?: number;
    status?: InvitationStatus;
  }): Promise<ApiResponse<GetInvitationsQuery>> {
    return this.query<GetInvitationsQuery, GetInvitationsQueryVariables>(
      GET_INVITATIONS,
      variables
    );
  }

  // 관리자가 사용자 정보 수정
  async updateUserByAdmin(
    id: number,
    input: UpdateUserByAdminInput
  ): Promise<ApiResponse<UpdateUserByAdminMutation>> {
    return this.mutate<
      UpdateUserByAdminMutation,
      UpdateUserByAdminMutationVariables
    >(UPDATE_USER_BY_ADMIN, { id, input });
  }

  // 관리자가 사용자 삭제
  async deleteUserByAdmin(
    id: number
  ): Promise<ApiResponse<DeleteUserByAdminMutation>> {
    return this.mutate<
      DeleteUserByAdminMutation,
      DeleteUserByAdminMutationVariables
    >(DELETE_USER_BY_ADMIN, { id });
  }

  // 사용자 초대
  async inviteUser(
    input: InviteUserInput
  ): Promise<ApiResponse<InviteUserMutation>> {
    return this.mutate<InviteUserMutation, InviteUserMutationVariables>(
      INVITE_USER,
      { input }
    );
  }

  // 초대 취소
  async cancelInvitation(
    invitationId: number
  ): Promise<ApiResponse<CancelInvitationMutation>> {
    return this.mutate<
      CancelInvitationMutation,
      CancelInvitationMutationVariables
    >(CANCEL_INVITATION, { invitationId });
  }

  // 초대 재발송
  async resendInvitation(
    invitationId: number
  ): Promise<ApiResponse<ResendInvitationMutation>> {
    return this.mutate<
      ResendInvitationMutation,
      ResendInvitationMutationVariables
    >(RESEND_INVITATION, { invitationId });
  }

  clearAuthCache(): void {
    // 캐시 초기화는 fire-and-forget 로 처리
    this.client
      .clearStore()
      .catch((err) => console.error('[AuthService] clearAuthCache error', err));
  }
}

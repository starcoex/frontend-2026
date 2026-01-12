import { useCallback, useRef } from 'react';
import { useAuthContext } from '../context';
import { getAuthService } from '../services';
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
  SocialProvider,
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
  GetIdentityVerificationQuery,
  GetIdentityVerificationConfigQuery,
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
import type { ApiResponse, IAuthService } from '../types';

interface UseAuthOptions {
  onAuthStateChange?: (isAuthenticated: boolean) => void;
}

interface UseAuthReturn {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean | null;
  currentUser: User | null;
  initialized: boolean;

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

  // 사용자 정보 관리
  updateUserName: (
    input: UpdateNameInput
  ) => Promise<ApiResponse<UpdateUserNameMutation>>;
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

  // 본인인증
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

  // 관리자 전용
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

  clearError: () => void;
  clearAuthCache: () => void;
  checkServiceStatus: () => Promise<boolean>;
}

export const useAuth = (options: UseAuthOptions = {}): UseAuthReturn => {
  const { onAuthStateChange } = options;
  const context = useAuthContext();

  // ✅ 중요한 작업만 중복 방지 (선택적)
  const pendingCriticalOperations = useRef(new Set<string>());

  /**
   * ✅ 개선된 API 호출 래퍼
   * - 기본적으로는 동시 요청 허용
   * - 중요한 작업만 선택적으로 중복 방지
   */
  const withLoading = useCallback(
    async <T>(
      operation: () => Promise<ApiResponse<T>>,
      defaultErrorMessage: string,
      shouldUpdateAuthState = false,
      options?: {
        operationId?: string;
        preventDuplicate?: boolean;
      }
    ): Promise<ApiResponse<T>> => {
      const { operationId, preventDuplicate = false } = options || {};

      // ✅ 중복 방지가 필요한 경우에만 체크
      if (preventDuplicate && operationId) {
        if (pendingCriticalOperations.current.has(operationId)) {
          console.warn(`⚠️ Operation "${operationId}" already in progress`);
          return {
            success: false,
            error: {
              code: 'ALREADY_LOADING',
              message: '이미 요청이 진행 중입니다.',
            },
          };
        }
        pendingCriticalOperations.current.add(operationId);
      }

      try {
        // ✅ 이미 로딩 중이 아닐 때만 setLoading
        if (!context.isLoading) {
          context.setLoading();
        }
        context.clearError();

        const res = await operation();

        // ✅ ApiResponse 타입 체크 및 에러 처리
        if (!res.success) {
          let errorMsg = defaultErrorMessage;

          // GraphQL 에러 메시지 우선 사용
          if (res.graphQLErrors && res.graphQLErrors.length > 0) {
            errorMsg = res.graphQLErrors[0].message;
          } else if (res.error?.message) {
            errorMsg = res.error.message;
          }

          context.setError(errorMsg);
        } else if (shouldUpdateAuthState) {
          // 성공 시 인증 상태 업데이트
          const service = getAuthService();
          const status = await service.checkAuthStatus();
          if (status.isAuthenticated && status.user) {
            context.setUser(status.user);
            onAuthStateChange?.(true);
          } else {
            context.setLogout();
            onAuthStateChange?.(false);
          }
        }

        return res;
      } catch (err) {
        console.error('[withLoading] Operation failed:', err);
        const errorMsg =
          err instanceof Error ? err.message : defaultErrorMessage;
        context.setError(errorMsg);

        return {
          success: false,
          error: {
            code: 'OPERATION_FAILED',
            message: errorMsg,
          },
        } as ApiResponse<T>;
      } finally {
        // ✅ 중복 방지 플래그 제거
        if (preventDuplicate && operationId) {
          pendingCriticalOperations.current.delete(operationId);
        }
        context.setInitialized();
      }
    },
    [context, onAuthStateChange]
  );

  // ============================================================================
  // 인증 상태 관리
  // ============================================================================

  const checkAuthStatus = useCallback(async () => {
    const service = getAuthService();

    try {
      if (!context.isLoading) {
        context.setLoading();
      }
      context.clearError();

      const status = await service.checkAuthStatus();

      if (status.isAuthenticated && status.user) {
        context.setUser(status.user);
      } else {
        context.setLogout();
      }

      return status;
    } catch (e) {
      console.warn('checkAuthStatus 실패:', e);
      context.setError('인증 상태를 확인하지 못했습니다.');
      context.setLogout();
      throw e;
    } finally {
      context.setInitialized();
    }
  }, [context]);

  const getCurrentUser = useCallback(async () => {
    const service = getAuthService();
    const user = await service.getCurrentUser();
    context.setUser(user);
    return user;
  }, [context.setUser]);

  // ============================================================================
  // 로그인/로그아웃 (✅ 중복 방지 필요)
  // ============================================================================

  const loginStep1 = useCallback(
    (input: LoginUser1Input) =>
      withLoading(
        async () => {
          const service = getAuthService();
          const res = await service.loginStep1(input);

          if (res.success && res.data && !res.data.loginStep1.requires2FA) {
            await new Promise((resolve) => setTimeout(resolve, 300));
            const status = await service.checkAuthStatus();
            if (status.user) context.setUser(status.user);
          }
          return res;
        },
        '1단계 로그인에 실패했습니다',
        false,
        {
          operationId: `login-${input.email}`,
          preventDuplicate: true, // ✅ 중복 로그인 방지
        }
      ),
    [withLoading, context.setUser]
  );

  const loginStep2 = useCallback(
    (input: LoginUser2Input) =>
      withLoading(
        async () => {
          const service = getAuthService();
          const res = await service.loginStep2(input);
          if (res.success) {
            const status = await service.checkAuthStatus();
            if (status.user) context.setUser(status.user);
          }
          return res;
        },
        '2단계 로그인에 실패했습니다',
        true,
        {
          operationId: 'login-step2',
          preventDuplicate: true, // ✅ 중복 방지
        }
      ),
    [withLoading, context.setUser]
  );

  const logout = useCallback(
    () =>
      withLoading(async () => {
        const service = getAuthService();
        const res = await service.logout();
        if (res.success) {
          context.setLogout();
          onAuthStateChange?.(false);
        }
        return res;
      }, '로그아웃에 실패했습니다'),
    [withLoading, context.setLogout, onAuthStateChange]
  );

  const logoutAll = useCallback(
    () =>
      withLoading(async () => {
        const service = getAuthService();
        const res = await service.logoutAll();
        if (res.success) {
          context.setLogout();
          onAuthStateChange?.(false);
        }
        return res;
      }, '전체 로그아웃에 실패했습니다'),
    [withLoading, context.setLogout, onAuthStateChange]
  );

  const refreshToken = useCallback(
    () =>
      withLoading(
        () => getAuthService().refreshToken(),
        '토큰 갱신에 실패했습니다',
        true
      ),
    [withLoading]
  );

  // ============================================================================
  // 회원가입/인증 (✅ 중복 방지 필요)
  // ============================================================================

  const register = useCallback(
    (input: RegisterUserInput) =>
      withLoading(
        () => getAuthService().register(input),
        '회원가입에 실패했습니다',
        false,
        {
          operationId: `register-${input.email}`,
          preventDuplicate: true, // ✅ 중복 회원가입 방지
        }
      ),
    [withLoading]
  );

  const verifyActivationCode = useCallback(
    (input: VerifyActivationCodeInput) =>
      withLoading(
        () => getAuthService().verifyActivationCode(input),
        '인증 코드 검증에 실패했습니다'
      ),
    [withLoading]
  );

  const resendActivationCode = useCallback(
    (input: ResendActivationCodeInput) =>
      withLoading(
        () => getAuthService().resendActivationCode(input),
        '인증 코드 재발송에 실패했습니다'
      ),
    [withLoading]
  );

  // ============================================================================
  // 비밀번호
  // ============================================================================

  const forgotPassword = useCallback(
    (input: ForgotPasswordInput) =>
      withLoading(
        () => getAuthService().forgotPassword(input),
        '비밀번호 찾기에 실패했습니다'
      ),
    [withLoading]
  );

  const resetPassword = useCallback(
    (input: ResetPasswordInput) =>
      withLoading(
        () => getAuthService().resetPassword(input),
        '비밀번호 재설정에 실패했습니다'
      ),
    [withLoading]
  );

  const changePassword = useCallback(
    (input: ChangePasswordInput) =>
      withLoading(
        () => getAuthService().changePassword(input),
        '비밀번호 변경에 실패했습니다'
      ),
    [withLoading]
  );

  // ============================================================================
  // 소셜 로그인
  // ============================================================================

  const getConnectedSocialProviders = useCallback(
    () =>
      withLoading(
        () => getAuthService().getConnectedSocialProviders(),
        '소셜 제공자 목록 조회에 실패했습니다'
      ),
    [withLoading]
  );

  const getSocialLoginUrl = useCallback(
    (input: SocialLoginStartInput) => getAuthService().getSocialLoginUrl(input),
    []
  );

  const verifySocialEmail = useCallback(
    (input: VerifySocialEmailInput) =>
      withLoading(
        () => getAuthService().verifySocialEmail(input),
        '소셜 이메일 인증에 실패했습니다'
      ),
    [withLoading]
  );

  const resendSocialActivationCode = useCallback(
    (input: ResendSocialActivationInput) =>
      withLoading(
        () => getAuthService().resendSocialActivationCode(input),
        '소셜 인증 코드 재발송에 실패했습니다'
      ),
    [withLoading]
  );

  const unlinkSocialAccount = useCallback(
    (input: UnlinkSocialAccountInput) =>
      withLoading(
        () => getAuthService().unlinkSocialAccount(input),
        '소셜 계정 연결 해제에 실패했습니다'
      ),
    [withLoading]
  );

  // ============================================================================
  // 사용자 정보 관리
  // ============================================================================

  const updateUserName = useCallback(
    (input: UpdateNameInput) =>
      withLoading(
        () => getAuthService().updateUserName(input),
        '이름 변경에 실패했습니다'
      ),
    [withLoading]
  );

  const requestEmailChange = useCallback(
    (input: ChangeEmailInput) =>
      withLoading(
        () => getAuthService().requestEmailChange(input),
        '이메일 변경 요청에 실패했습니다'
      ),
    [withLoading]
  );

  const verifyEmailChange = useCallback(
    (input: EmailChangeVerifyInput) =>
      withLoading(
        () => getAuthService().verifyEmailChange(input),
        '이메일 변경 확인에 실패했습니다'
      ),
    [withLoading]
  );

  const updatePhoneNumber = useCallback(
    (input: UpdatePhoneInput) =>
      withLoading(
        () => getAuthService().updatePhoneNumber(input),
        '전화번호 변경에 실패했습니다'
      ),
    [withLoading]
  );

  const updateBusiness = useCallback(
    (input: UpdateBusinessInput) =>
      withLoading(
        () => getAuthService().updateBusiness(input),
        '사업자 정보 변경에 실패했습니다'
      ),
    [withLoading]
  );

  const deleteAvatar = useCallback(
    (input: DeleteAvatarInput) =>
      withLoading(
        () => getAuthService().deleteAvatar(input),
        '아바타 삭제에 실패했습니다'
      ),
    [withLoading]
  );

  const deleteAccount = useCallback(
    () =>
      withLoading(
        () => getAuthService().deleteAccount(),
        '사용자 삭제에 실패했습니다',
        true,
        {
          operationId: 'delete-account',
          preventDuplicate: true, // ✅ 계정 삭제는 중복 방지
        }
      ),
    [withLoading]
  );

  // ============================================================================
  // 2FA 관리
  // ============================================================================

  const generateTwoFactorQR = useCallback(
    () =>
      withLoading(
        () => getAuthService().generateTwoFactorQR(),
        '2FA QR 코드 생성에 실패했습니다'
      ),
    [withLoading]
  );

  const enableTwoFactor = useCallback(
    (input: Enable2FaInput) =>
      withLoading(
        () => getAuthService().enableTwoFactor(input),
        '2FA 활성화에 실패했습니다'
      ),
    [withLoading]
  );

  const disableTwoFactor = useCallback(
    (input: Disable2FaInput) =>
      withLoading(
        () => getAuthService().disableTwoFactor(input),
        '2FA 비활성화에 실패했습니다'
      ),
    [withLoading]
  );

  const requestEmergencyEmailCode = useCallback(
    (input: RequestEmergencyCodeInput) =>
      withLoading(
        () => getAuthService().requestEmergencyEmailCode(input),
        '긴급 이메일 코드 요청에 실패했습니다'
      ),
    [withLoading]
  );

  const disableTwoFactorDuringLogin = useCallback(
    (input: Disable2FaDuringLoginInput) =>
      withLoading(
        () => getAuthService().disableTwoFactorDuringLogin(input),
        '로그인 중 2FA 비활성화에 실패했습니다'
      ),
    [withLoading]
  );

  const getTwoFactorStatus = useCallback(
    () =>
      withLoading(
        () => getAuthService().getTwoFactorStatus(),
        '2FA 상태 조회에 실패했습니다'
      ),
    [withLoading]
  );

  // ============================================================================
  // 본인인증
  // ============================================================================

  const getIdentityVerification = useCallback(
    (identityVerificationId: string) =>
      withLoading(
        () => getAuthService().getIdentityVerification(identityVerificationId),
        '본인인증 정보 조회에 실패했습니다'
      ),
    [withLoading]
  );

  const getIdentityVerificationConfig = useCallback(
    () =>
      withLoading(
        () => getAuthService().getIdentityVerificationConfig(),
        '본인인증 설정 조회에 실패했습니다'
      ),
    [withLoading]
  );

  const generateVerificationRequest = useCallback(
    (input: { identityVerificationId: string; customRedirectPath?: string }) =>
      withLoading(
        () => getAuthService().generateVerificationRequest(input),
        '본인인증 요청 데이터 생성에 실패했습니다'
      ),
    [withLoading]
  );

  const requestIdentityVerification = useCallback(
    (input: RequestIdentityVerificationInput) =>
      withLoading(
        () => getAuthService().requestIdentityVerification(input),
        '본인인증 요청에 실패했습니다'
      ),
    [withLoading]
  );

  const verifyIdentityVerification = useCallback(
    (input: VerifyIdentityVerificationInput) =>
      withLoading(
        () => getAuthService().verifyIdentityVerification(input),
        '본인인증 결과 확인에 실패했습니다'
      ),
    [withLoading]
  );

  const validateBusinessNumber = useCallback(
    (businessNumber: string) =>
      withLoading(
        () => getAuthService().validateBusinessNumber(businessNumber),
        '사업자번호 검증에 실패했습니다'
      ),
    [withLoading]
  );

  // ============================================================================
  // 관리자 전용 (✅ 중복 방지 없음 - 동시 작업 허용)
  // ============================================================================

  const getAllUsers = useCallback(
    (variables: {
      page?: number;
      limit?: number;
      search?: string;
      role?: string[];
      status?: string[];
    }) =>
      withLoading(
        () => getAuthService().getAllUsers(variables),
        '사용자 목록 조회에 실패했습니다'
      ),
    [withLoading]
  );

  const getUserById = useCallback(
    (id: number) =>
      withLoading(
        () => getAuthService().getUserById(id),
        '사용자 조회에 실패했습니다'
      ),
    [withLoading]
  );

  const getUsersStats = useCallback(
    () =>
      withLoading(
        () => getAuthService().getUsersStats(),
        '사용자 통계 조회에 실패했습니다'
      ),
    [withLoading]
  );

  const getInvitations = useCallback(
    (variables: { page?: number; limit?: number; status?: InvitationStatus }) =>
      withLoading(
        () => getAuthService().getInvitations(variables),
        '초대 목록 조회에 실패했습니다'
      ),
    [withLoading]
  );

  const updateUserByAdmin = useCallback(
    (id: number, input: UpdateUserByAdminInput) =>
      withLoading(
        () => getAuthService().updateUserByAdmin(id, input),
        '사용자 정보 수정에 실패했습니다'
      ),
    [withLoading]
  );

  const deleteUserByAdmin = useCallback(
    (id: number) =>
      withLoading(
        () => getAuthService().deleteUserByAdmin(id),
        '사용자 삭제에 실패했습니다'
      ),
    [withLoading]
  );

  const inviteUser = useCallback(
    (input: InviteUserInput) =>
      withLoading(
        () => getAuthService().inviteUser(input),
        '사용자 초대에 실패했습니다'
        // ✅ preventDuplicate 없음 → 동시 초대 가능
      ),
    [withLoading]
  );

  const cancelInvitation = useCallback(
    (invitationId: number) =>
      withLoading(
        () => getAuthService().cancelInvitation(invitationId),
        '초대 취소에 실패했습니다'
        // ✅ preventDuplicate 없음 → 동시 취소 가능
      ),
    [withLoading]
  );

  const resendInvitation = useCallback(
    (invitationId: number) =>
      withLoading(
        () => getAuthService().resendInvitation(invitationId),
        '초대 재발송에 실패했습니다'
        // ✅ preventDuplicate 없음 → 동시 재발송 가능
      ),
    [withLoading]
  );

  const verifyInvitationToken = useCallback(
    (token: string) =>
      withLoading(
        () => getAuthService().verifyInvitationToken(token),
        '초대 토큰 검증에 실패했습니다'
      ),
    [withLoading]
  );

  const acceptInvitation = useCallback(
    (token: string, input: AcceptInvitationInput) =>
      withLoading(
        () => getAuthService().acceptInvitation(token, input),
        '초대 수락에 실패했습니다'
      ),
    [withLoading]
  );

  // ============================================================================
  // 유틸리티
  // ============================================================================

  const clearAuthCache = useCallback(() => {
    const service = getAuthService() as IAuthService & {
      clearAuthCache?: () => void;
    };
    service.clearAuthCache?.();
  }, []);

  const checkServiceStatus = useCallback(async () => {
    try {
      const service = getAuthService();
      const status = await service.checkAuthStatus();
      if (status.isAuthenticated && status.user) {
        context.setUser(status.user);
      }
      return true;
    } catch {
      return false;
    }
  }, [context.setUser]);

  return {
    isLoading: context.isLoading,
    error: context.error,
    isAuthenticated: context.isAuthenticated,
    currentUser: context.user,
    initialized: context.initialized,

    checkAuthStatus,
    getCurrentUser,

    loginStep1,
    loginStep2,
    refreshToken,
    logout,
    logoutAll,

    getAllUsers,
    getUserById,
    getUsersStats,
    getInvitations,
    updateUserByAdmin,
    deleteUserByAdmin,
    inviteUser,
    cancelInvitation,
    resendInvitation,
    verifyInvitationToken,
    acceptInvitation,

    register,
    verifyActivationCode,
    resendActivationCode,
    forgotPassword,
    resetPassword,
    changePassword,

    getConnectedSocialProviders,
    getSocialLoginUrl,
    verifySocialEmail,
    resendSocialActivationCode,
    unlinkSocialAccount,

    updateUserName,
    requestEmailChange,
    verifyEmailChange,
    updatePhoneNumber,
    updateBusiness,
    deleteAvatar,
    deleteAccount,

    generateTwoFactorQR,
    enableTwoFactor,
    disableTwoFactor,
    requestEmergencyEmailCode,
    disableTwoFactorDuringLogin,
    getTwoFactorStatus,

    getIdentityVerification,
    getIdentityVerificationConfig,
    generateVerificationRequest,
    requestIdentityVerification,
    verifyIdentityVerification,
    validateBusinessNumber,

    clearError: context.clearError,
    clearAuthCache,
    checkServiceStatus,
  };
};

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

  clearError: () => void;
  clearAuthCache: () => void;
  checkServiceStatus: () => Promise<boolean>;
}

export const useAuth = (options: UseAuthOptions = {}): UseAuthReturn => {
  const { onAuthStateChange } = options;
  const context = useAuthContext();

  // ✅ 1. Context에서 함수와 상태 분리
  const {
    setLoading,
    clearError,
    setUser,
    setLogout,
    setInitialized,
    setError,
    isLoading: contextIsLoading,
  } = context;

  // ✅ 2. isLoading 상태를 ref로 관리 (useEffect 의존성 제거용)
  const isLoadingRef = useRef(contextIsLoading);
  isLoadingRef.current = contextIsLoading;

  // ✅ 3. withLoading 함수 수정 (context 의존성 제거, setter 함수만 의존)
  const withLoading = useCallback(
    async <T>(
      operation: () => Promise<ApiResponse<T>>,
      defaultErrorMessage: string,
      shouldUpdateAuthState = false
    ): Promise<ApiResponse<T>> => {
      try {
        // ✅ 이미 로딩 중이면 중복 실행 방지
        if (isLoadingRef.current) {
          console.warn('⚠️ [withLoading] Already loading, skipping...');
          return {
            success: false,
            error: {
              code: 'ALREADY_LOADING',
              message: '이미 요청이 진행 중입니다.',
            },
          };
        }

        isLoadingRef.current = true; // ✅ 로딩 시작
        setLoading();
        clearError();

        const res = await operation();

        if (!res.success) {
          const msg =
            res.error?.message ??
            res.graphQLErrors?.[0]?.message ??
            defaultErrorMessage;
          setError(msg);
        } else if (shouldUpdateAuthState) {
          const service = getAuthService();
          const status = await service.checkAuthStatus();
          if (status.isAuthenticated && status.user) {
            setUser(status.user);
            onAuthStateChange?.(true);
          } else {
            setLogout();
            onAuthStateChange?.(false);
          }
        }

        return res;
      } finally {
        isLoadingRef.current = false; // ✅ 로딩 종료
        setInitialized();
      }
    },
    [
      setLoading,
      clearError,
      setError,
      setUser,
      setLogout,
      setInitialized,
      onAuthStateChange,
    ]
  );

  // ✅ 4. checkAuthStatus 수정 (context 의존성 제거)
  const checkAuthStatus = useCallback(async () => {
    const service = getAuthService();

    try {
      if (!isLoadingRef.current) {
        setLoading();
      }
      clearError();

      const status = await service.checkAuthStatus();

      if (status.isAuthenticated && status.user) {
        setUser(status.user);
      } else {
        setLogout();
      }

      return status;
    } catch (e) {
      console.warn('checkAuthStatus 실패:', e);
      setError('인증 상태를 확인하지 못했습니다.');
      setLogout();
      throw e;
    } finally {
      setInitialized();
    }
  }, [setLoading, clearError, setUser, setLogout, setError, setInitialized]);

  // ✅ 5. getCurrentUser 수정 (context 의존성 제거)
  const getCurrentUser = useCallback(async () => {
    const service = getAuthService();
    const user = await service.getCurrentUser();
    setUser(user);
    return user;
  }, [setUser]);

  // ✅ 6. 나머지 메서드들: withLoading이나 개별 setter만 사용하도록 수정
  const loginStep1 = useCallback(
    async (input: LoginUser1Input) =>
      withLoading(async () => {
        const service = getAuthService();
        const res = await service.loginStep1(input);

        if (res.success && res.data && !res.data.loginStep1.requires2FA) {
          await new Promise((resolve) => setTimeout(resolve, 300));
          const status = await service.checkAuthStatus();

          if (status.user) setUser(status.user);
        }
        return res;
      }, '1단계 로그인에 실패했습니다'),
    [withLoading, setUser]
  );

  const loginStep2 = useCallback(
    async (input: LoginUser2Input) =>
      withLoading(
        async () => {
          const service = getAuthService();
          const res = await service.loginStep2(input);
          if (res.success) {
            const status = await service.checkAuthStatus();
            if (status.user) setUser(status.user);
          }
          return res;
        },
        '2단계 로그인에 실패했습니다',
        true
      ),
    [withLoading, setUser]
  );

  const deleteAccount = useCallback(
    async () =>
      withLoading(
        async () => {
          const service = getAuthService();
          return service.deleteAccount();
        },
        '사용자 삭제에 실패했습니다',
        true
      ),
    [withLoading]
  );

  const refreshToken = useCallback(
    async () =>
      withLoading(
        async () => {
          const service = getAuthService();
          return service.refreshToken();
        },
        '토큰 갱신에 실패했습니다',
        true
      ),
    [withLoading]
  );

  const logout = useCallback(
    async () =>
      withLoading(async () => {
        const service = getAuthService();
        const res = await service.logout();
        if (res.success) {
          setLogout();
          onAuthStateChange?.(false);
        }
        return res;
      }, '로그아웃에 실패했습니다'),
    [withLoading, setLogout, onAuthStateChange]
  );

  const logoutAll = useCallback(
    async () =>
      withLoading(async () => {
        const service = getAuthService();
        const res = await service.logoutAll();
        if (res.success) {
          setLogout();
          onAuthStateChange?.(false);
        }
        return res;
      }, '전체 로그아웃에 실패했습니다'),
    [withLoading, setLogout, onAuthStateChange]
  );

  /**
   * ========================================
   * 새로 추가: 관리자 전용 메서드들
   * ========================================
   */

  // 전체 사용자 목록 조회
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

  // 특정 사용자 조회
  const getUserById = useCallback(
    (id: number) =>
      withLoading(
        () => getAuthService().getUserById(id),
        '사용자 조회에 실패했습니다'
      ),
    [withLoading]
  );

  // 사용자 통계
  const getUsersStats = useCallback(
    () =>
      withLoading(
        () => getAuthService().getUsersStats(),
        '사용자 통계 조회에 실패했습니다'
      ),
    [withLoading]
  );

  // 초대 목록 조회
  const getInvitations = useCallback(
    (variables: { page?: number; limit?: number; status?: InvitationStatus }) =>
      withLoading(
        () => getAuthService().getInvitations(variables),
        '초대 목록 조회에 실패했습니다'
      ),
    [withLoading]
  );

  // 관리자가 사용자 정보 수정
  const updateUserByAdmin = useCallback(
    (id: number, input: UpdateUserByAdminInput) =>
      withLoading(
        () => getAuthService().updateUserByAdmin(id, input),
        '사용자 정보 수정에 실패했습니다'
      ),
    [withLoading]
  );

  // 관리자가 사용자 삭제
  const deleteUserByAdmin = useCallback(
    (id: number) =>
      withLoading(
        () => getAuthService().deleteUserByAdmin(id),
        '사용자 삭제에 실패했습니다'
      ),
    [withLoading]
  );

  // 사용자 초대
  const inviteUser = useCallback(
    (input: InviteUserInput) =>
      withLoading(
        () => getAuthService().inviteUser(input),
        '사용자 초대에 실패했습니다'
      ),
    [withLoading]
  );

  // 초대 취소
  const cancelInvitation = useCallback(
    (invitationId: number) =>
      withLoading(
        () => getAuthService().cancelInvitation(invitationId),
        '초대 취소에 실패했습니다'
      ),
    [withLoading]
  );

  // 초대 재발송
  const resendInvitation = useCallback(
    (invitationId: number) =>
      withLoading(
        () => getAuthService().resendInvitation(invitationId),
        '초대 재발송에 실패했습니다'
      ),
    [withLoading]
  );

  // 회원가입/인증/비밀번호
  const register = (input: RegisterUserInput) =>
    withLoading(
      () => getAuthService().register(input),
      '회원가입에 실패했습니다'
    );

  const verifyActivationCode = (input: VerifyActivationCodeInput) =>
    withLoading(
      () => getAuthService().verifyActivationCode(input),
      '인증 코드 검증에 실패했습니다'
    );

  const resendActivationCode = (input: ResendActivationCodeInput) =>
    withLoading(
      () => getAuthService().resendActivationCode(input),
      '인증 코드 재발송에 실패했습니다'
    );

  const forgotPassword = (input: ForgotPasswordInput) =>
    withLoading(
      () => getAuthService().forgotPassword(input),
      '비밀번호 찾기에 실패했습니다'
    );

  const resetPassword = (input: ResetPasswordInput) =>
    withLoading(
      () => getAuthService().resetPassword(input),
      '비밀번호 재설정에 실패했습니다'
    );

  const changePassword = (input: ChangePasswordInput) =>
    withLoading(
      () => getAuthService().changePassword(input),
      '비밀번호 변경에 실패했습니다'
    );

  // 소셜
  const getConnectedSocialProviders = () =>
    withLoading(
      () => getAuthService().getConnectedSocialProviders(),
      '소셜 제공자 목록 조회에 실패했습니다'
    );

  const getSocialLoginUrl = (input: SocialLoginStartInput) =>
    getAuthService().getSocialLoginUrl(input);

  const verifySocialEmail = (input: VerifySocialEmailInput) =>
    withLoading(
      () => getAuthService().verifySocialEmail(input),
      '소셜 이메일 인증에 실패했습니다'
    );

  const resendSocialActivationCode = (input: ResendSocialActivationInput) =>
    withLoading(
      () => getAuthService().resendSocialActivationCode(input),
      '소셜 인증 코드 재발송에 실패했습니다'
    );

  const unlinkSocialAccount = (input: UnlinkSocialAccountInput) =>
    withLoading(
      () => getAuthService().unlinkSocialAccount(input),
      '소셜 계정 연결 해제에 실패했습니다'
    );

  // 사용자 정보
  const updateUserName = (input: UpdateNameInput) =>
    withLoading(
      () => getAuthService().updateUserName(input),
      '이름 변경에 실패했습니다'
    );

  const requestEmailChange = (input: ChangeEmailInput) =>
    withLoading(
      () => getAuthService().requestEmailChange(input),
      '이메일 변경 요청에 실패했습니다'
    );

  const verifyEmailChange = (input: EmailChangeVerifyInput) =>
    withLoading(
      () => getAuthService().verifyEmailChange(input),
      '이메일 변경 확인에 실패했습니다'
    );

  const updatePhoneNumber = (input: UpdatePhoneInput) =>
    withLoading(
      () => getAuthService().updatePhoneNumber(input),
      '전화번호 변경에 실패했습니다'
    );

  const updateBusiness = (input: UpdateBusinessInput) =>
    withLoading(
      () => getAuthService().updateBusiness(input),
      '사업자 정보 변경에 실패했습니다'
    );

  const deleteAvatar = (input: DeleteAvatarInput) =>
    withLoading(
      () => getAuthService().deleteAvatar(input),
      '아바타 삭제에 실패했습니다'
    );

  // 2FA
  const generateTwoFactorQR = () =>
    withLoading(
      () => getAuthService().generateTwoFactorQR(),
      '2FA QR 코드 생성에 실패했습니다'
    );

  const enableTwoFactor = (input: Enable2FaInput) =>
    withLoading(
      () => getAuthService().enableTwoFactor(input),
      '2FA 활성화에 실패했습니다'
    );

  const disableTwoFactor = (input: Disable2FaInput) =>
    withLoading(
      () => getAuthService().disableTwoFactor(input),
      '2FA 비활성화에 실패했습니다'
    );

  const requestEmergencyEmailCode = (input: RequestEmergencyCodeInput) =>
    withLoading(
      () => getAuthService().requestEmergencyEmailCode(input),
      '긴급 이메일 코드 요청에 실패했습니다'
    );

  const disableTwoFactorDuringLogin = (input: Disable2FaDuringLoginInput) =>
    withLoading(
      () => getAuthService().disableTwoFactorDuringLogin(input),
      '로그인 중 2FA 비활성화에 실패했습니다'
    );

  const getTwoFactorStatus = () =>
    withLoading(
      () => getAuthService().getTwoFactorStatus(),
      '2FA 상태 조회에 실패했습니다'
    );

  // 본인인증
  const getIdentityVerification = (identityVerificationId: string) =>
    withLoading(
      () => getAuthService().getIdentityVerification(identityVerificationId),
      '본인인증 정보 조회에 실패했습니다'
    );

  const getIdentityVerificationConfig = () =>
    withLoading(
      () => getAuthService().getIdentityVerificationConfig(),
      '본인인증 설정 조회에 실패했습니다'
    );

  const generateVerificationRequest = (input: {
    identityVerificationId: string;
    customRedirectPath?: string;
  }) =>
    withLoading(
      () => getAuthService().generateVerificationRequest(input),
      '본인인증 요청 데이터 생성에 실패했습니다'
    );

  const requestIdentityVerification = (
    input: RequestIdentityVerificationInput
  ) =>
    withLoading(
      () => getAuthService().requestIdentityVerification(input),
      '본인인증 요청에 실패했습니다'
    );

  const verifyIdentityVerification = (input: VerifyIdentityVerificationInput) =>
    withLoading(
      () => getAuthService().verifyIdentityVerification(input),
      '본인인증 결과 확인에 실패했습니다'
    );

  const validateBusinessNumber = (businessNumber: string) =>
    withLoading(
      () => getAuthService().validateBusinessNumber(businessNumber),
      '사업자번호 검증에 실패했습니다'
    );

  // ✅ 7. 나머지 단순 withLoading 래퍼들은 그대로 두되,
  //      clearAuthCache와 checkServiceStatus는 useCallback 최적화 적용
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
        setUser(status.user);
      }
      return true;
    } catch {
      return false;
    }
  }, [setUser]);

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

    // ✅ 새로 추가: 관리자 전용 메서드들
    getAllUsers,
    getUserById,
    getUsersStats,
    getInvitations,
    updateUserByAdmin,
    deleteUserByAdmin,
    inviteUser,
    cancelInvitation,
    resendInvitation,

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

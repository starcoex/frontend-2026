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
  AdminMasterKeyInput,
  PromoteToSuperAdminWithMasterKeyMutation,
  ChangeRoleInput,
  ChangeUserRoleMutation,
  CreateGuestUserByAdminMutation,
  DeleteUsersByAdminMutation,
  DeleteInvitationMutation,
  DeleteInvitationsMutation,
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

  checkAuthStatus(): Promise<{ isAuthenticated: boolean; user?: User }>;
  getCurrentUser(): Promise<User>;

  loginStep1(input: LoginUser1Input): Promise<ApiResponse<LoginStep1Mutation>>;
  loginStep2(input: LoginUser2Input): Promise<ApiResponse<LoginStep2Mutation>>;
  logout(): Promise<ApiResponse>;
  logoutAll(): Promise<ApiResponse>;

  refreshToken: () => Promise<ApiResponse<RefreshTokenMutation>>;

  register(
    input: RegisterUserInput
  ): Promise<ApiResponse<RegisterUserMutation>>;
  verifyActivationCode(
    input: VerifyActivationCodeInput
  ): Promise<ApiResponse<VerifyActivationCodeMutation>>;
  resendActivationCode(
    input: ResendActivationCodeInput
  ): Promise<ApiResponse<ResendActivationCodeMutation>>;

  forgotPassword(
    input: ForgotPasswordInput
  ): Promise<ApiResponse<ForgotPasswordMutation>>;
  resetPassword(
    input: ResetPasswordInput
  ): Promise<ApiResponse<ResetPasswordMutation>>;
  changePassword(
    input: ChangePasswordInput
  ): Promise<ApiResponse<ChangePasswordMutation>>;

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
  deleteUsersByAdmin(
    ids: number[]
  ): Promise<ApiResponse<DeleteUsersByAdminMutation>>;
  inviteUser(input: InviteUserInput): Promise<ApiResponse<InviteUserMutation>>;
  cancelInvitation(
    invitationId: number
  ): Promise<ApiResponse<CancelInvitationMutation>>;
  resendInvitation(
    invitationId: number
  ): Promise<ApiResponse<ResendInvitationMutation>>;
  deleteInvitation(
    invitationId: number
  ): Promise<ApiResponse<DeleteInvitationMutation>>;
  deleteInvitations(
    ids: number[]
  ): Promise<ApiResponse<DeleteInvitationsMutation>>;
  verifyInvitationToken(
    token: string
  ): Promise<ApiResponse<VerifyInvitationTokenQuery>>;
  acceptInvitation(
    token: string,
    input: AcceptInvitationInput
  ): Promise<ApiResponse<AcceptInvitationMutation>>;
  promoteToSuperAdminWithMasterKey(
    input: AdminMasterKeyInput
  ): Promise<ApiResponse<PromoteToSuperAdminWithMasterKeyMutation>>;
  changeUserRole(
    input: ChangeRoleInput
  ): Promise<ApiResponse<ChangeUserRoleMutation>>;
  createGuestUserByAdmin(input: {
    name: string;
    phoneNumber: string;
    email?: string;
  }): Promise<ApiResponse<CreateGuestUserByAdminMutation>>;

  clearError: () => void;
  clearAuthCache: () => void;
  checkServiceStatus: () => Promise<boolean>;
}

export const useAuth = (options: UseAuthOptions = {}): UseAuthReturn => {
  const { onAuthStateChange } = options;
  const context = useAuthContext();

  // ── context 액션 함수들을 ref로 유지 → 의존성 배열 무한루프 방지 ────────────
  const setLoadingRef = useRef(context.setLoading);
  setLoadingRef.current = context.setLoading;

  const setErrorRef = useRef(context.setError);
  setErrorRef.current = context.setError;

  const clearErrorRef = useRef(context.clearError);
  clearErrorRef.current = context.clearError;

  const setUserRef = useRef(context.setUser);
  setUserRef.current = context.setUser;

  const setLogoutRef = useRef(context.setLogout);
  setLogoutRef.current = context.setLogout;

  const setInitializedRef = useRef(context.setInitialized);
  setInitializedRef.current = context.setInitialized;

  const isLoadingRef = useRef(context.isLoading);
  isLoadingRef.current = context.isLoading;

  const pendingCriticalOperations = useRef(new Set<string>());

  // ── withLoading: context 대신 ref 사용 → 안정적 참조 보장 ────────────────────
  const withLoading = useCallback(
    async <T>(
      operation: () => Promise<ApiResponse<T>>,
      defaultErrorMessage: string,
      shouldUpdateAuthState = false,
      opts?: { operationId?: string; preventDuplicate?: boolean }
    ): Promise<ApiResponse<T>> => {
      const { operationId, preventDuplicate = false } = opts || {};

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
        if (!isLoadingRef.current) setLoadingRef.current();
        clearErrorRef.current();

        const res = await operation();

        if (!res.success) {
          let errorMsg = defaultErrorMessage;
          if ((res as any).graphQLErrors?.length > 0) {
            errorMsg = (res as any).graphQLErrors[0].message;
          } else if (res.error?.message) {
            errorMsg = res.error.message;
          }
          setErrorRef.current(errorMsg);
        } else if (shouldUpdateAuthState) {
          const service = getAuthService();
          const status = await service.checkAuthStatus();
          if (status.isAuthenticated && status.user) {
            setUserRef.current(status.user);
            onAuthStateChange?.(true);
          } else {
            setLogoutRef.current();
            onAuthStateChange?.(false);
          }
        }

        return res;
      } catch (err) {
        console.error('[withLoading] Operation failed:', err);
        const errorMsg =
          err instanceof Error ? err.message : defaultErrorMessage;
        setErrorRef.current(errorMsg);
        return {
          success: false,
          error: { code: 'OPERATION_FAILED', message: errorMsg },
        } as ApiResponse<T>;
      } finally {
        if (preventDuplicate && operationId) {
          pendingCriticalOperations.current.delete(operationId);
        }
        setInitializedRef.current();
      }
    },
    [onAuthStateChange] // ← context 제거
  );

  // ── checkAuthStatus: context 직접 참조 제거 ──────────────────────────────────
  const checkAuthStatus = useCallback(async () => {
    const service = getAuthService();
    try {
      if (!isLoadingRef.current) setLoadingRef.current();
      clearErrorRef.current();
      const status = await service.checkAuthStatus();
      if (status.isAuthenticated && status.user) {
        setUserRef.current(status.user);
      } else {
        setLogoutRef.current();
      }
      return status;
    } catch (e) {
      console.warn('checkAuthStatus 실패:', e);
      setErrorRef.current('인증 상태를 확인하지 못했습니다.');
      setLogoutRef.current();
      throw e;
    } finally {
      setInitializedRef.current();
    }
  }, []); // ← 의존성 없음

  const getCurrentUser = useCallback(async () => {
    const service = getAuthService();
    const user = await service.getCurrentUser();
    setUserRef.current(user);
    return user;
  }, []); // ← 의존성 없음

  // ── 로그인/로그아웃 ───────────────────────────────────────────────────────────

  const loginStep1 = useCallback(
    (input: LoginUser1Input) =>
      withLoading(
        async () => {
          const service = getAuthService();
          const res = await service.loginStep1(input);
          if (res.success && res.data && !res.data.loginStep1.requires2FA) {
            await new Promise((resolve) => setTimeout(resolve, 300));
            const status = await service.checkAuthStatus();
            if (status.user) setUserRef.current(status.user);
          }
          return res;
        },
        '1단계 로그인에 실패했습니다',
        false,
        { operationId: `login-${input.email}`, preventDuplicate: true }
      ),
    [withLoading]
  );

  const loginStep2 = useCallback(
    (input: LoginUser2Input) =>
      withLoading(
        async () => {
          const service = getAuthService();
          const res = await service.loginStep2(input);
          if (res.success) {
            const status = await service.checkAuthStatus();
            if (status.user) setUserRef.current(status.user);
          }
          return res;
        },
        '2단계 로그인에 실패했습니다',
        true,
        { operationId: 'login-step2', preventDuplicate: true }
      ),
    [withLoading]
  );

  const logout = useCallback(
    () =>
      withLoading(async () => {
        const service = getAuthService();
        const res = await service.logout();
        if (res.success) {
          setLogoutRef.current();
          onAuthStateChange?.(false);
        }
        return res;
      }, '로그아웃에 실패했습니다'),
    [withLoading, onAuthStateChange]
  );

  const logoutAll = useCallback(
    () =>
      withLoading(async () => {
        const service = getAuthService();
        const res = await service.logoutAll();
        if (res.success) {
          setLogoutRef.current();
          onAuthStateChange?.(false);
        }
        return res;
      }, '전체 로그아웃에 실패했습니다'),
    [withLoading, onAuthStateChange]
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

  // ── 회원가입/인증 ─────────────────────────────────────────────────────────────

  const register = useCallback(
    (input: RegisterUserInput) =>
      withLoading(
        () => getAuthService().register(input),
        '회원가입에 실패했습니다',
        false,
        {
          operationId: `register-${input.email}`,
          preventDuplicate: true,
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

  // ── 비밀번호 ──────────────────────────────────────────────────────────────────

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

  // ── 소셜 로그인 ───────────────────────────────────────────────────────────────

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

  // ── 사용자 정보 관리 ──────────────────────────────────────────────────────────

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
          preventDuplicate: true,
        }
      ),
    [withLoading]
  );

  // ── 2FA 관리 ──────────────────────────────────────────────────────────────────

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

  // ── 본인인증 ──────────────────────────────────────────────────────────────────

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

  // ── 관리자 전용 ───────────────────────────────────────────────────────────────

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

  const deleteUsersByAdmin = useCallback(
    (ids: number[]) =>
      withLoading(
        () => getAuthService().deleteUsersByAdmin(ids),
        '사용자 다건 삭제에 실패했습니다'
      ),
    [withLoading]
  );

  const inviteUser = useCallback(
    (input: InviteUserInput) =>
      withLoading(
        () => getAuthService().inviteUser(input),
        '사용자 초대에 실패했습니다'
      ),
    [withLoading]
  );

  const cancelInvitation = useCallback(
    (invitationId: number) =>
      withLoading(
        () => getAuthService().cancelInvitation(invitationId),
        '초대 취소에 실패했습니다'
      ),
    [withLoading]
  );

  const resendInvitation = useCallback(
    (invitationId: number) =>
      withLoading(
        () => getAuthService().resendInvitation(invitationId),
        '초대 재발송에 실패했습니다'
      ),
    [withLoading]
  );

  const deleteInvitation = useCallback(
    (invitationId: number) =>
      withLoading(
        () => getAuthService().deleteInvitation(invitationId),
        '초대 삭제에 실패했습니다'
      ),
    [withLoading]
  );

  const deleteInvitations = useCallback(
    (ids: number[]) =>
      withLoading(
        () => getAuthService().deleteInvitations(ids),
        '초대 다건 삭제에 실패했습니다'
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

  // ── 마스터 키 및 권한 관리 ────────────────────────────────────────────────────

  const promoteToSuperAdminWithMasterKey = useCallback(
    (input: AdminMasterKeyInput) =>
      withLoading(
        () => getAuthService().promoteToSuperAdminWithMasterKey(input),
        'SUPER_ADMIN 승격에 실패했습니다',
        false,
        {
          operationId: `promote-super-admin-${input.userId}`,
          preventDuplicate: true,
        }
      ),
    [withLoading]
  );

  const changeUserRole = useCallback(
    (input: ChangeRoleInput) =>
      withLoading(
        () => getAuthService().changeUserRole(input),
        '권한 변경에 실패했습니다',
        false,
        {
          operationId: `change-role-${input.targetUserId}`,
          preventDuplicate: true,
        }
      ),
    [withLoading]
  );

  const createGuestUserByAdmin = useCallback(
    (input: { name: string; phoneNumber: string; email?: string }) =>
      withLoading(
        () => getAuthService().createGuestUserByAdmin(input),
        '고객 등록에 실패했습니다',
        false,
        {
          operationId: `create-guest-${input.phoneNumber}`,
          preventDuplicate: true,
        }
      ),
    [withLoading]
  );

  // ── 유틸리티 ──────────────────────────────────────────────────────────────────

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
        setUserRef.current(status.user);
      }
      return true;
    } catch {
      return false;
    }
  }, []); // ← 의존성 없음

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
    getAllUsers,
    getUserById,
    getUsersStats,
    getInvitations,
    updateUserByAdmin,
    deleteUserByAdmin,
    deleteUsersByAdmin,
    inviteUser,
    cancelInvitation,
    resendInvitation,
    deleteInvitation,
    deleteInvitations,
    verifyInvitationToken,
    acceptInvitation,
    promoteToSuperAdminWithMasterKey,
    changeUserRole,
    createGuestUserByAdmin,
    clearError: context.clearError,
    clearAuthCache,
    checkServiceStatus,
  };
};

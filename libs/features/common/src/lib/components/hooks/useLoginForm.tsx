import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ApiResponse, useAuth } from '@starcoex-frontend/auth';
import {
  Disable2FaDuringLoginInput,
  LoginStep1Mutation,
} from '@starcoex-frontend/graphql';
import { LoginFormData, loginSchema } from '../../schemas';

type TwoFactorFormData = { code: string };

export interface UseLoginFormOptions {
  redirectTo?: string;
}

export function useLoginForm(options: UseLoginFormOptions = {}) {
  const { redirectTo = '/' } = options;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    isLoading,
    loginStep1,
    loginStep2,
    generateVerificationRequest,
    checkAuthStatus,
    disableTwoFactorDuringLogin,
    requestEmergencyEmailCode,
    error,
    clearError,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [loginResult, setLoginResult] =
    useState<ApiResponse<LoginStep1Mutation> | null>(null);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // 인증 상태 확인 및 콜백 처리
  useEffect(() => {
    const isIdentityCallback = searchParams.get('identity-callback');

    const handleInitialLoad = async () => {
      if (isIdentityCallback === 'true') {
        const code = searchParams.get('code');
        const message = searchParams.get('message');

        if (code === '0') {
          toast.success('본인인증이 완료되었습니다.');
          try {
            await checkAuthStatus();
            navigate(redirectTo);
          } catch (error) {
            console.error('인증 상태 확인 실패:', error);
            toast.error('인증 상태 확인에 실패했습니다.');
          }
        } else {
          toast.error(message || '본인인증에 실패했습니다.');
        }

        const newParams = new URLSearchParams(searchParams);
        newParams.delete('identity-callback');
        newParams.delete('identityVerificationId');
        newParams.delete('code');
        newParams.delete('message');

        const cleanUrl = newParams.toString()
          ? `?${newParams.toString()}`
          : window.location.pathname;
        navigate(cleanUrl, { replace: true });
      } else {
        try {
          const { isAuthenticated } = await checkAuthStatus();
          if (isAuthenticated) {
            navigate(redirectTo);
          }
        } catch (error) {
          console.error('인증 상태 확인 실패:', error);
        }
      }
    };

    handleInitialLoad();
  }, [searchParams, navigate, checkAuthStatus, redirectTo]);

  // 본인인증 시작
  const handleStartVerification = async (redirectPath: string) => {
    clearError();
    await generateVerificationRequest({
      identityVerificationId: crypto.randomUUID(),
      customRedirectPath: redirectPath,
    });
  };

  // 일반 로그인 처리
  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      const result = await loginStep1({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (result.success) {
        if (
          result.data?.loginStep1.requires2FA &&
          result.data.loginStep1.tempToken
        ) {
          setLoginResult(result);
          setShow2FA(true);
          toast.info(
            '2단계 인증이 필요합니다. 인증 앱에서 코드를 확인해주세요.'
          );
        } else {
          toast.success('로그인되었습니다.');
          await checkAuthStatus();
          navigate(redirectTo);
        }
      } else {
        const errorMessage = result.error?.message || '로그인에 실패했습니다.';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('❌ 로그인 실패:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '로그인 중 오류가 발생했습니다.';
      toast.error(errorMessage);
    }
  };

  // 2FA 코드 제출 처리
  const on2FASubmit = async (data: TwoFactorFormData) => {
    if (!loginResult?.data?.loginStep1.tempToken) {
      toast.error('인증 정보가 없습니다. 다시 로그인해주세요.');
      setShow2FA(false);
      setLoginResult(null);
      return;
    }

    try {
      clearError();

      const result = await loginStep2({
        twoFactorCode: data.code,
        tempToken: loginResult.data.loginStep1.tempToken,
      });

      if (result.success) {
        toast.success('2단계 인증이 완료되었습니다.');
        await checkAuthStatus();
        navigate(redirectTo);
      } else {
        const errorMessage = result.message || '2단계 인증에 실패했습니다.';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('❌ 2FA 인증 실패:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '2단계 인증 중 오류가 발생했습니다.';
      toast.error(errorMessage);
    }
  };

  // 2FA 취소
  const handle2FACancel = () => {
    setShow2FA(false);
    setLoginResult(null);
    toast.info('2단계 인증을 취소했습니다.');
  };

  // 긴급 코드 요청
  const handleRequestEmergencyCode = async (tempToken: string) => {
    try {
      const result = await requestEmergencyEmailCode({ tempToken });
      if (result.success) {
        toast.success(result.message || '긴급 인증 코드가 전송되었습니다.');
      } else {
        const errorMessage = result.error?.message || '요청 실패';
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error('긴급 인증 코드 요청 중 오류가 발생했습니다.');
    }
  };

  // 2FA 비활성화
  const handleDisable2FA = async (input: Disable2FaDuringLoginInput) => {
    const result = await disableTwoFactorDuringLogin(input);
    if (result.success) {
      toast.success('2FA가 해제되었습니다.');
      navigate(redirectTo);
    } else {
      throw new Error(result.error?.message || '해제 실패');
    }
  };

  // 사용자 정보 추출
  const getLoginUserInfo = () => {
    const loginEmail = loginForm.getValues('email');
    const tempUserInfo = loginResult?.data;
    const userEmail = tempUserInfo?.loginStep1.user?.email || loginEmail;
    const isSocialLogin = tempUserInfo?.loginStep1.user?.isSocialUser || false;
    return {
      userEmail,
      isSocialLogin,
      tempToken: tempUserInfo?.loginStep1.tempToken,
    };
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return {
    // 폼 관련
    loginForm,
    isLoading,
    error,
    clearError,
    showPassword,
    toggleShowPassword,
    onLoginSubmit: loginForm.handleSubmit(onLoginSubmit),

    // 탭 관련
    activeTab,
    setActiveTab,

    // 2FA 관련
    show2FA,
    loginResult,
    on2FASubmit,
    handle2FACancel,
    handleRequestEmergencyCode,
    handleDisable2FA,
    getLoginUserInfo,

    // 본인인증 관련
    handleStartVerification,
  };
}

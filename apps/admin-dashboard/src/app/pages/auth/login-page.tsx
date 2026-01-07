import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@starcoex-frontend/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Disable2FaDuringLoginInput } from '@starcoex-frontend/graphql';
import { TwoFactorAuthForm } from '@starcoex-frontend/common';

// 회사 정보 상수
const COMPANY_INFO = {
  name: 'Starcoex',
  version: '2.0',
};

const adminLoginSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
  rememberMe: z.boolean(),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;
type TwoFactorFormData = { code: string };

// ✅ location.state 타입 정의
interface LoginLocationState {
  requires2FA?: boolean;
  loginResultData?: any; // loginStep1의 결과 데이터
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ 현재 위치 정보 가져오기

  // ✅ 현재 라우터 상태(state)에서 2FA 정보가 있는지 확인
  // 컴포넌트가 재마운트되어도 location.state는 유지됩니다.
  const locationState = location.state as LoginLocationState;
  const is2FAMode = locationState?.requires2FA === true;
  const loginData = locationState?.loginResultData?.loginStep1;

  const {
    isLoading,
    loginStep1,
    loginStep2,
    requestEmergencyEmailCode,
    disableTwoFactorDuringLogin,
    error,
    clearError,
  } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      clearError();

      // 1단계 로그인 (이메일/비밀번호 검증 + 2FA 필요 여부 확인)
      const result = await loginStep1({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (result.success) {
        // 2FA 필요 시
        if (
          result.data?.loginStep1.requires2FA &&
          result.data.loginStep1.tempToken
        ) {
          toast.info(
            '2단계 인증이 필요합니다. 인증 앱에서 코드를 확인해주세요.'
          );

          // ✅ [핵심] State 대신 Router History State를 사용하여 2FA 모드로 진입
          // 현재 경로로 이동하되 state를 함께 전달합니다.
          navigate(location.pathname, {
            replace: true,
            state: {
              requires2FA: true,
              loginResultData: result.data,
            },
          });
          return;
        }

        // 2FA 불필요: 최종 로그인 완료
        toast.success('관리자 로그인이 완료되었습니다.');
        navigate('/admin', { replace: true });
      } else {
        const errorMessage = result.error?.message || '로그인에 실패했습니다.';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('❌ 관리자 로그인 실패:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '로그인 중 오류가 발생했습니다.';
      toast.error(errorMessage);
    }
  };

  // 2FA 코드 제출 핸들러
  const on2FASubmit = async (data: TwoFactorFormData) => {
    // Router State에서 토큰 확인
    const tempToken = loginData?.tempToken;

    if (!tempToken) {
      toast.error('인증 정보가 만료되었습니다. 다시 로그인해주세요.');
      // 상태 초기화 (state 없이 이동)
      navigate(location.pathname, { replace: true, state: {} });
      return;
    }

    try {
      clearError();
      const result = await loginStep2({
        twoFactorCode: data.code,
        tempToken: tempToken,
      });

      if (result.success) {
        toast.success('2단계 인증 성공! 관리자 로그인이 완료되었습니다.');
        navigate('/admin', { replace: true });
      } else {
        // ✅ [해결 1] 실패 시 navigate를 호출하지 않음 -> 화면 유지됨
        const errorMessage =
          result.message || '2단계 인증 코드가 올바르지 않습니다.';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('❌ 2FA 인증 실패:', error);
      // ✅ [해결 1] 에러 발생 시에도 navigate 호출 안 함 -> 화면 유지됨
      toast.error('2단계 인증 처리 중 오류가 발생했습니다.');
    }
  };

  // 2FA 취소 핸들러
  const on2FACancel = () => {
    toast.info('로그인이 취소되었습니다.');
    // 2FA 모드 해제 (빈 state로 이동)
    navigate(location.pathname, { replace: true, state: {} });
  };

  // 긴급 코드 요청 핸들러
  const handleRequestEmergencyCode = async (tempToken: string) => {
    try {
      const result = await requestEmergencyEmailCode({ tempToken });
      if (result.success) {
        toast.success(
          result.message || '긴급 인증 코드가 이메일로 전송되었습니다.'
        );
      } else {
        const errorMessage = result.error?.message || '긴급 코드 요청 실패';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('긴급 코드 요청 오류:', error);
      toast.error('요청 중 오류가 발생했습니다.');
    }
  };

  // 사용자 정보 추출 헬퍼
  const getLoginUserInfo = () => {
    // 폼 입력값 또는 라우터 state에 저장된 값 사용
    const loginEmail = form.getValues('email');
    const userEmail = loginData?.user?.email || loginEmail;
    const isSocialLogin = loginData?.user?.isSocialUser || false;

    return { userEmail, isSocialLogin, tempToken: loginData?.tempToken };
  };

  return (
    <>
      <Helmet>
        <title>관리자 로그인 - Starcoex Admin</title>
        <meta name="description" content="Starcoex 통합 관리 시스템 로그인" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* 에러 표시 */}
      {error && (
        <div className="mb-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="h-auto p-1 hover:bg-transparent"
              >
                ✕
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <Card className="p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">로그인</CardTitle>
          <CardDescription>
            {COMPANY_INFO.name} 통합 관리 시스템에 로그인하세요
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* ✅ [해결 2] is2FAMode 여부를 Router State로 판단 */}
          {is2FAMode && loginData ? ( // 2FA 인증 폼
            <TwoFactorAuthForm
              isLoading={isLoading}
              onSubmit={on2FASubmit}
              onCancel={on2FACancel}
              tempToken={getLoginUserInfo().tempToken || undefined}
              userEmail={getLoginUserInfo().userEmail}
              isSocialLogin={getLoginUserInfo().isSocialLogin}
              hasPassword={true} // 관리자 로그인은 비밀번호 기반이므로 true
              onRequestEmergencyCode={async (tempToken: string) => {
                await handleRequestEmergencyCode(tempToken);
              }}
              onDisable2FA={async (input: Disable2FaDuringLoginInput) => {
                // 관리자 권한으로 2FA 해제 시도
                const result = await disableTwoFactorDuringLogin(input);
                if (result.success) {
                  toast.success('2FA가 해제되었습니다.');
                  navigate('/admin', { replace: true });
                } else {
                  throw new Error(result.error?.message || '해제 실패');
                }
              }}
            />
          ) : (
            // 기본 로그인 폼
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <fieldset disabled={isLoading} className="space-y-2">
                  {/* 이메일 */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이메일</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="admin@starcoex.com"
                            autoComplete="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 비밀번호 */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>비밀번호</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? 'text' : 'password'}
                              placeholder="비밀번호"
                              autoComplete="current-password"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 나를 기억해줘 체크박스 */}
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>로그인 상태 유지</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 비밀번호 찾기 */}
                  <div className="flex justify-between text-sm">
                    <Link
                      to="/auth/forgot-password"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      비밀번호를 잊으셨나요?
                    </Link>
                  </div>

                  {/* 로그인 버튼 */}
                  <Button
                    type="submit"
                    variant="default"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? '로그인 중...' : '로그인'}
                  </Button>
                </fieldset>
              </form>
            </Form>
          )}
        </CardContent>
        {!is2FAMode && (
          <CardFooter className="justify-center">
            <div className="text-sm text-muted-foreground">
              새로운 관리자 계정이 필요하신가요?{' '}
              <Link
                to="/auth/register"
                className="text-primary hover:underline font-medium"
              >
                계정 생성 요청
              </Link>
            </div>
          </CardFooter>
        )}
      </Card>
    </>
  );
}

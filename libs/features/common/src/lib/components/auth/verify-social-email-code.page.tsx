import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Mail, Loader2, RefreshCw } from 'lucide-react';
import { SocialProvider } from '@starcoex-frontend/graphql';
import { useAuth } from '@starcoex-frontend/auth';
import { toast } from 'sonner';
import { useAppConfig } from '../../context';
import { PageHead } from '../../seo';
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  SmartTimer,
  Checkbox,
} from '../ui';
import { StarLogo } from '../logo';

const verificationSchema = z.object({
  verificationCode: z.string().trim().min(1, '인증 코드를 입력해주세요'),
  marketingConsent: z.boolean(),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

export const VerifySocialEmailCodePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    verifySocialEmail,
    resendSocialActivationCode,
    isLoading,
    error,
    clearError,
  } = useAuth();
  const { getSeoTitle, siteName, routes, PageWrapper, styles } = useAppConfig();

  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [timerKey, setTimerKey] = useState(0);
  const totalDuration = 15 * 60 * 1000;
  const [timeLeft, setTimeLeft] = useState<number>(totalDuration);

  const { provider, email } = location.state || {};

  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      verificationCode: '',
      marketingConsent: false,
    },
  });

  useEffect(() => {
    if (!provider || !email) {
      toast.error('인증 정보가 없습니다. 다시 소셜 로그인을 시도해주세요.');
      navigate(routes.login, { replace: true });
      return;
    }
  }, [provider, email, navigate, routes.login]);

  useEffect(() => {
    const storedStartTime = localStorage.getItem('socialVerificationStartTime');
    let startTime = storedStartTime
      ? parseInt(storedStartTime, 10)
      : Date.now();
    const elapsedTime = Date.now() - startTime;

    if (elapsedTime > totalDuration) {
      localStorage.removeItem('socialVerificationStartTime');
      startTime = Date.now();
      localStorage.setItem('socialVerificationStartTime', String(startTime));
      setTimeLeft(totalDuration);
    } else {
      setTimeLeft(totalDuration - elapsedTime);
    }

    if (!storedStartTime) {
      localStorage.setItem('socialVerificationStartTime', String(startTime));
    }

    const interval = setInterval(() => {
      const currentElapsed = Date.now() - startTime;
      const remainingTime = totalDuration - currentElapsed;

      if (remainingTime <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
        localStorage.removeItem('socialVerificationStartTime');
      } else {
        setTimeLeft(remainingTime);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [totalDuration, timerKey]);

  const onSubmit = async (data: VerificationFormData) => {
    try {
      clearError();
      const result = await verifySocialEmail({
        provider: provider.toUpperCase() as SocialProvider,
        verificationCode: data.verificationCode,
        marketingConsent: data.marketingConsent ?? false,
      });

      if (result.success) {
        localStorage.removeItem('socialVerificationStartTime');
        toast.success('소셜 로그인이 완료되었습니다!');
        setTimeout(() => {
          navigate(routes.home, { replace: true });
        }, 100);
      } else {
        const errorMessage = result.message || '인증 코드가 올바르지 않습니다.';
        toast.error(errorMessage);
        form.setError('verificationCode', { message: errorMessage });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '오류 발생';
      toast.error(errorMessage);
      form.setError('verificationCode', { message: errorMessage });
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    try {
      clearError();
      setIsResending(true);
      setResendMessage(null);
      const result = await resendSocialActivationCode({
        provider: provider.toUpperCase() as SocialProvider,
        providerEmail: email,
      });

      if (result.success) {
        const newStartTime = Date.now();
        localStorage.setItem(
          'socialVerificationStartTime',
          String(newStartTime)
        );
        setTimeLeft(totalDuration);
        setTimerKey((prev) => prev + 1);

        const message = result.message || '인증 코드가 재전송되었습니다.';
        setResendMessage(`${message} 이메일을 확인해주세요.`);
        toast.success(message);
      } else {
        toast.error('재발송 실패');
      }
    } catch (error) {
      toast.error('재발송 중 오류가 발생했습니다.');
    } finally {
      setIsResending(false);
    }
  };

  const Wrapper = PageWrapper || React.Fragment;

  if (!provider || !email) {
    return null;
  }

  const content = (
    <>
      <PageHead
        title={getSeoTitle('이메일 인증')}
        description="인증 코드를 입력하여 회원가입을 완료하세요."
        siteName={siteName}
        robots="noindex, nofollow"
      />

      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <Link
            to={routes.home}
            className="inline-flex items-center justify-center gap-3 mb-4"
          >
            <StarLogo width={48} height={48} />
          </Link>
          <CardTitle className="text-xl font-semibold mb-2">
            {provider} 이메일 인증
          </CardTitle>
          <CardDescription>
            인증 코드를 입력하여 회원가입을 완료하세요
          </CardDescription>
        </div>

        <Card className={styles?.card}>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              이메일 인증 코드 입력
            </CardTitle>
            <CardDescription className="mt-2">
              <strong>{email}</strong>으로 발송된 인증 코드를 입력해주세요.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {timeLeft > 0 && (
              <SmartTimer
                timeLeft={timeLeft}
                urgentThreshold={300000}
                criticalThreshold={60000}
              />
            )}

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription className="flex items-center justify-between">
                  <span>{error}</span>
                  <Button variant="ghost" size="sm" onClick={clearError}>
                    ✕
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 pt-4"
              >
                <fieldset
                  disabled={isLoading || timeLeft <= 0}
                  className="space-y-2"
                >
                  <FormField
                    control={form.control}
                    name="verificationCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>인증 코드 *</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="6자리 인증 코드를 입력해주세요"
                            maxLength={6}
                            autoFocus
                            className={styles?.input}
                            {...field}
                            onInput={(e) => {
                              const target = e.target as HTMLInputElement;
                              target.value = target.value.replace(
                                /[^0-9]/g,
                                ''
                              );
                              field.onChange(target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="marketingConsent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            마케팅 정보 수신에 동의합니다 (선택)
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className={`w-full ${styles?.primaryButton || ''}`}
                    disabled={isLoading || timeLeft <= 0}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        인증 처리 중...
                      </>
                    ) : (
                      '인증 완료하기'
                    )}
                  </Button>
                </fieldset>

                {resendMessage && (
                  <Alert>
                    <AlertDescription>{resendMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendCode}
                    disabled={isResending}
                    className="w-full"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        재발송 중...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        코드 다시 요청하기
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate(routes.login, { replace: true })}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    로그인 페이지로 돌아가기
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );

  return <Wrapper>{content}</Wrapper>;
};

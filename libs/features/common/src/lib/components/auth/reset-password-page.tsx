import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import {
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  KeyRound,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@starcoex-frontend/auth';
import { useAppConfig } from '../../context';
import { PageHead } from '../../seo';
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '../ui';

const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        '비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다'
      ),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

export const ResetPasswordPage: React.FC = () => {
  const { isLoading, resetPassword, error, clearError } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getSeoTitle, siteName, routes, PageWrapper, styles } = useAppConfig();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const token = searchParams.get('token');

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!token) {
      toast.error(
        '유효하지 않은 링크입니다. 비밀번호 초기화를 다시 요청해주세요.'
      );
    }
  }, [token]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('토큰이 없습니다. 비밀번호 초기화를 다시 요청해주세요.');
      return;
    }

    try {
      clearError();

      const response = await resetPassword({
        newPassword: data.password,
        resetToken: token,
      });

      if (response?.success) {
        setIsSuccess(true);
        toast.success('비밀번호가 성공적으로 변경되었습니다.');
        setTimeout(() => {
          navigate(routes.login);
        }, 3000);
      } else {
        toast.error(response.error?.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 비밀번호 재설정 실패:', error);
      toast.error('비밀번호 재설정 중 오류가 발생했습니다.');
    }
  };

  const Wrapper = PageWrapper || React.Fragment;

  const content = (
    <>
      <PageHead
        title={getSeoTitle('비밀번호 재설정')}
        description="새로운 비밀번호를 설정하세요."
        siteName={siteName}
        robots="noindex, nofollow"
      />

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

      <Card className={`p-6 ${styles?.card || ''}`}>
        {isSuccess ? (
          <>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                비밀번호 변경 완료
              </CardTitle>
              <CardDescription>
                비밀번호가 성공적으로 변경되었습니다.
                <br />
                잠시 후 로그인 페이지로 이동합니다.
              </CardDescription>
            </CardHeader>

            <CardFooter>
              <Link to={routes.login} className="w-full">
                <Button className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  로그인 페이지로 이동
                </Button>
              </Link>
            </CardFooter>
          </>
        ) : !token ? (
          <>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                유효하지 않은 링크
              </CardTitle>
              <CardDescription>
                비밀번호 초기화 링크가 만료되었거나 유효하지 않습니다.
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex-col gap-3">
              <Link to={routes.forgotPassword} className="w-full">
                <Button variant="outline" className="w-full">
                  비밀번호 초기화 다시 요청
                </Button>
              </Link>
              <Link to={routes.login} className="w-full">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  로그인 페이지로 돌아가기
                </Button>
              </Link>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader className="mb-2 flex flex-col space-y-2 text-left">
              <CardTitle className="text-md font-semibold tracking-tight flex items-center gap-2">
                <KeyRound className="h-5 w-5" />새 비밀번호 설정
              </CardTitle>
              <CardDescription>
                안전한 새 비밀번호를 입력해주세요.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4"
                >
                  <fieldset disabled={isLoading} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>새 비밀번호</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="새 비밀번호 입력"
                                autoComplete="new-password"
                                className={styles?.input}
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

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>비밀번호 확인</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="비밀번호 다시 입력"
                                autoComplete="new-password"
                                className={styles?.input}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                {showConfirmPassword ? (
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

                    <Alert className="border-blue-200 bg-blue-50">
                      <AlertDescription className="text-xs text-blue-700">
                        비밀번호는 8자 이상, 대문자, 소문자, 숫자, 특수문자를
                        포함해야 합니다.
                      </AlertDescription>
                    </Alert>

                    <Button
                      type="submit"
                      className={`w-full ${styles?.primaryButton || ''}`}
                      disabled={isLoading}
                    >
                      {isLoading ? '변경 중...' : '비밀번호 변경'}
                    </Button>
                  </fieldset>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="text-center">
              <Link
                to={routes.login}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4 inline mr-1" />
                로그인 페이지로 돌아가기
              </Link>
            </CardFooter>
          </>
        )}
      </Card>
    </>
  );

  return <Wrapper>{content}</Wrapper>;
};

export default ResetPasswordPage;

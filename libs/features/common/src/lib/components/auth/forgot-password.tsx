// libs/features/common/src/pages/forgot-password.tsx
import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Link, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { Mail, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@starcoex-frontend/auth';
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
import { useAppConfig } from '../../context';
import { PageHead } from '../../seo';

const ForgotPasswordSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
});

type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const { isLoading, forgotPassword, error, clearError } = useAuth();
  const [searchParams] = useSearchParams();
  const { getSeoTitle, siteName, routes, PageWrapper, styles } = useAppConfig();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    try {
      clearError();
      const redirectUrl = window.location.origin;

      const response = await forgotPassword({
        email: data.email,
        redirectUrl,
      });

      if (response?.success) {
        toast.success(
          '비밀번호 초기화 이메일을 발송했습니다. 이메일을 확인해주세요.'
        );
        form.reset();
      } else {
        toast.error(response.error?.message);
      }
    } catch (error) {
      console.error('❌ 비밀번호 초기화 요청 실패:', error);
      toast.error('비밀번호 초기화 요청 중 오류가 발생했습니다.');
    }
  };

  const Wrapper = PageWrapper || React.Fragment;

  const content = (
    <>
      <PageHead
        title={getSeoTitle('비밀번호 초기화')}
        description="비밀번호를 잊으셨나요? 이메일 주소를 입력하여 비밀번호 초기화 링크를 받으세요."
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
        {form.formState.isSubmitSuccessful ? (
          <>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5" />
                이메일을 발송했습니다
              </CardTitle>
              <CardDescription className="text-center text-xs leading-6 truncate">
                <strong>{form.getValues('email')}</strong>로 비밀번호 초기화
                링크를 보냈습니다.
                <br />
                이메일을 확인하고 안내에 따라 새로운 비밀번호를 설정해주세요.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Alert className="border-blue-200 bg-blue-50">
                <Mail className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-xs text-blue-700 leading-6">
                  • 이메일이 오지 않으면 스팸 폴더를 확인해주세요
                  <br />
                  • 링크는 15분 동안 유효합니다
                  <br />• 이메일을 받지 못했다면 다시 요청해주세요
                </AlertDescription>
              </Alert>
            </CardContent>

            <CardFooter className="flex-col gap-3">
              <Button
                onClick={() => {
                  form.reset();
                  clearError();
                }}
                variant="outline"
                className="w-full"
              >
                다시 요청하기
              </Button>

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
              <CardTitle className="text-md font-semibold tracking-tight">
                비밀번호 초기화
              </CardTitle>
              <CardDescription>
                등록된 이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4"
                >
                  <fieldset disabled={isLoading}>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이메일 주소</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="example@email.com"
                              autoComplete="email"
                              autoFocus
                              className={styles?.input}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-3 pt-4">
                      <Button
                        type="submit"
                        className={`w-full ${styles?.primaryButton || ''}`}
                        disabled={isLoading}
                      >
                        {isLoading
                          ? '발송 중...'
                          : '🚀 비밀번호 초기화 이메일 발송'}
                      </Button>
                    </div>
                  </fieldset>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="flex-col gap-2 text-center">
              <div className="text-sm text-muted-foreground">
                비밀번호가 기억나셨나요?{' '}
                <Link
                  to={routes.login}
                  className="font-medium text-primary hover:text-primary/80 underline transition-colors"
                >
                  로그인하기
                </Link>
              </div>
              <div className="text-sm text-muted-foreground">
                계정이 없으신가요?{' '}
                <Link
                  to={routes.register}
                  className="font-medium text-primary hover:text-primary/80 underline transition-colors"
                >
                  계정 생성 요청
                </Link>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </>
  );

  return <Wrapper>{content}</Wrapper>;
};

export default ForgotPasswordPage;

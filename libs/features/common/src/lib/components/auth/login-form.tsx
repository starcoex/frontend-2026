// libs/features/common/src/components/auth/login-form.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useLoginForm, UseLoginFormOptions } from '../hooks';
import {
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
  Checkbox,
} from '../ui';

export interface LoginFormProps extends UseLoginFormOptions {
  forgotPasswordPath?: string;
  registerPath?: string;
  withCard?: boolean;
  showRegisterLink?: boolean;
  className?: string;
  /** 카드 커스텀 클래스 */
  cardClassName?: string;
  /** 인풋 커스텀 클래스 */
  inputClassName?: string;
  /** 버튼 커스텀 클래스 */
  buttonClassName?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  redirectTo = '/',
  forgotPasswordPath = '/auth/forgot-password',
  registerPath = '/auth/register',
  withCard = true,
  showRegisterLink = true,
  className = '',
}) => {
  const { loginForm, showPassword, toggleShowPassword, onLoginSubmit } =
    useLoginForm({ redirectTo });

  // 폼의 실제 제출 상태만 사용
  const isSubmitting = loginForm.formState.isSubmitting;

  const formContent = (
    <Form {...loginForm}>
      <form onSubmit={onLoginSubmit} className="space-y-4">
        <fieldset disabled={isSubmitting} className="space-y-4">
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="example@starcoex.com"
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="비밀번호 입력"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={toggleShowPassword}
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

          <div className="flex items-center justify-between">
            <FormField
              control={loginForm.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      className="dark:bg-white"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    로그인 유지
                  </FormLabel>
                </FormItem>
              )}
            />
            <Link
              to={forgotPasswordPath}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              비밀번호 찾기
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? '로그인 중...' : '로그인'}
          </Button>
        </fieldset>
      </form>
    </Form>
  );

  if (!withCard) {
    return <div className={className}>{formContent}</div>;
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>이메일 로그인</CardTitle>
          <CardDescription>
            등록된 이메일과 비밀번호로 로그인하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">{formContent}</CardContent>
      </Card>

      {showRegisterLink && (
        <div className="text-center mt-4">
          <CardDescription>
            아직 계정이 없으신가요?{' '}
            <Link
              to={registerPath}
              className="text-primary font-medium hover:underline"
            >
              회원가입
            </Link>
          </CardDescription>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useRegisterForm, UseRegisterFormOptions } from '../hooks';
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

export interface RegisterFormProps extends UseRegisterFormOptions {
  /** 이용약관 경로 */
  termsPath?: string;
  /** 개인정보 처리방침 경로 */
  privacyPath?: string;
  /** 로그인 경로 */
  loginPath?: string;
  /** 카드 래퍼 사용 여부 */
  withCard?: boolean;
  /** 로그인 링크 표시 여부 */
  showLoginLink?: boolean;
  /** 커스텀 클래스 */
  className?: string;
  /** 카드 커스텀 클래스 */
  cardClassName?: string;
  /** 인풋 커스텀 클래스 */
  inputClassName?: string;
  /** 버튼 커스텀 클래스 */
  buttonClassName?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  redirectTo = '/auth/register',
  verifyEmailPath = '/auth/verify-email',
  termsPath = '#',
  privacyPath = '#',
  loginPath = '/auth/login',
  withCard = true,
  showLoginLink = true,
  className = '',
}) => {
  const {
    form,
    isLoading,
    showPassword,
    showConfirmPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
    onSubmit,
  } = useRegisterForm({ redirectTo, verifyEmailPath });

  // 폼의 실제 제출 상태만 사용
  const isSubmitting = form.formState.isSubmitting;

  const formContent = (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <fieldset disabled={isLoading || form.formState.isSubmitting}>
          {/* 이메일 */}
          <div className="space-y-2 pt-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="example@starcoex.com"
                      type="email"
                      autoComplete="email"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 비밀번호 */}
          <div className="space-y-2 pt-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1 relative">
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        placeholder="6자 이상, 영문+숫자 조합"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
                        onClick={toggleShowPassword}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="mt-4 mb-4" />
                </FormItem>
              )}
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="space-y-2 pt-3">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-1 relative">
                  <FormLabel>비밀번호 확인</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
                        onClick={toggleShowConfirmPassword}
                        disabled={isLoading}
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
          </div>

          {/* 약관 동의 */}
          <div className="space-y-3 pt-4">
            <FormField
              control={form.control}
              name="agreeTerms"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-4 w-4 mt-1"
                      />
                    </FormControl>
                    <FormLabel className="text-sm leading-relaxed">
                      <Link
                        to={termsPath}
                        className="text-primary underline hover:text-primary/80"
                      >
                        이용약관
                      </Link>
                      에 동의합니다 (필수)
                    </FormLabel>
                  </div>
                  <FormMessage className="!mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agreePrivacy"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-4 w-4 mt-1"
                      />
                    </FormControl>
                    <FormLabel className="text-sm leading-relaxed">
                      <Link
                        to={privacyPath}
                        className="text-primary underline hover:text-primary/80"
                      >
                        개인정보 처리방침
                      </Link>
                      에 동의합니다 (필수)
                    </FormLabel>
                  </div>
                  <FormMessage className="!mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agreeMarketing"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-4 w-4 mt-1"
                      />
                    </FormControl>
                    <FormLabel className="text-sm leading-relaxed text-muted-foreground">
                      마케팅 정보 수신에 동의합니다 (선택)
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* 제출 버튼 */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              {isSubmitting ? '가입 처리중...' : '회원가입 완료'}
            </Button>
          </div>
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
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl flex items-center justify-center gap-2">
            <Mail className="h-5 w-5 text-muted-foreground" />
            이메일 회원가입
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            안전한 계정 생성을 위해 정보를 입력해주세요
          </p>
        </CardHeader>
        <CardContent>{formContent}</CardContent>
      </Card>

      {showLoginLink && (
        <div className="text-center mt-6">
          <CardDescription>
            이미 계정이 있으신가요?{' '}
            <Link
              to={loginPath}
              className="text-primary underline font-medium hover:text-primary/80 transition-colors"
            >
              로그인하기 →
            </Link>
          </CardDescription>
        </div>
      )}
    </div>
  );
};

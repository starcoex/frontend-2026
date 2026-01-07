import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import {
  useRegisterForm,
  RegisterForm,
  StarLogo,
} from '@starcoex-frontend/common';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CardDescription, CardHeader } from '@/components/ui/card';

export function PersonalRegisterPage() {
  const { error, clearError, handleBackToRegister } = useRegisterForm({
    redirectTo: '/auth/register',
    verifyEmailPath: '/auth/verify-email',
  });

  return (
    <>
      <Helmet>
        <title>스타코엑스 회원가입</title>
      </Helmet>

      <div className="text-center mb-6">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-3 mb-4"
        >
          <StarLogo format="png" width={20} height={20} className="w-12 h-12" />
        </Link>
        <CardHeader className="text-xl font-semibold mb-2">
          스타코엑스 회원가입
        </CardHeader>
        <CardDescription>
          계정 정보를 입력하여 가입을 완료하세요
        </CardDescription>
      </div>

      <div className="space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToRegister}
          className="p-0 h-auto text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          소셜 로그인으로 돌아가기
        </Button>

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

        <RegisterForm
          redirectTo="/auth/register"
          verifyEmailPath="/auth/verify-email"
        />
      </div>
    </>
  );
}

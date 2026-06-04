import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import {
  StarLogo,
  IdentityVerificationButton,
  IdentityRegisterForm,
} from '@starcoex-frontend/common';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type PageStep = 'verify' | 'form';

export function IdentityRegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<PageStep>('verify');
  const [identityVerificationId, setIdentityVerificationId] = useState<
    string | null
  >(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const handleVerified = (ivId: string) => {
    setIdentityVerificationId(ivId);
    setVerifyError(null);
    setStep('form');
  };

  const handleVerifyError = (error: string) => {
    setVerifyError(error);
  };

  const handleRegisterSuccess = () => {
    navigate('/auth/verify-email');
  };

  return (
    <>
      <Helmet>
        <title>본인인증 회원가입 - 스타코엑스</title>
      </Helmet>

      <div className="text-center mb-6">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-3 mb-4"
        >
          <StarLogo format="svg" width={20} height={20} className="w-12 h-12" />
        </Link>
        <h1 className="text-xl font-semibold mb-2">본인인증 회원가입</h1>
        <p className="text-sm text-muted-foreground">
          {step === 'verify'
            ? '휴대폰 본인인증 후 가입을 완료하세요'
            : '인증이 완료되었습니다. 추가 정보를 입력해주세요'}
        </p>
      </div>

      {/* 단계 표시 */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div
          className={`flex items-center gap-1.5 text-sm font-medium ${
            step === 'verify' ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          {step === 'form' ? (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>
          )}
          본인인증
        </div>
        <div className="w-8 h-px bg-border" />
        <div
          className={`flex items-center gap-1.5 text-sm font-medium ${
            step === 'form' ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              step === 'form' ? 'border-primary' : 'border-muted-foreground'
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                step === 'form' ? 'bg-primary' : 'bg-muted-foreground'
              }`}
            />
          </div>
          정보 입력
        </div>
      </div>

      {/* 뒤로가기 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          step === 'form' ? setStep('verify') : navigate('/auth/register')
        }
        className="p-0 h-auto text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {step === 'form'
          ? '본인인증으로 돌아가기'
          : '가입 방법 선택으로 돌아가기'}
      </Button>

      {/* 에러 */}
      {verifyError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription className="flex items-center justify-between">
            <span>{verifyError}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVerifyError(null)}
            >
              ✕
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Step 1: 본인인증 */}
      {step === 'verify' && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              본인인증
            </CardTitle>
            <CardDescription>
              휴대폰 본인인증으로 안전하게 가입하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <IdentityVerificationButton
              onVerified={handleVerified}
              onError={handleVerifyError}
              className="w-full h-14"
            />
            <p className="text-xs text-muted-foreground text-center">
              본인인증은 다날 통신사 인증을 통해 진행됩니다
            </p>
          </CardContent>
        </Card>
      )}

      {/* Step 2: 정보 입력 폼 */}
      {step === 'form' && identityVerificationId && (
        <IdentityRegisterForm
          identityVerificationId={identityVerificationId}
          onSuccess={handleRegisterSuccess}
        />
      )}
    </>
  );
}

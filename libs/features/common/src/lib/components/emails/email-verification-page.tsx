import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppConfig } from '../../context';
import { PageHead } from '../../seo';
import { Alert, AlertDescription, Button } from '../ui';
import {
  EmailVerificationForm,
  EmailVerificationCallbacks,
  EmailVerificationState,
} from './components';

export interface EmailVerificationPageProps {
  callbacks: EmailVerificationCallbacks;
  state: EmailVerificationState;
  pageTitle?: string;
  pageDescription?: string;
  redirectToOnMissingEmail?: string;
  redirectToOnSuccess?: string;
  missingEmailMessage?: string;
  className?: string;
}

export function EmailVerificationPage({
  callbacks,
  state,
  pageTitle = '이메일 인증',
  pageDescription = '이메일 인증을 완료하세요',
  redirectToOnMissingEmail,
  redirectToOnSuccess,
  missingEmailMessage = '인증 정보가 없습니다. 다시 회원가입을 진행해주세요.',
  className,
}: EmailVerificationPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { getSeoTitle, siteName, routes, PageWrapper, styles } = useAppConfig();

  // routes에서 기본값 사용 (props로 오버라이드 가능)
  const missingEmailRedirect = redirectToOnMissingEmail || routes.register;
  const successRedirect = redirectToOnSuccess || routes.login;

  const locationState = location.state || {};
  const { email } = locationState;

  // 필수 데이터가 없으면 리다이렉트
  useEffect(() => {
    if (!email) {
      toast.error(missingEmailMessage);
      navigate(missingEmailRedirect);
      return;
    }
  }, [email, navigate, missingEmailRedirect, missingEmailMessage]);

  // 성공 시 리다이렉트 처리
  const handleSuccess = (data: { email: string; code: string }) => {
    callbacks.onSuccess?.(data);
    setTimeout(() => {
      navigate(successRedirect);
    }, 100);
  };

  const Wrapper = PageWrapper || React.Fragment;

  // 데이터가 없으면 에러 상태 표시
  if (!email) {
    return (
      <Wrapper>
        <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-xs text-center">
            <Alert variant="destructive">
              <AlertDescription>
                잘못된 접근입니다. 다시 회원가입을 시도해주세요.
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => navigate(missingEmailRedirect, { replace: true })}
              className={`mt-4 ${styles?.primaryButton || ''}`}
            >
              회원가입 페이지로 돌아가기
            </Button>
          </div>
        </div>
      </Wrapper>
    );
  }

  const content = (
    <>
      <PageHead
        title={getSeoTitle(pageTitle)}
        description={pageDescription}
        siteName={siteName}
        robots="noindex, nofollow"
      />

      <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-xs">
          <h1 className="sr-only">Enter one-time password</h1>
          <EmailVerificationForm
            config={{ email }}
            callbacks={{
              ...callbacks,
              onSuccess: handleSuccess,
            }}
            state={state}
            className={className}
            styles={styles}
          />
        </div>
      </div>
    </>
  );

  return <Wrapper>{content}</Wrapper>;
}

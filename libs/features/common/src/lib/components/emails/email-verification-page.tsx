import React, { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams(); // ✅ 추가
  const { getSeoTitle, siteName, routes, PageWrapper, styles } = useAppConfig();

  // routes에서 기본값 사용 (props로 오버라이드 가능)
  const missingEmailRedirect = redirectToOnMissingEmail || routes.register;
  const successRedirect = redirectToOnSuccess || routes.login;

  // ✅ URL query parameter에서 code와 email 가져오기
  const codeFromQuery = searchParams.get('code');
  const emailFromQuery = searchParams.get('email');

  const locationState = location.state || {};
  const { email: emailFromState, fromInvitation } = locationState;

  // ✅ state 또는 query parameter에서 email 가져오기
  const email = emailFromState || emailFromQuery || '';

  // ✅ code가 URL에 있으면 자동 인증 중임을 표시
  const isAutoVerifying = Boolean(codeFromQuery && email);

  // 필수 데이터가 없으면 리다이렉트
  useEffect(() => {
    // ✅ 자동 인증 중이면 리다이렉트하지 않음
    if (!email && !isAutoVerifying) {
      toast.error(missingEmailMessage);
      navigate(missingEmailRedirect);
      return;
    }
  }, [
    email,
    isAutoVerifying,
    navigate,
    missingEmailRedirect,
    missingEmailMessage,
  ]);

  // 성공 시 리다이렉트 처리
  const handleSuccess = (data: { email: string; code: string }) => {
    callbacks.onSuccess?.(data);

    const targetRoute = fromInvitation ? '/admin' : successRedirect;

    if (fromInvitation) {
      toast.success('초대를 통한 회원가입이 완료되었습니다!');
    } else if (isAutoVerifying) {
      toast.success(
        '이메일 인증이 완료되었습니다! 로그인 페이지로 이동합니다.'
      );
    }

    setTimeout(() => {
      navigate(targetRoute, { replace: true });
    }, 1000);
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

          {/* ✅ 자동 인증 중일 때 로딩 표시 */}
          {isAutoVerifying && state.isLoading && (
            <Alert className="mb-4">
              <AlertDescription className="text-center">
                이메일 인증을 진행하고 있습니다...
              </AlertDescription>
            </Alert>
          )}

          {/* ✅ 초대 알림 추가 */}
          {fromInvitation && !isAutoVerifying && (
            <Alert className="mb-4">
              <AlertDescription>
                초대를 통한 회원가입입니다. 인증 완료 후 바로 로그인됩니다.
              </AlertDescription>
            </Alert>
          )}

          <EmailVerificationForm
            config={{ email }}
            callbacks={{
              ...callbacks,
              onSuccess: handleSuccess,
            }}
            state={state}
            className={className}
            styles={styles}
            initialCode={codeFromQuery || undefined} // ✅ URL의 code를 초기값으로 전달
          />
        </div>
      </div>
    </>
  );

  return <Wrapper>{content}</Wrapper>;
}

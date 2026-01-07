import { useAuth } from '@starcoex-frontend/auth';
import { EmailVerificationPage } from '@starcoex-frontend/common';

const AdminVerifyEmailPage = () => {
  const {
    verifyActivationCode,
    resendActivationCode,
    isLoading,
    error,
    clearError,
  } = useAuth();

  return (
    <EmailVerificationPage
      callbacks={{
        onVerifyCode: async ({ code }) => {
          return await verifyActivationCode({ activationCode: code });
        },
        onResendCode: async ({ email }) => {
          return await resendActivationCode({ email });
        },
      }}
      state={{
        isLoading,
        error: error === null ? undefined : error,
        clearError,
      }}
      pageTitle="관리자 이메일 인증"
      pageDescription="관리자 계정 이메일 인증을 완료하세요"
      redirectToOnSuccess="/auth/login"
    />
  );
};

export default AdminVerifyEmailPage;

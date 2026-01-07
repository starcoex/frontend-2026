import React from 'react';
import { useAuth } from '@starcoex-frontend/auth';
import { useAppConfig } from '../../context';
import { EmailVerificationPage } from './email-verification-page';

export const VerifyEmailPage: React.FC = () => {
  const {
    verifyActivationCode,
    resendActivationCode,
    isLoading,
    error,
    clearError,
  } = useAuth();
  const { appName, routes } = useAppConfig();

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
      pageTitle="이메일 인증"
      pageDescription={`${appName} 계정 이메일 인증을 완료하세요`}
      redirectToOnSuccess={routes.login}
      redirectToOnMissingEmail={routes.register}
    />
  );
};

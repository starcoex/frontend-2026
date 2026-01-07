import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@starcoex-frontend/auth';
import { SocialProvider } from '@starcoex-frontend/graphql';
import { Logos } from '../../logo';

export interface SocialButtonConfig {
  provider: SocialProvider;
  label: string;
  icon: { svg: string };
}

export interface UseSocialLoginOptions {
  onSuccess?: (provider: SocialProvider) => void;
  onError?: (error: string) => void;
}

export function useSocialLogin(options: UseSocialLoginOptions = {}) {
  const { onSuccess, onError } = options;
  const { getSocialLoginUrl, isLoading } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(
    null
  );

  const socialButtons: SocialButtonConfig[] = [
    {
      provider: 'KAKAO' as SocialProvider,
      label: '카카오로 3초만에 시작하기',
      icon: Logos.kakao,
    },
    {
      provider: 'NAVER' as SocialProvider,
      label: '네이버로 간편 가입하기',
      icon: Logos.naver,
    },
    {
      provider: 'GOOGLE' as SocialProvider,
      label: '구글로 빠르게 가입하기',
      icon: Logos.google,
    },
  ];

  const handleSocialLogin = async (provider: SocialProvider) => {
    try {
      setLoadingProvider(provider);

      const result = await getSocialLoginUrl({ provider });

      if (result?.success && result?.data?.getSocialLoginUrl.loginUrl) {
        if (process.env.NODE_ENV === 'development') {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        const loginUrl = new URL(result.data.getSocialLoginUrl.loginUrl);
        loginUrl.searchParams.set('redirect_uri', window.location.origin);

        onSuccess?.(provider);
        window.location.href = loginUrl.toString();
      } else {
        const errorMessage =
          result.error?.message || '소셜 로그인 URL 생성에 실패했습니다';
        toast.error(errorMessage);
        onError?.(errorMessage);
      }
    } catch (error) {
      console.error(`${provider} 로그인 실패:`, error);
      const errorMessage =
        '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoadingProvider(null);
    }
  };

  const isButtonDisabled = isLoading || loadingProvider !== null;

  return {
    socialButtons,
    loadingProvider,
    isButtonDisabled,
    handleSocialLogin,
  };
}

import { useState } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@starcoex-frontend/auth';
import { SocialProvider } from '@starcoex-frontend/graphql';
import { Button } from '@/components/ui/button';
import { Logos } from '@starcoex-frontend/common';

interface SocialLoginButtonsProps {
  onSuccess?: (provider: SocialProvider) => void;
  onError?: (error: string) => void;
  className?: string;
}

export function SocialLoginButtons({
  onSuccess,
  onError,
  className = '',
}: SocialLoginButtonsProps) {
  const { getSocialLoginUrl, isLoading } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(
    null
  );

  const handleSocialLogin = async (provider: SocialProvider) => {
    try {
      setLoadingProvider(provider);

      const result = await getSocialLoginUrl({ provider });

      if (result?.success && result?.data?.getSocialLoginUrl.loginUrl) {
        if (process.env.NODE_ENV === 'development') {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        window.location.href = result?.data.getSocialLoginUrl.loginUrl;
        onSuccess?.(provider);
      } else {
        const errorMessage =
          result.error?.message || '소셜 로그인 URL 생성에 실패했습니다';
        onError?.(errorMessage);
      }
    } catch (error) {
      console.error(`${provider} 로그인 실패:`, error);
      onError?.(
        error instanceof Error
          ? error.message
          : '소셜 로그인 중 오류가 발생했습니다'
      );
    } finally {
      setLoadingProvider(null);
    }
  };

  const socialButtons = [
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

  return (
    <div className={`space-y-3 ${className}`}>
      {socialButtons.map((button) => (
        <Button
          key={button.provider}
          type="button"
          variant="outline"
          className="w-full h-12 font-medium group"
          onClick={() => handleSocialLogin(button.provider)}
          disabled={isLoading || loadingProvider !== null}
        >
          {loadingProvider === button.provider ? (
            <>
              <Loader2 className="mr-3 h-4 w-4 animate-spin" />
              <span>로그인 중...</span>
            </>
          ) : (
            <>
              <div className="w-9 h-9 mr-3 flex items-center justify-center">
                <img
                  src={button.icon.svg}
                  alt={button.label}
                  className={
                    button.provider === 'GOOGLE' ? 'w-7 h-7' : 'w-8 h-8'
                  }
                />
              </div>
              <span>{button.label}</span>
              <CheckCircle className="ml-auto h-4 w-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </>
          )}
        </Button>
      ))}
    </div>
  );
}

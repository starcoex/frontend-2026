import { useState } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@starcoex-frontend/auth';
import { SocialProvider } from '@starcoex-frontend/graphql';
import { Button } from '@/components/ui/button';
import { Logos } from '@starcoex-frontend/common';
import { toast } from 'sonner';

interface SocialLoginButtonsProps {
  className?: string;
}

export function SocialLoginButtons({
  className = '',
}: SocialLoginButtonsProps) {
  const { getSocialLoginUrl, isLoading } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(
    null
  );

  const handleSocialLogin = async (provider: SocialProvider) => {
    try {
      setLoadingProvider(provider);

      // 1. 백엔드에서 소셜 로그인 URL 생성 요청
      const result = await getSocialLoginUrl({ provider });

      if (result?.success && result?.data?.getSocialLoginUrl.loginUrl) {
        // 개발 환경에서 로그 확인을 위한 약간의 지연
        if (process.env.NODE_ENV === 'development') {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        // ✅ 현재 앱의 origin을 redirect_uri로 추가
        const loginUrl = new URL(result.data.getSocialLoginUrl.loginUrl);
        loginUrl.searchParams.set('redirect_uri', window.location.origin);

        // 2. 생성된 URL로 리다이렉트 (전체 페이지 이동)
        window.location.href = loginUrl.toString();
      } else {
        const errorMessage =
          result.error?.message || '소셜 로그인 URL 생성에 실패했습니다';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error(`${provider} 로그인 실패:`, error);
      // ✅ 여기서 직접 에러 Toast 띄우기
      toast.error('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
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
          className={`w-full h-12 font-medium group`}
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
                {button.provider === ('GOOGLE' as SocialProvider) ? (
                  <img
                    src={button.icon.svg}
                    alt={button.label}
                    className="w-7 h-7"
                  />
                ) : (
                  <img
                    src={button.icon.svg}
                    alt={button.label}
                    className="w-8 h-8"
                  />
                )}
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

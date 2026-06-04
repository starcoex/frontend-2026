import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@starcoex-frontend/auth';
import { SocialProvider } from '@starcoex-frontend/graphql';
import { Logos } from '@starcoex-frontend/common';
import { Button } from '@/components/ui/button';

const SOCIAL_BUTTONS: {
  provider: SocialProvider;
  label: string;
  logoKey: keyof typeof Logos;
}[] = [
  { provider: 'KAKAO', label: '카카오로 계속하기', logoKey: 'kakao' },
  { provider: 'NAVER', label: '네이버로 계속하기', logoKey: 'naver' },
  { provider: 'GOOGLE', label: '구글로 계속하기', logoKey: 'google' },
];

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

  const handleLogin = async (provider: SocialProvider) => {
    try {
      setLoadingProvider(provider);
      const result = await getSocialLoginUrl({ provider });
      if (result?.success && result.data?.getSocialLoginUrl.loginUrl) {
        window.location.href = result.data.getSocialLoginUrl.loginUrl;
      }
    } catch (e) {
      console.error(`${provider} 로그인 실패:`, e);
    } finally {
      setLoadingProvider(null);
    }
  };

  const isBusy = isLoading || loadingProvider !== null;

  return (
    <div className={`space-y-2.5 ${className}`}>
      {SOCIAL_BUTTONS.map(({ provider, label, logoKey }) => (
        <Button
          key={provider}
          type="button"
          variant="outline"
          className="w-full h-11 font-medium"
          onClick={() => handleLogin(provider)}
          disabled={isBusy}
        >
          {loadingProvider === provider ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <img
                src={Logos[logoKey].svg}
                alt={provider}
                className="h-5 w-5"
              />
              {label}
            </>
          )}
        </Button>
      ))}
    </div>
  );
}

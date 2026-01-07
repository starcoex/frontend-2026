import React from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import { Button } from '../ui';
import { useSocialLogin, type UseSocialLoginOptions } from '../hooks';

export interface SocialLoginButtonsProps extends UseSocialLoginOptions {
  className?: string;
  buttonClassName?: string;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  className = '',
  buttonClassName = 'w-full h-12 font-medium group',
  onSuccess,
  onError,
}) => {
  const {
    socialButtons,
    loadingProvider,
    isButtonDisabled,
    handleSocialLogin,
  } = useSocialLogin({ onSuccess, onError });

  return (
    <div className={`space-y-3 ${className}`}>
      {socialButtons.map((button) => (
        <Button
          key={button.provider}
          type="button"
          variant="outline"
          className={buttonClassName}
          onClick={() => handleSocialLogin(button.provider)}
          disabled={isButtonDisabled}
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
};

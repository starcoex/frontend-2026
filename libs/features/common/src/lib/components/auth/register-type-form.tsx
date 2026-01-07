import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Mail } from 'lucide-react';
import { useAuth } from '@starcoex-frontend/auth';
import { SocialProvider } from '@starcoex-frontend/graphql';
import { Button, CardContent } from '../ui';
import { SocialLoginButtons } from './social-login-button';

export interface RegisterTypeFormProps {
  onEmailRegister: () => void;
  onSocialSuccess?: (provider: SocialProvider) => void;
  onSocialError?: (error: string) => void;
  loginPath?: string;
  className?: string;
  dividerClassName?: string;
  buttonClassName?: string;
  /** 이메일 버튼을 감싸는 래퍼 (애니메이션 등) */
  emailButtonWrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

export const RegisterTypeForm: React.FC<RegisterTypeFormProps> = ({
  onEmailRegister,
  onSocialSuccess,
  onSocialError,
  loginPath = '/auth/login',
  className = 'space-y-4',
  dividerClassName = 'bg-background',
  buttonClassName = 'w-full h-12 font-medium group',
  emailButtonWrapper: EmailButtonWrapper,
}) => {
  const { isLoading } = useAuth();

  const emailButton = (
    <Button
      type="button"
      variant="outline"
      className={buttonClassName}
      onClick={onEmailRegister}
      disabled={isLoading}
    >
      <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
      <span>이메일로 회원가입</span>
      <CheckCircle className="ml-auto h-4 w-4 opacity-60 group-hover:opacity-100 transition-all" />
    </Button>
  );

  return (
    <CardContent className={className}>
      {/* 소셜 로그인 버튼들 */}
      <SocialLoginButtons
        onSuccess={onSocialSuccess}
        onError={onSocialError}
        className="space-y-3"
      />

      {/* 구분선 */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className={`${dividerClassName} px-2 text-muted-foreground`}>
            또는
          </span>
        </div>
      </div>

      {/* 이메일 회원가입 버튼 */}
      {EmailButtonWrapper ? (
        <EmailButtonWrapper>{emailButton}</EmailButtonWrapper>
      ) : (
        emailButton
      )}

      {/* 로그인 링크 */}
      <div className="text-center text-sm pt-2">
        이미 계정이 있으신가요?{' '}
        <Link
          to={loginPath}
          className="text-primary hover:underline font-medium"
        >
          로그인
        </Link>
      </div>
    </CardContent>
  );
};

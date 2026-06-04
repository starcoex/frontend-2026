import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';

export function SocialCallbackPage() {
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get('accessToken');
      const refreshToken = params.get('refreshToken');
      const error = params.get('error');

      // 실패 케이스
      if (error) {
        navigate('/auth/login?error=social_failed');
        return;
      }

      // 토큰이 URL에 있는 경우 쿠키에 저장
      if (accessToken && refreshToken) {
        const isSecure = window.location.protocol === 'https:';
        const cookieOptions = `path=/; ${
          isSecure ? 'Secure;' : ''
        } SameSite=Lax`;
        document.cookie = `accessToken=${accessToken}; ${cookieOptions}`;
        document.cookie = `refreshToken=${refreshToken}; ${cookieOptions}`;
      }

      // 쿠키 설정 후 약간의 딜레이 후 인증 상태 확인
      // (쿠키가 브라우저에 반영되는 시간 확보)
      await new Promise((resolve) => setTimeout(resolve, 300));

      try {
        const { isAuthenticated } = await checkAuthStatus();
        if (isAuthenticated) {
          navigate('/dashboard', { replace: true });
        } else {
          // 재시도 1회
          await new Promise((resolve) => setTimeout(resolve, 500));
          const retry = await checkAuthStatus();
          if (retry.isAuthenticated) {
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/auth/login?error=auth_failed');
          }
        }
      } catch {
        navigate('/auth/login?error=social_failed');
      }
    };

    handleCallback();
  }, []); // ← 의존성 배열 비움 (최초 1회만 실행)

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto" />
        <p className="text-muted-foreground">로그인 처리 중...</p>
      </div>
    </div>
  );
}

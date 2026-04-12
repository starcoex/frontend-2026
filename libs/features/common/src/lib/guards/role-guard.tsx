import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import { LoadingSpinner } from '../components';

interface RoleGuardProps {
  /** 이 layout에 허용되는 역할 */
  allowedRoles: string[];
  /** 차단 시 리다이렉트 경로 */
  redirectTo: string;
  children: React.ReactNode;
}

export function RoleGuard({
  allowedRoles,
  redirectTo,
  children,
}: RoleGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, initialized, isAuthenticated } = useAuth();

  useEffect(() => {
    // 초기화 전엔 대기
    if (!initialized) return;

    // 비로그인 → 로그인 페이지
    if (!isAuthenticated || !currentUser) {
      navigate('/auth/login', {
        replace: true,
        state: { from: location.pathname },
      });
      return;
    }

    const userRole = currentUser.role ?? '';
    const isAllowed = allowedRoles.includes(userRole);

    if (!isAllowed) {
      navigate(redirectTo, { replace: true });
    }
  }, [
    initialized,
    isAuthenticated,
    currentUser,
    allowedRoles,
    redirectTo,
    navigate,
    location.pathname,
  ]);

  // 초기화 전 또는 역할 확인 중
  if (!initialized) {
    return <LoadingSpinner message="권한을 확인하는 중..." />;
  }

  // 허용된 역할이 아니면 아무것도 렌더링하지 않음 (리다이렉트 중)
  if (!currentUser || !allowedRoles.includes(currentUser.role ?? '')) {
    return null;
  }

  return <>{children}</>;
}

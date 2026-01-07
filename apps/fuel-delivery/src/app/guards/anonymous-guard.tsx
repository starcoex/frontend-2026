import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import { LoadingPage } from '@starcoex-frontend/common';

interface AnonymousGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * AnonymousGuard 컴포넌트
 *
 * 인증되지 않은 사용자(익명 사용자)만 접근할 수 있도록 보호합니다.
 * 이미 로그인한 사용자가 접근하면 지정된 경로로 리다이렉트시킵니다.
 *
 * @param children - 보호할 컴포넌트
 * @param redirectTo - 인증된 사용자를 리다이렉트할 경로 (기본값: '/profile')
 */
export const AnonymousGuard: React.FC<AnonymousGuardProps> = ({
  children,
  redirectTo = '/profile',
}) => {
  const { isLoading, isAuthenticated, currentUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // 디버그 로그
    if (process.env.NODE_ENV === 'development') {
      console.log('[AnonymousGuard] 상태:', {
        isLoading,
        isAuthenticated,
        currentUser: currentUser?.email || 'none',
        currentPath: location.pathname,
        redirectTo,
      });
    }
  }, [isLoading, isAuthenticated, currentUser, location.pathname, redirectTo]);

  // 인증 상태 확인 중일 때 로딩 화면
  if (isLoading) {
    return <LoadingPage message="사용자 인증 상태를 확인하는 중..." />;
  }

  // 이미 인증된 사용자라면 리다이렉트
  if (isAuthenticated && currentUser) {
    // 현재 위치를 state로 전달하여 나중에 사용할 수 있도록 함
    const from = location.state?.from?.pathname || redirectTo;

    console.log(
      `[AnonymousGuard] 인증된 사용자 리다이렉트: ${location.pathname} -> ${from}`
    );

    return <Navigate to={from} replace />;
  }

  // 인증되지 않은 사용자만 접근 허용
  return <>{children}</>;
};

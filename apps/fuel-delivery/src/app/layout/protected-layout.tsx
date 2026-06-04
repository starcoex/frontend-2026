import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import { MainLayout } from '@/app/layout/main-layout';

export const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, currentUser, initialized, checkAuthStatus } =
    useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!initialized) {
      checkAuthStatus().catch((error) => {
        console.warn('인증 상태 확인 실패:', error);
      });
    }
  }, []); // ✅ 마운트 시 1회만

  // ✅ 로그인 직후: initialized=false지만 isAuthenticated=true → 바로 통과
  if (!initialized && isAuthenticated) {
    return <MainLayout />;
  }

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto" />
          <p className="text-muted-foreground text-sm">
            인증 상태를 확인하는 중...
          </p>
        </div>
      </div>
    );
  }

  if (initialized && !isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto" />
          <p className="text-muted-foreground text-sm">
            사용자 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return <MainLayout />;
};

import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Header } from '@/components/header/header';
import { Footer } from '@/components/footer/footer';

/**
 * 🔐 인증이 필요한 페이지들을 위한 보호된 레이아웃
 */
export const ProtectedLayout: React.FC = () => {
  const {
    isAuthenticated,
    currentUser,
    initialized,
    isLoading,
    checkAuthStatus,
  } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!initialized) {
      checkAuthStatus().catch((error) => {
        console.warn('관리자 레이아웃에서 인증 상태 확인 실패:', error);
      });
    }
  }, [initialized, checkAuthStatus]);

  // 1) 인증 초기화/로딩 중에는 무조건 리다이렉트하지 말고 로딩 UI 표시
  if (!initialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">인증 상태를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  // 2) 초기화가 끝났는데 인증이 안 된 경우 → 로그인 페이지로
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // 3) 토큰은 있지만 사용자 정보가 아직 준비되지 않은 경우 → 사용자 정보 로딩 UI
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 인증된 사용자에게는 기본 레이아웃 제공
  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
};

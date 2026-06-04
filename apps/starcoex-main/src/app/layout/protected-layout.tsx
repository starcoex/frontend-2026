import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Header } from '@/components/header/header';
import { Footer } from '@/components/footer/footer';
import {
  PwaInstallBanner,
  PwaUpdateBanner,
  OfflineIndicator,
} from '@starcoex-frontend/pwa';

export const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, currentUser, initialized, checkAuthStatus } =
    useAuth();
  const location = useLocation();

  useEffect(() => {
    // ✅ 초기화가 안 된 경우에만 확인 (이미 로그인 상태면 호출 안 함)
    if (!initialized) {
      checkAuthStatus().catch((error) => {
        // ✅ 실패해도 로그아웃 처리하지 않음 - 오류 로그만
        console.warn('인증 상태 확인 실패:', error);
      });
    }
  }, []); // ✅ 마운트 시 1회만

  // ─── 아직 초기화 안 됐지만 이미 로그인 상태라면 바로 통과 ───────────────────
  // 로그인 직후 리다이렉트 시 initialized=false일 수 있음
  if (!initialized && isAuthenticated) {
    // 서버 확인이 끝나지 않았어도 클라이언트 상태가 인증됨 → 통과
  } else if (!initialized) {
    // 완전히 미확인 상태 → 로딩
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">인증 상태를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  // ─── 초기화 완료 후 미인증 → 로그인 페이지 ────────────────────────────────────
  if (initialized && !isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // ─── 유저 정보 없음 (비정상 상태) ─────────────────────────────────────────────
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

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="mx-4 mt-2 space-y-2">
          <OfflineIndicator />
          <PwaUpdateBanner />
          <PwaInstallBanner />
        </div>
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
};

import React, { useEffect } from 'react';
import { Outlet, useLocation, Navigate, Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useAuth } from '@starcoex-frontend/auth';
import { AppConfigProvider } from '@starcoex-frontend/common';
import { carWashAuthConfig } from '@/app/config/auth.config';
import { Droplets } from 'lucide-react';
import { AuthEditorialPanel } from '@/app/pages/auth/components/auth-editorial-panel';

/**
 * 🔐 인증 페이지 전용 레이아웃
 * - 로그인, 회원가입, 비밀번호 찾기 등 인증 관련 페이지에서 사용
 * - 인증된 사용자는 대시보드로 리다이렉트
 */
export const AuthLayout: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, initialized, checkAuthStatus } = useAuth();

  useEffect(() => {
    if (!initialized) {
      checkAuthStatus().catch((error) => {
        console.warn('카케어 인증 상태 확인 실패:', error);
      });
    }
  }, []); // ✅ 마운트 시 1회만

  // ── 초기화 중 로딩 ────────────────────────────────────────────────────────
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-600 via-blue-700 to-cyan-800">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto" />
          <p className="text-white/70 text-sm">인증 상태 확인 중...</p>
        </div>
      </div>
    );
  }

  // ── 이미 인증된 사용자 → 리다이렉트 ──────────────────────────────────────
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // ── 레이아웃 렌더링 ───────────────────────────────────────────────────────
  return (
    <AppConfigProvider config={carWashAuthConfig}>
      {/*
        ✅ 핵심: h-screen + overflow-hidden → 스크롤 없이 뷰포트에 고정
      */}
      <div className="flex h-screen overflow-hidden">
        {/* 좌측 Editorial 패널 (데스크톱) */}
        <AuthEditorialPanel />
        {/* 우측 폼 영역 */}
        <div className="flex flex-1 flex-col bg-white dark:bg-gray-950">
          {/* 홈 버튼 — 우측 상단 */}
          <div className="flex justify-between items-center px-6 pt-6">
            {/* 모바일: 브랜드 로고 */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">제라게</span>
            </div>
            {/* 데스크톱: 빈 공간 */}
            <div className="hidden lg:block" />

            <Link
              to="/"
              className="p-2 rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              aria-label="홈으로"
            >
              <Home className="w-4 h-4" />
            </Link>
          </div>

          {/* 폼 콘텐츠 */}
          <main className="flex flex-1 items-center justify-center px-6 py-8">
            <div className="w-full max-w-sm">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </AppConfigProvider>
  );
};

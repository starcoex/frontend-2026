import React, { useEffect } from 'react';
import {
  Outlet,
  useNavigate,
  useLocation,
  Navigate,
  Link,
} from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '@starcoex-frontend/auth';
import { AppConfigProvider } from '@starcoex-frontend/common';
import { gasStationAuthConfig } from '@/app/config/auth-config';

/**
 * 🔐 인증 페이지 전용 레이아웃
 * - 로그인, 회원가입, 비밀번호 찾기 등 인증 관련 페이지에서 사용
 * - 인증된 사용자는 대시보드로 리다이렉트
 */
export const AuthLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, initialized, checkAuthStatus } = useAuth();

  // 인증 초기화가 되지 않았다면 서버에 상태 확인 요청
  useEffect(() => {
    if (!initialized) {
      checkAuthStatus().catch((error) => {
        console.warn('인증 상태 확인 실패:', error);
      });
    }
  }, [initialized, checkAuthStatus]);

  // 초기화 중이면 로딩 UI 표시
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground text-sm">인증 상태 확인 중...</p>
        </div>
      </div>
    );
  }

  // 이미 인증된 사용자는 이전 페이지 또는 대시보드로 리다이렉트
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return (
    <AppConfigProvider config={gasStationAuthConfig}>
      <div className="min-h-screen flex flex-col">
        {/* 상단 네비게이션 */}
        <header className="fixed top-0 left-0 right-0 z-50 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* 뒤로가기 버튼 */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-800 transition-all shadow-sm"
              aria-label="뒤로가기"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* 홈 버튼 */}
            <Link
              to="/"
              className="p-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-800 transition-all shadow-sm"
              aria-label="홈으로"
            >
              <Home className="w-5 h-5" />
            </Link>
          </div>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </main>
      </div>
    </AppConfigProvider>
  );
};

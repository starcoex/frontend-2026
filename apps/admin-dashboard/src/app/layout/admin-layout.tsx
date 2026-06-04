import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import Cookies from 'js-cookie';
import { CommandMenu } from '@/components/command-menu';
import { BottomNav } from '@/components/layout/botton-nav';
import { PushNotificationBanner } from '@starcoex-frontend/common';
import {
  OfflineIndicator,
  PwaInstallBanner,
  PwaUpdateBanner,
} from '@starcoex-frontend/pwa';
import { LayoutDashboard } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, currentUser, initialized, checkAuthStatus } =
    useAuth();
  const sidebarState = Cookies.get('sidebar_state');
  const defaultOpen = sidebarState === 'true' || sidebarState === undefined;

  useEffect(() => {
    if (!initialized) {
      checkAuthStatus().catch((error) => {
        console.warn('관리자 레이아웃에서 인증 상태 확인 실패:', error);
      });
    }
  }, [initialized, checkAuthStatus]);

  // 1) 인증 초기화/로딩 중에는 무조건 리다이렉트하지 말고 로딩 UI 표시
  if (!initialized) {
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

  // 4) DELIVERY 역할 접근 제어
  if (currentUser.role === 'DELIVERY') {
    // ✅ DELIVERY 역할이 접근 허용된 경로 목록
    const DELIVERY_ALLOWED_PATHS = [
      '/admin/driver', // 배달기사 전용 뷰 전체
      '/admin/suggestions', // 건의사항
      '/admin/settings', // 설정
    ];

    const isAllowedPath = DELIVERY_ALLOWED_PATHS.some((path) =>
      location.pathname.startsWith(path)
    );

    if (!isAllowedPath) {
      return <Navigate to="/admin/driver/dashboard" replace />;
    }
  }

  // 5) USER 역할 접근 제어 — 허용 경로 외 전부 차단
  if (currentUser.role === 'USER') {
    const USER_ALLOWED_PATHS = ['/admin/settings', '/admin/suggestions'];

    const isAllowedPath = USER_ALLOWED_PATHS.some((path) =>
      location.pathname.startsWith(path)
    );

    if (!isAllowedPath) {
      return (
        <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-full bg-muted p-4">
            <LayoutDashboard className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">접근 권한이 없습니다</h3>
            <p className="text-sm text-muted-foreground">
              해당 페이지는 관리자 이상의 권한이 필요합니다.
            </p>
          </div>
        </div>
      );
    }
  }

  // 6) 인증 + 사용자 정보까지 준비된 상태 → 실제 Admin 레이아웃 렌더
  return (
    <div className="border-grid flex flex-1 flex-col">
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {/* 푸시 알림 배너 — 권한 미허용 시에만 표시됨 */}
          <PushNotificationBanner
            userId={currentUser.id}
            className="mx-3 mt-3"
          />
          {/* PWA 설치 유도 배너 */}
          <PwaInstallBanner className="mx-3 mt-2" />
          {/* PWA 업데이트 알림 배너 */}
          <PwaUpdateBanner className="mx-3 mt-2" />
          {/* 오프라인 상태 표시 */}
          <OfflineIndicator className="mx-3 mt-2" />
          <div
            id="content"
            className={cn(
              'flex h-full w-full flex-col',
              'has-[div[data-layout=fixed]]:h-svh',
              'group-data-[scroll-locked=1]/body:h-full',
              'has-[data-layout=fixed]:group-data-[scroll-locked=1]/body:h-svh'
            )}
          >
            <Outlet />
          </div>
        </SidebarInset>
        <CommandMenu />
      </SidebarProvider>

      {/* 모바일 전용 하단 탭바 */}
      <BottomNav />
    </div>
  );
};

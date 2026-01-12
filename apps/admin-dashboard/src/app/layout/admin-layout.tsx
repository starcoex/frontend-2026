import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import Cookies from 'js-cookie';
import { CommandMenu } from '@/components/command-menu';

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

  // 4) 인증 + 사용자 정보까지 준비된 상태 → 실제 Admin 레이아웃 렌더
  return (
    <div className="border-grid flex flex-1 flex-col">
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
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
    </div>
  );
};

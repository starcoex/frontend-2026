import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import {
  CalendarDays,
  Car,
  LogOut,
  Menu,
  ShoppingBag,
  User,
  X,
  Zap,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { APP_CONFIG } from '@/app/config/app.config';
import {
  OfflineIndicator,
  PwaInstallBanner,
  PwaUpdateBanner,
} from '@starcoex-frontend/pwa';

/**
 * 🔐 인증이 필요한 카케어 대시보드 레이아웃
 */
export const DashboardLayout: React.FC = () => {
  const {
    isAuthenticated,
    currentUser,
    initialized,
    isLoading,
    checkAuthStatus,
    logout,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!initialized) {
      checkAuthStatus().catch((error) => {
        console.warn('카케어 대시보드 인증 상태 확인 실패:', error);
      });
    }
  }, []); // ✅ 마운트 시 1회만

  // ✅ 로그인 직후: initialized=false지만 isAuthenticated=true → 바로 통과
  if (!initialized && isAuthenticated) {
    // 아래 렌더링까지 도달하도록 조건 통과
  } else if (!initialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto" />
          <p className="text-slate-400">인증 상태를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  if (initialized && !isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // 3) 사용자 정보 로딩 중
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto" />
          <p className="text-slate-400">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const navigationItems = [
    {
      label: '내 정보',
      href: '/dashboard',
      icon: User,
      description: '프로필 및 차량 관리',
    },
    {
      label: '예약 내역',
      href: '/bookings',
      icon: CalendarDays,
      description: '세차 예약 확인',
    },
    {
      label: '내 차량',
      href: '/dashboard/vehicles',
      icon: Car,
      description: '등록 차량 관리',
    },
    {
      label: '이용 내역',
      href: '/dashboard/history',
      icon: ShoppingBag,
      description: '결제 및 이용 기록',
    },
  ];

  const isActivePath = (path: string) => {
    if (path === '/dashboard') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* 모바일 오버레이 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`fixed top-0 left-0 z-50 w-72 h-full bg-slate-900/95 backdrop-blur-sm border-r border-slate-700/50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* 사이드바 헤더 */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">카케어</h1>
                <div className="text-xs text-slate-400">MY DASHBOARD</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-slate-400"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* 네비게이션 */}
        <nav className="p-4 space-y-1 flex-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.href);
            return (
              <button
                key={item.href}
                onClick={() => {
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? 'text-cyan-400' : ''}`}
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-slate-500">
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* 사용자 정보 */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
            <Avatar className="w-10 h-10 border border-cyan-500/30">
              <AvatarFallback className="bg-slate-700 text-white text-sm">
                {currentUser?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">
                {currentUser?.name}
              </div>
              <div className="text-xs text-slate-400 truncate">
                {currentUser?.email}
              </div>
              <Badge className="mt-1 text-xs bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                멤버
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <div className="lg:ml-72">
        {/* 상단 바 */}
        <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-slate-400"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-lg font-semibold">
                  {navigationItems.find((item) => isActivePath(item.href))
                    ?.label || '대시보드'}
                </h2>
                <div className="text-xs text-slate-400">
                  {new Date().toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Zap className="w-3 h-3 mr-1" />
                LIVE
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(APP_CONFIG.routes.home)}
                className="border-slate-600 text-slate-300 hover:text-white"
              >
                메인으로
              </Button>
            </div>
          </div>
        </header>

        {/* 페이지 콘텐츠 */}
        <main className="p-6">
          {/* PWA 배너 */}
          <div className="mb-4 space-y-2">
            <OfflineIndicator />
            <PwaUpdateBanner />
            <PwaInstallBanner />
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

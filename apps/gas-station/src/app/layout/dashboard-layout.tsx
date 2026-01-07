import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import {
  Badge,
  BarChart3,
  Fuel,
  LogOut,
  MapPin,
  Menu,
  Shield,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';
import { Button } from '@starcoex-frontend/common';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';

/**
 * 🔐 인증이 필요한 페이지들을 위한 보호된 레이아웃
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

  const navigationItems = [
    {
      label: '대시보드',
      href: '/dashboard',
      icon: BarChart3,
      description: '실시간 모니터링',
    },
    {
      label: '연료 가격',
      href: '/dashboard/prices',
      icon: Fuel,
      description: '실시간 유가 현황',
    },
    {
      label: '주유소 현황',
      href: '/dashboard/fuels',
      icon: MapPin,
      description: '운영 상태 모니터링',
    },
    {
      label: '분석',
      href: '/dashboard/analytics',
      icon: TrendingUp,
      description: '데이터 분석',
    },
    {
      label: '시스템 모니터링',
      href: '/dashboard/monitoring',
      icon: Shield,
      description: '시스템 상태',
    },
  ];

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
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
      {/* 사이드바 오버레이 (모바일) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`fixed top-0 left-0 z-50 w-80 h-full bg-slate-900/95 backdrop-blur-sm border-r border-slate-700/50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* 사이드바 헤더 */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Fuel className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold futuristic">별표주유소</h1>
                <div className="text-xs text-slate-400">DASHBOARD v2.0</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* 시스템 상태 */}
          <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 mono">SYSTEM STATUS</span>
              <div className="status-indicator operational"></div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="text-green-400 mono">99.9%</div>
                <div className="text-slate-500">UPTIME</div>
              </div>
              <div>
                <div className="text-cyan-400 mono">LIVE</div>
                <div className="text-slate-500">DATA</div>
              </div>
              <div>
                <div className="text-purple-400 mono">24/7</div>
                <div className="text-slate-500">ACTIVE</div>
              </div>
            </div>
          </div>
        </div>

        {/* 네비게이션 */}
        <nav className="p-4 space-y-2 flex-1">
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                  isActive
                    ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 neon-border'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? 'text-cyan-400' : ''}`}
                />
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-slate-400">
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
              <AvatarFallback className="bg-slate-700 text-white">
                {currentUser?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{currentUser?.name}</div>
              <div className="text-xs text-slate-400 truncate">
                {currentUser?.email}
              </div>
              <Badge className="mt-1 text-xs bg-green-500/20 text-green-400 border-green-500/30">
                Portal Connected
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
      <div className="lg:ml-80">
        {/* 상단 바 */}
        <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-xl font-semibold">
                  {navigationItems.find((item) => isActivePath(item.href))
                    ?.label || 'Dashboard'}
                </h2>
                <div className="text-sm text-slate-400 mono">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Zap className="w-3 h-3 mr-1" />
                LIVE
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="border-slate-600 text-slate-300"
              >
                메인으로
              </Button>
            </div>
          </div>
        </header>

        {/* 페이지 콘텐츠 */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Truck,
  MapPin,
  LogOut,
  Menu,
  X,
  Package,
  TrendingUp,
  Shield,
  Bell,
  Settings,
} from 'lucide-react';
import { useAuth } from '@starcoex-frontend/auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigationItems = [
    {
      label: '홈',
      href: '/dashboard',
      icon: Home,
      description: '메인 대시보드',
    },
    {
      label: '주문 관리',
      href: '/dashboard/orders',
      icon: Package,
      description: '배달 주문 현황',
    },
    {
      label: '배송 현황',
      href: '/dashboard/deliveries',
      icon: Truck,
      description: '실시간 배송 추적',
    },
    {
      label: '배송 지역',
      href: '/dashboard/areas',
      icon: MapPin,
      description: '서비스 지역 관리',
    },
    {
      label: '분석',
      href: '/dashboard/analytics',
      icon: TrendingUp,
      description: '매출 및 통계',
    },
    {
      label: '설정',
      href: '/dashboard/settings',
      icon: Settings,
      description: '시스템 설정',
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white dark:from-orange-900/10 dark:via-amber-900/10 dark:to-gray-900">
      {/* 사이드바 오버레이 (모바일) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`fixed top-0 left-0 z-50 w-80 h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-r border-orange-200/50 dark:border-orange-800/50 shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* 사이드바 헤더 */}
        <div className="p-6 border-b border-orange-200/50 dark:border-orange-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-orange-900 dark:text-orange-100">
                  난방유 배달
                </h1>
                <Badge
                  variant="outline"
                  className="text-xs mt-1 border-orange-300 text-orange-600"
                >
                  by 스타코엑스
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-orange-600"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* 서비스 상태 */}
          <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-orange-600 font-medium">
                서비스 상태
              </span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">
                  온라인
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-green-600 font-bold">99.9%</div>
                <div className="text-orange-500">가동률</div>
              </div>
              <div className="text-center">
                <div className="text-blue-600 font-bold">실시간</div>
                <div className="text-orange-500">추적</div>
              </div>
              <div className="text-center">
                <div className="text-purple-600 font-bold">24/7</div>
                <div className="text-orange-500">서비스</div>
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-orange-100 dark:bg-orange-950/50 border border-orange-300 text-orange-900 dark:text-orange-100 shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:text-orange-900 dark:hover:text-orange-100 hover:bg-orange-50 dark:hover:bg-orange-950/30 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-orange-600' : 'text-gray-500'
                  }`}
                />
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* 사용자 정보 */}
        <div className="p-4 border-t border-orange-200/50 dark:border-orange-800/50">
          <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200/50">
            <Avatar className="w-10 h-10 border-2 border-orange-300">
              <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-400 text-white font-medium">
                {currentUser?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-orange-900 dark:text-orange-100 truncate">
                {currentUser?.name || '사용자'}
              </div>
              <div className="text-xs text-orange-600 dark:text-orange-400 truncate">
                {currentUser?.email || 'user@example.com'}
              </div>
              <Badge className="mt-1 text-xs bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700">
                <Shield className="w-3 h-3 mr-1" />
                인증 완료
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-orange-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              title="로그아웃"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <div className="lg:ml-80">
        {/* 상단 바 */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-orange-200/50 dark:border-orange-800/50 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden text-orange-600"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </Button>
                <div>
                  <h2 className="text-xl font-semibold text-orange-900 dark:text-orange-100">
                    {navigationItems.find((item) => isActivePath(item.href))
                      ?.label || '홈'}
                  </h2>
                  <div className="text-sm text-orange-600 dark:text-orange-400">
                    마지막 업데이트: {new Date().toLocaleTimeString('ko-KR')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge className="bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  실시간 연결
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                  title="알림"
                >
                  <Bell className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-950/30"
                >
                  메인으로
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* 페이지 콘텐츠 */}
        <main className="p-6">
          <Outlet />
        </main>

        {/* 하단 도움말 */}
        <div className="fixed bottom-6 right-6 z-40">
          <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg border border-orange-200 dark:border-orange-800 p-3">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30"
              onClick={() => window.open('tel:1588-9999')}
              title="고객지원"
            >
              📞 도움말
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

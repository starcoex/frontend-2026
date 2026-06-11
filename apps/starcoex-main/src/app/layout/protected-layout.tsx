import React, { useEffect, useState } from 'react';
import {
  Outlet,
  Navigate,
  useLocation,
  Link,
  useNavigate,
} from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Header } from '@/components/header/header';
import { Footer } from '@/components/footer/footer';
import {
  PwaInstallBanner,
  PwaUpdateBanner,
  OfflineIndicator,
} from '@starcoex-frontend/pwa';
import {
  LayoutDashboard,
  ShoppingBag,
  MessageCircle,
  Briefcase,
  User,
  Shield,
  Settings,
  Star,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// ─── 사이드 메뉴 구성 ─────────────────────────────────────────────────────────

const SIDE_NAV_ITEMS = [
  {
    group: '내 활동',
    items: [
      { label: '대시보드', href: '/dashboard', icon: LayoutDashboard },
      { label: '주문 내역', href: '/orders', icon: ShoppingBag },
      { label: '문의 내역', href: '/my-contacts', icon: MessageCircle },
      { label: '채용 지원', href: '/my-applications', icon: Briefcase },
    ],
  },
  {
    group: '내 계정',
    items: [
      { label: '프로필', href: '/profile', icon: User },
      { label: '멤버십·별', href: '/membership', icon: Star },
      { label: '보안 설정', href: '/security', icon: Shield },
      { label: '환경 설정', href: '/settings', icon: Settings },
    ],
  },
];

// ─── 사이드바 컴포넌트 ────────────────────────────────────────────────────────

function ProtectedSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* 모바일 오버레이 */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 사이드바 본체 */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-card border-r flex flex-col transition-transform duration-300 ease-in-out',
          'lg:static lg:translate-x-0 lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* 상단: 유저 정보 */}
        <div className="flex items-center gap-3 px-4 py-5 border-b">
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {currentUser?.name?.charAt(0) ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">
              {currentUser?.name ?? '사용자'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {currentUser?.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto lg:hidden shrink-0"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
          {SIDE_NAV_ITEMS.map((group) => (
            <div key={group.group}>
              <p className="px-3 mb-1 text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">
                {group.group}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.href ||
                    location.pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                      {isActive && (
                        <ChevronRight className="w-3 h-3 ml-auto text-primary" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* 하단: 로그아웃 */}
        <div className="px-4 py-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground text-xs"
            onClick={handleLogout}
          >
            로그아웃
          </Button>
        </div>
      </aside>
    </>
  );
}

// ─── ProtectedLayout ─────────────────────────────────────────────────────────

export const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, currentUser, initialized, checkAuthStatus } =
    useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!initialized) {
      checkAuthStatus().catch((error) => {
        console.warn('인증 상태 확인 실패:', error);
      });
    }
  }, []);

  if (!initialized && isAuthenticated) {
    // 통과
  } else if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">인증 상태를 확인하는 중...</p>
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-background">
        {/* 공통 헤더 — 모바일 햄버거 버튼 포함 */}
        <Header
          sidebarToggle={
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="메뉴 열기"
            >
              <Menu className="w-5 h-5" />
            </Button>
          }
        />

        <div className="mx-4 mt-2 space-y-2">
          <OfflineIndicator />
          <PwaUpdateBanner />
          <PwaInstallBanner />
        </div>

        {/* 사이드바 + 콘텐츠 영역 */}
        <div className="flex flex-1 container max-w-6xl mx-auto px-4 py-6 gap-6">
          {/* 사이드바 (데스크톱: 항상 표시, 모바일: 토글) */}
          <ProtectedSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* 메인 콘텐츠 */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>

        <Footer />
      </div>
    </TooltipProvider>
  );
};

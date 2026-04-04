import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  MapPin,
  ShoppingCart,
  TrendingUp,
  Building2,
  HelpCircle,
  Phone,
  Settings,
  User,
  BarChart3,
  Crown,
  Ticket,
  Droplets,
  ShoppingBag,
} from 'lucide-react';
import { MobileMenu } from './mobile-menu';
import {
  CartHeaderBadge,
  ContactButton,
  HeaderServicesDropdown,
  StarOilLogo,
  ThemeToggle,
  UserMenuData,
  UserMenuItem,
  UserMenuLogout,
  UserMenuProvider,
  UserMenuRoot,
  UserMenuSeparator,
} from '@starcoex-frontend/common';
import { useAuth } from '@starcoex-frontend/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { STARCOEX_SERVICES } from '@/app/utils/brand-constants';
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { NotificationBell } from '@starcoex-frontend/common';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const convertToUserMenuData = (user: any): UserMenuData | null => {
  if (!user) return null;
  return {
    id: user.id?.toString() || '',
    email: user.email || '',
    name: user.name || '',
    avatar: user.avatarUrl || user.avatar?.url || undefined,
    userType: user.userType,
    role: user.role || undefined,
    isSocialUser: user.isSocialUser || false,
  };
};

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userMenuData = convertToUserMenuData(currentUser);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMobileMenuOpen]);

  const navigationItems: NavigationItem[] = [
    { label: '홈', href: '/', icon: Home },
    { label: '실시간 유가', href: '/prices', icon: TrendingUp },
    { label: '멤버십', href: '/membership', icon: Crown },
    { label: '주유소 찾기', href: '/location', icon: MapPin },
  ];

  const companyMenuItems: MenuItem[] = [
    {
      title: '회사 소개',
      href: '/about',
      icon: Building2,
      description: '스타코엑스의 비전과 서비스 소개',
    },
    {
      title: '세차 프로세스',
      href: '/process',
      icon: Droplets,
      description: '5단계 프리미엄 세차 과정 안내',
    },
    {
      title: 'FAQ',
      href: '/faq',
      icon: HelpCircle,
      description: '자주 묻는 질문과 답변',
    },
    {
      title: '연락처',
      href: '/contact',
      icon: Phone,
      description: '문의사항 및 고객지원',
    },
  ];

  const purchaseMenuItems: MenuItem[] = [
    {
      title: '연료 구매',
      href: '/fuel',
      icon: Droplets,
      description: '무연, 경유, 등유 구매',
    },
    {
      title: '세차 서비스',
      href: '/services',
      icon: Droplets,
      description: '프리미엄 자동세차 서비스 안내',
    },
    {
      title: '세차 쿠폰',
      href: '/fuel/car-wash-coupon',
      icon: Ticket,
      description: '선물하기 및 5+1 패키지 구매',
    },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === path;
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

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="relative z-50 py-1">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
            <StarOilLogo width={40} height={40} />
            <div className="hidden xl:block">
              <CardTitle className="text-xl">별표주유소</CardTitle>
              <CardDescription className="text-xs -mt-1">
                JEJU GAS STATION
              </CardDescription>
            </div>
          </Link>

          {/* 데스크톱 네비게이션 — NavigationMenu 완전 제거, 모두 DropdownMenu 사용 */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* 주요 메뉴 — 단순 Link 버튼 */}
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'bg-transparent hover:bg-accent flex flex-row items-center px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md whitespace-nowrap',
                    isActive
                      ? 'bg-accent text-accent-foreground shadow-sm'
                      : 'text-foreground hover:text-accent-foreground'
                  )}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* 구매 드롭다운 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-foreground bg-transparent hover:bg-accent hover:text-accent-foreground"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  구매
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                {purchaseMenuItems.map((item) => (
                  <DropdownMenuItem key={item.title} asChild>
                    <Link
                      to={item.href}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 회사 정보 드롭다운 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-foreground bg-transparent hover:bg-accent hover:text-accent-foreground"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  회사 정보
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                {companyMenuItems.map((item) => (
                  <DropdownMenuItem key={item.title} asChild>
                    <Link
                      to={item.href}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <div>
                        <div className="text-sm font-medium">{item.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 다른 서비스 — DropdownMenu 기반 */}
            <HeaderServicesDropdown
              services={STARCOEX_SERVICES}
              onServiceClick={(service) => {
                window.open(service.href, '_blank');
              }}
            />
          </div>

          {/* 우측 액션 영역 */}
          <div className="flex items-center space-x-3">
            {/* 연락처 버튼 — 자체 TooltipProvider 포함 */}
            <ContactButton
              variant="outline"
              className="hidden md:flex"
              phoneNumber="064-713-2002"
              showText={true}
              textBreakpoint="always"
            />

            {/* 알림 벨 — 내부에서 useAuth로 userId 직접 획득 */}
            {isAuthenticated && (
              <NotificationBell
                onViewAll={() => navigate('/notifications')}
                onSettings={() => navigate('/notification-settings')}
                onNotificationClick={(notification) => {
                  if (notification.actionUrl) {
                    navigate(notification.actionUrl);
                  }
                }}
              />
            )}

            {/* 장바구니 뱃지 */}
            <CartHeaderBadge />

            {/* 사용자 메뉴 — DropdownMenu 기반 */}
            <div className="hidden lg:block bg-transparent">
              <UserMenuProvider
                user={userMenuData}
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
              >
                <UserMenuRoot>
                  <UserMenuItem icon={BarChart3} href="/dashboard">
                    마이페이지
                  </UserMenuItem>
                  <UserMenuItem icon={ShoppingBag} href="/orders">
                    주문 내역
                  </UserMenuItem>
                  <UserMenuItem icon={User} href="/profile">
                    프로필
                  </UserMenuItem>
                  <UserMenuItem icon={Settings} href="/settings">
                    설정
                  </UserMenuItem>
                  <UserMenuSeparator />
                  <UserMenuLogout />
                </UserMenuRoot>
              </UserMenuProvider>
            </div>

            {/* 모바일 메뉴 토글 */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-foreground bg-transparent hover:bg-accent"
              onClick={toggleMenu}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>

            {/* 테마 토글 */}
            <div className="bg-transparent [&_button]:bg-transparent [&_button]:hover:bg-accent [&_button]:border-border">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={closeMenu}
          navigationItems={navigationItems}
          companyMenuItems={companyMenuItems.map((item) => ({
            label: item.title,
            href: item.href,
            icon: item.icon,
            description: item.description,
          }))}
          starcoexServices={STARCOEX_SERVICES}
          isActivePath={isActivePath}
          user={userMenuData}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
};

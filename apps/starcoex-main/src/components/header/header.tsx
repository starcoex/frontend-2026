import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  Building2,
  CreditCard,
  Menu,
  Phone,
  Settings,
  Shield,
  Truck,
  User,
  X,
} from 'lucide-react';
import {
  ContactButton,
  StarLogo,
  UserMenuItem,
  UserMenuLogout,
  UserMenuProvider,
  UserMenuRoot,
  UserMenuSeparator,
} from '@starcoex-frontend/common';
import { MobileMenu } from './mobile-menu';
import { toast } from 'sonner';
import { useAuth, usePermissions } from '@starcoex-frontend/auth';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { SERVICES_CONFIG } from '@/app/config/service.config';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated, isLoading, logout, checkAuthStatus } =
    useAuth();
  const {
    isAdmin,
    isSuperAdmin,
    isBusiness,
    isEmailVerified,
    isPhoneVerified,
    isBusinessVerified,
    is2FAEnabled,
  } = usePermissions();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // 초기 인증 상태 확인
  useEffect(() => {
    if (isAuthenticated === null && !isLoading) {
      checkAuthStatus();
    }
  }, [isAuthenticated, isLoading, checkAuthStatus]);

  // 모바일 메뉴 열려있을 때 스크롤 방지
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('로그아웃되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      toast.error('로그아웃 중 오류가 발생했습니다.');
    }
  };

  // UserMenuRoot 내부에 삽입될 커스텀 메뉴 아이템들을 생성하는 컴포넌트
  const CustomUserMenuItems: React.FC = () => {
    const items = [];

    // 대시보드
    items.push(
      <UserMenuItem key="dashboard" icon={BarChart3} href="/dashboard">
        대시보드
      </UserMenuItem>
    );

    // 프로필
    items.push(
      <UserMenuItem key="profile" icon={User} href="/profile">
        프로필 관리
      </UserMenuItem>
    );

    // 관리자 전용 메뉴
    if (isAdmin() || isSuperAdmin()) {
      items.push(
        <UserMenuItem key="admin" icon={Shield} href="/auth/dashboard">
          관리자 패널
        </UserMenuItem>
      );
    }

    // 사업자 전용 메뉴
    if (isBusiness()) {
      items.push(
        <UserMenuItem key="business" icon={Building2} href="/business">
          사업자 관리
        </UserMenuItem>
      );
    }

    // 배송 관련 메뉴
    if (currentUser?.role === 'DELIVERY') {
      items.push(
        <UserMenuItem key="delivery" icon={Truck} href="/delivery">
          배송 관리
        </UserMenuItem>
      );
    }

    // 인증 관련 알림 메뉴
    const verificationItems = [];

    if (!isPhoneVerified()) {
      verificationItems.push(
        <UserMenuItem
          key="verify-phone"
          icon={Phone}
          href="/verify-phone"
          className="text-orange-600"
        >
          휴대폰 인증 필요
        </UserMenuItem>
      );
    }

    if (!is2FAEnabled()) {
      verificationItems.push(
        <UserMenuItem
          key="setup-2fa"
          icon={Shield}
          href="/security"
          className="text-blue-600"
        >
          2단계 인증 설정
        </UserMenuItem>
      );
    }

    if (verificationItems.length > 0) {
      items.push(<UserMenuSeparator key="verification-separator" />);
      items.push(...verificationItems);
    }

    // 일반 설정 메뉴
    items.push(
      <UserMenuSeparator key="settings-separator" />,
      <UserMenuItem key="notifications" icon={Bell} href="/notifications">
        알림 설정
      </UserMenuItem>,
      <UserMenuItem key="billing" icon={CreditCard} href="/billing">
        결제 정보
      </UserMenuItem>,
      <UserMenuItem key="settings" icon={Settings} href="/settings">
        계정 설정
      </UserMenuItem>
    );

    return <>{items}</>;
  };

  return (
    <header className="relative z-50 border-b backdrop-blur-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1" onClick={closeMenu}>
            <StarLogo width={32} height={32} />
            <div className="hidden sm:block">
              <div className="text-xl font-bold">스타코엑스</div>
              <div className="text-xs text-gray-500 -mt-1">STARCOEX</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden items-center gap-8 lg:flex">
            <NavigationMenuList>
              {SERVICES_CONFIG.map((service) => {
                const Icon = service.icon;
                const isActive = location.pathname === service.href;

                return (
                  <NavigationMenuItem key={service.id}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={service.href}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          'flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-200 bg-transparent',
                          isActive
                            ? `${service.color.background} ${service.color.text} shadow-sm`
                            : 'text-foreground hover:text-accent-foreground hover:bg-accent',
                          !service.available && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <Icon
                          className={cn(
                            'w-4 h-4',
                            isActive ? service.color.primary : 'text-current'
                          )}
                        />
                        <span>{service.name}</span>
                        {!service.available && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">
                            준비중
                          </span>
                        )}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Contact Button */}
            <ContactButton
              variant="outline"
              className="hidden md:flex"
              phoneNumber="064-713-2002"
              showText={true}
              textBreakpoint="always"
            />

            {/* 로딩 상태 표시 */}
            {isLoading && (
              <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                <span>로딩 중...</span>
              </div>
            )}

            {/* 데스크톱 사용자 메뉴 - UserMenuRoot 사용 */}
            {!isLoading && (
              <div className="hidden lg:block">
                <UserMenuProvider
                  user={currentUser} // currentUser 직접 전달
                  isAuthenticated={isAuthenticated}
                  mobile={false} // 데스크톱
                  onLogout={async () => {
                    await handleLogout();
                  }}
                >
                  <UserMenuRoot>
                    <CustomUserMenuItems />
                    <UserMenuSeparator />
                    <UserMenuLogout />
                  </UserMenuRoot>
                </UserMenuProvider>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-foreground"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>

            {/* 테마 토글 - 투명 배경으로 래핑 */}
            <div className="bg-transparent [&_button]:bg-transparent [&_button]:hover:bg-accent [&_button]:border-border">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={closeMenu}
          user={currentUser}
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
          onLogout={handleLogout}
          authStatus={{
            isEmailVerified: isEmailVerified(),
            isPhoneVerified: isPhoneVerified(),
            isBusinessVerified: isBusinessVerified(),
            is2FAEnabled: is2FAEnabled(),
            isAdmin: isAdmin(),
            isBusiness: isBusiness(),
          }}
        />
      </div>
    </header>
  );
};

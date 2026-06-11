import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import {
  ContactButton,
  StarLogo,
  UserMenuLogout,
  UserMenuProvider,
  UserMenuRoot,
  UserMenuSeparator,
} from '@starcoex-frontend/common';
import { toast } from 'sonner';
import { useAuth, usePermissions } from '@starcoex-frontend/auth';
import { SERVICES_CONFIG } from '@/app/config/service.config';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { CompanyNavDropdown } from '@/components/header/company-nav-dropdown';
import { MobileMenu } from '@/components/header/mobile-menu';
import { CustomUserMenuItems } from '@/components/header/custom-user-menu-items';

interface HeaderProps {
  sidebarToggle?: React.ReactNode; // ★ 추가
}

export const Header: React.FC<HeaderProps> = ({ sidebarToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated, isLoading, logout, checkAuthStatus } =
    useAuth();
  const { isAdmin, isSuperAdmin, isBusiness, isPhoneVerified, is2FAEnabled } =
    usePermissions();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  useEffect(() => {
    if (isAuthenticated === null && !isLoading) {
      checkAuthStatus();
    }
  }, [isAuthenticated, isLoading, checkAuthStatus]);

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

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
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

  return (
    <header className="relative z-50 border-b backdrop-blur-sm">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <Link to="/" className="flex items-center gap-1" onClick={closeMenu}>
            {sidebarToggle} {/* ★ 햄버거 버튼 (로그인 시에만 전달됨) */}
            <StarLogo width={32} height={32} />
            <div className="hidden sm:block">
              <div className="text-xl font-bold">스타코엑스</div>
              <div className="text-xs text-gray-500 -mt-1">STARCOEX</div>
            </div>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* 회사소개 드롭다운 */}
            <CompanyNavDropdown />

            {/* 서비스 목록 — 단순 Link 버튼 */}
            {SERVICES_CONFIG.map((service) => {
              const Icon = service.icon;
              const isActive = location.pathname === service.href;

              return (
                <Link
                  key={service.id}
                  to={service.href}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
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
              );
            })}
          </div>

          {/* 우측 액션 영역 */}
          <div className="flex items-center space-x-3">
            {/* 연락처 버튼 */}
            <ContactButton
              variant="outline"
              className="hidden md:flex"
              phoneNumber="064-713-2002"
              showText={true}
              textBreakpoint="always"
            />

            {/* 로딩 상태 */}
            {isLoading && (
              <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                <span>로딩 중...</span>
              </div>
            )}

            {/* 데스크톱 사용자 메뉴 */}
            {!isLoading && (
              <div className="hidden lg:block">
                <UserMenuProvider
                  user={currentUser}
                  isAuthenticated={isAuthenticated}
                  mobile={false}
                  onLogout={handleLogout}
                >
                  <UserMenuRoot>
                    <CustomUserMenuItems
                      currentUser={currentUser}
                      isAdmin={isAdmin}
                      isSuperAdmin={isSuperAdmin}
                      isBusiness={isBusiness}
                      isPhoneVerified={isPhoneVerified}
                      is2FAEnabled={is2FAEnabled}
                    />
                    <UserMenuSeparator />
                    <UserMenuLogout />
                  </UserMenuRoot>
                </UserMenuProvider>
              </div>
            )}

            {/* 모바일 메뉴 토글 */}
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

            {/* 테마 토글 */}
            <div className="bg-transparent [&_button]:bg-transparent [&_button]:hover:bg-accent [&_button]:border-border">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={closeMenu}
          currentUser={currentUser}
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
          onLogout={handleLogout}
          isAdmin={isAdmin}
          isSuperAdmin={isSuperAdmin}
          isBusiness={isBusiness}
          isPhoneVerified={isPhoneVerified}
          is2FAEnabled={is2FAEnabled}
        />
      </div>
    </header>
  );
};

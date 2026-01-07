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
} from 'lucide-react';
import { MobileMenu } from './mobile-menu';
import {
  ContactButton,
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
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { HeaderServicesDropdown } from '@/components/header/components/header-services-dropdown';
import { STARCOEX_SERVICES } from '@/app/utils/brand-constants';
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';

// 타입 정의
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

// User를 UserMenuData로 변환하는 함수
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

  // User를 UserMenuData로 변환
  const userMenuData = convertToUserMenuData(currentUser);

  // 모바일 메뉴 열려있을 때 스크롤 방지
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

  // 메뉴 데이터 정의
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

  // 구매 메뉴 아이템 정의
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
    if (path === '/') {
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

          {/* 데스크톱 네비게이션 */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* 주요 메뉴들 */}
            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.href);

                  return (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={item.href}
                          className={cn(
                            'bg-transparent hover:bg-accent flex flex-row items-center px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md border-0 whitespace-nowrap',
                            isActive
                              ? 'bg-accent text-accent-foreground shadow-sm'
                              : 'text-foreground hover:text-accent-foreground'
                          )}
                        >
                          <Icon className="w-4 h-4 mr-1" />
                          <span>{item.label}</span>
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}

                {/* [NEW] 구매 드롭다운 메뉴 추가 */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-accent text-foreground hover:text-accent-foreground">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    구매
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/membership"
                          >
                            <Crown className="h-6 w-6 mb-3" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              회원 등급 안내
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              WELCOME, GREEN, GOLD 등급별 특별한 혜택을
                              확인하세요.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      {purchaseMenuItems.map((item) => (
                        <li key={item.title}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={item.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="flex items-center gap-2 text-sm font-medium leading-none">
                                <item.icon className="h-4 w-4" />
                                {item.title}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground pl-6">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* 회사 정보 드롭다운 */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground border-0">
                    <Building2 className="w-4 h-4 mr-2" />
                    회사 정보
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-background border-border">
                    <div className="w-[400px] p-3">
                      <ul className="space-y-1">
                        {companyMenuItems.map((item) => (
                          <li key={item.title}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={item.href}
                                className="group flex select-none items-start gap-3 rounded-md p-3 leading-none no-underline outline-none transition-colors bg-transparent hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <item.icon className="mt-1 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
                                <div className="space-y-1">
                                  <div className="text-sm font-medium text-foreground group-hover:text-accent-foreground transition-colors">
                                    {item.title}
                                  </div>
                                  <p className="line-clamp-2 text-sm text-muted-foreground group-hover:text-accent-foreground transition-colors">
                                    {item.description}
                                  </p>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* 다른 서비스 드롭다운 */}
            <HeaderServicesDropdown
              services={STARCOEX_SERVICES}
              onServiceClick={(service) => {
                // 커스텀 클릭 핸들러 (선택사항)
                console.log(`${service.title} 클릭됨`);
                window.open(service.href, '_blank');
              }}
            />
          </div>

          {/* 우측 액션 영역 */}
          <div className="flex items-center space-x-3">
            {/* 알림 드롭다운 - Provider Context 사용 */}
            {/*{isAuthenticated && (*/}
            {/*  <NotificationDropdown*/}
            {/*    onViewAll={() => navigate('/notifications')}*/}
            {/*    onSettings={() => navigate('/notification-settings')}*/}
            {/*  />*/}
            {/*)}*/}

            {/* 장바구니 드롭다운 - Provider Context 사용 */}
            {/*{isAuthenticated && (*/}
            {/*  <CartDropdown onViewCart={() => navigate('/cart')} />*/}
            {/*)}*/}

            {/* 연락처 버튼 - 공통 컴포넌트 사용 */}
            <ContactButton
              variant="outline"
              className="hidden md:flex"
              phoneNumber="064-713-2002"
              showText={true}
              textBreakpoint="always"
            />

            {/* 사용자 메뉴 */}
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
                  <UserMenuItem icon={User} href="/profile">
                    프로필
                  </UserMenuItem>
                  <UserMenuItem icon={Settings} href="/settings">
                    설정
                  </UserMenuItem>
                  <UserMenuItem icon={Settings} href="/settings">
                    2fa
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
          starcoexServices={STARCOEX_SERVICES} // otherServices 대신 starcoexServices 사용
          isActivePath={isActivePath}
          user={userMenuData}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
};

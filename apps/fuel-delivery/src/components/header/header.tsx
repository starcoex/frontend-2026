import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  User,
  LogOut,
  Package,
  MapPin,
  Phone,
  HelpCircle,
  Truck,
  ShoppingCart,
  Home,
  Settings,
} from 'lucide-react';
import { useAuth } from '@starcoex-frontend/auth';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const Header: React.FC = () => {
  const { isAuthenticated, logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 모바일 메뉴 닫기
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      closeMobileMenu();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // 네비게이션 메뉴
  const navigationItems = [
    {
      label: '서비스 지역',
      href: '/areas',
      description: '배송 가능한 지역을 확인하세요',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      label: '상품 안내',
      href: '/products',
      description: '난방유 종류와 특징을 알아보세요',
      icon: <Package className="h-4 w-4" />,
    },
    {
      label: '요금 안내',
      href: '/pricing',
      description: '투명한 가격 정책을 확인하세요',
      icon: <ShoppingCart className="h-4 w-4" />,
    },
  ];

  // 고객 지원 메뉴
  const supportItems = [
    {
      label: '고객센터',
      href: '/help',
      description: '도움이 필요하신가요?',
      icon: <HelpCircle className="h-4 w-4" />,
    },
    {
      label: 'FAQ',
      href: '/faq',
      description: '자주 묻는 질문',
      icon: <HelpCircle className="h-4 w-4" />,
    },
    {
      label: '문의하기',
      href: '/contact',
      description: '직접 문의해 주세요',
      icon: <Phone className="h-4 w-4" />,
    },
  ];

  // 사용자 메뉴 (로그인 상태)
  const currentUserMenuItems = [
    {
      label: '내 정보',
      href: '/profile',
      icon: <User className="h-4 w-4" />,
    },
    {
      label: '주문 내역',
      href: '/profile/orders',
      icon: <Package className="h-4 w-4" />,
    },
    {
      label: '정기 배송',
      href: '/profile/subscriptions',
      icon: <Truck className="h-4 w-4" />,
    },
    {
      label: '설정',
      href: '/profile/settings',
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-orange-200'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-orange-900">
                스타코엑스
              </div>
              <div className="text-xs text-orange-600 -mt-1">난방유 배달</div>
            </div>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                {/* 서비스 메뉴 */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-orange-600">
                    서비스
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-orange-500/20 to-red-500/20 p-6 no-underline outline-none focus:shadow-md"
                            to="/order"
                          >
                            <Truck className="h-6 w-6 text-orange-600" />
                            <div className="mb-2 mt-4 text-lg font-medium text-orange-900">
                              지금 주문하기
                            </div>
                            <p className="text-sm leading-tight text-orange-700">
                              빠르고 안전한 난방유 배송 서비스를 경험해보세요
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      {navigationItems.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-orange-50 hover:text-orange-900 focus:bg-orange-50 focus:text-orange-900"
                              to={item.href}
                            >
                              <div className="flex items-center gap-2 text-sm font-medium leading-none">
                                {item.icon}
                                {item.label}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-gray-600">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 배송 추적 */}
                <NavigationMenuItem>
                  <Link
                    to="/tracking"
                    className={`text-sm font-medium transition-colors hover:text-orange-600 ${
                      isActivePath('/tracking')
                        ? 'text-orange-600'
                        : 'text-gray-700'
                    }`}
                  >
                    배송 추적
                  </Link>
                </NavigationMenuItem>

                {/* 고객 지원 */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-orange-600">
                    고객 지원
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 w-[400px]">
                      {supportItems.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              className="flex items-start space-x-3 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-orange-50 hover:text-orange-900 focus:bg-orange-50 focus:text-orange-900"
                              to={item.href}
                            >
                              <div className="text-orange-600 mt-1">
                                {item.icon}
                              </div>
                              <div>
                                <div className="text-sm font-medium leading-none mb-1">
                                  {item.label}
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-gray-600">
                                  {item.description}
                                </p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* 우측 액션 버튼들 */}
          <div className="flex items-center gap-4">
            {/* 긴급 주문 버튼 */}
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hidden sm:flex border-red-300 text-red-700 hover:bg-red-50"
            >
              <Link to="/emergency">
                <Phone className="w-4 h-4 mr-2" />
                긴급 주문
              </Link>
            </Button>

            {/* 로그인/사용자 메뉴 */}
            {isAuthenticated && currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8 border-2 border-orange-200">
                      <AvatarFallback className="bg-orange-100 text-orange-900 font-medium">
                        {currentUser.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {/* 알림 배지 (예시) */}
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                      2
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {currentUserMenuItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link to={item.href} className="flex items-center gap-2">
                        {item.icon}
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth/login">로그인</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link
                    to="/auth/register"
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    회원가입
                  </Link>
                </Button>
              </div>
            )}

            {/* 주문 버튼 (인증 사용자용) */}
            {isAuthenticated && (
              <Button
                size="sm"
                asChild
                className="hidden sm:flex bg-orange-600 hover:bg-orange-700"
              >
                <Link to="/order">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  주문하기
                </Link>
              </Button>
            )}

            {/* 모바일 메뉴 버튼 */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-orange-200 bg-white/95 backdrop-blur-md">
            <div className="py-4 space-y-4">
              {/* 로그인/회원가입 (비로그인 시) */}
              {!isAuthenticated && (
                <div className="flex gap-3 px-4 pb-4 border-b border-orange-100">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1"
                  >
                    <Link to="/auth/login" onClick={closeMobileMenu}>
                      로그인
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    <Link to="/auth/register" onClick={closeMobileMenu}>
                      회원가입
                    </Link>
                  </Button>
                </div>
              )}

              {/* 사용자 정보 (로그인 시) */}
              {isAuthenticated && currentUser && (
                <div className="px-4 pb-4 border-b border-orange-100">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10 border-2 border-orange-200">
                      <AvatarFallback className="bg-orange-100 text-orange-900">
                        {currentUser.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-orange-900">
                        {currentUser.name}
                      </div>
                      <div className="text-sm text-orange-600">
                        {currentUser.email}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      size="sm"
                      asChild
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Link to="/order" onClick={closeMobileMenu}>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        주문하기
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-red-300 text-red-700"
                    >
                      <Link to="/emergency" onClick={closeMobileMenu}>
                        <Phone className="w-4 h-4 mr-2" />
                        긴급 주문
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

              {/* 네비게이션 메뉴 */}
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    isActivePath('/')
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  <Home className="w-4 h-4" />홈
                </Link>

                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      isActivePath(item.href)
                        ? 'text-orange-600 bg-orange-50'
                        : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}

                <Link
                  to="/tracking"
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    isActivePath('/tracking')
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  배송 추적
                </Link>

                {/* 고객 지원 메뉴 */}
                <div className="border-t border-orange-100 mt-2 pt-2">
                  {supportItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        isActivePath(item.href)
                          ? 'text-orange-600 bg-orange-50'
                          : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* 사용자 메뉴 (로그인 시) */}
                {isAuthenticated && (
                  <div className="border-t border-orange-100 mt-2 pt-2">
                    {currentUserMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={closeMobileMenu}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                          isActivePath(item.href)
                            ? 'text-orange-600 bg-orange-50'
                            : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

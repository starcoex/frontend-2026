import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAuth } from '@starcoex-frontend/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { StarOilLogo, ThemeToggle } from '@starcoex-frontend/common';

const HEADER_HEIGHT = 64;

const NAV_ITEMS = [
  { label: '빠른 주문', href: '/order' }, // features — 웹앱 신속 주문
  { label: '정량 보장', href: '/guarantee' }, // integrations → 정량 속임 문제 강조
  { label: '배송 추적', href: '/tracking' }, // 핵심 장점
  { label: '회사 소개', href: '/about' },
  { label: '요금 안내', href: '/pricing' },
  { label: '고객센터', href: '/contacts' },
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', isMenuOpen);
    return () => document.body.classList.remove('overflow-hidden');
  }, [isMenuOpen]);

  // ── 모바일 패널 높이 애니메이션 ─────────────────────────────────────────────
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState<number | 'auto'>(0);
  const [minOpenHeight, setMinOpenHeight] = useState<number>(0);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const viewportRemainder = Math.max(0, window.innerHeight - HEADER_HEIGHT);
    setMinOpenHeight(viewportRemainder);

    const onEnd = () => {
      if (isMenuOpen) setPanelHeight('auto');
      wrapper.removeEventListener('transitionend', onEnd);
    };

    if (isMenuOpen) {
      const target = Math.max(content.scrollHeight, viewportRemainder);
      setPanelHeight(target);
      wrapper.addEventListener('transitionend', onEnd);
    } else {
      const current = wrapper.getBoundingClientRect().height || 0;
      setPanelHeight(current);
      requestAnimationFrame(() => setPanelHeight(0));
    }
  }, [isMenuOpen, location.pathname]);

  useEffect(() => {
    const onResize = () => {
      if (!isMenuOpen || !contentRef.current) return;
      const viewportRemainder = Math.max(0, window.innerHeight - HEADER_HEIGHT);
      setMinOpenHeight(viewportRemainder);
      if (panelHeight !== 'auto') {
        const target = Math.max(
          contentRef.current.scrollHeight,
          viewportRemainder
        );
        setPanelHeight(target);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isMenuOpen, panelHeight]);

  const isActive = (href: string) =>
    href === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(href);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (e) {
      console.error('로그아웃 실패:', e);
    }
  };

  return (
    <header className="bg-background border-border relative z-50 h-16 border-b px-2.5 lg:px-0 sticky top-0">
      {/* ── 공통 헤더 바 ── */}
      <div className="container flex h-16 items-center justify-between lg:grid lg:grid-cols-[auto_1fr_auto]">
        {/* 로고 */}
        <Link to="/" className="flex items-center gap-2">
          <StarOilLogo width={40} height={40} />
          <div className="hidden sm:block leading-none">
            <span className="font-bold text-lg leading-none">난방유 배달</span>
            <Badge
              variant="outline"
              className="block text-[10px] mt-0.5 px-1 py-0 leading-none w-fit"
            >
              by 별표주유소
            </Badge>
          </div>
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden items-center justify-center gap-8 lg:flex">
          {/* 배송 추적 — 강조 항목 */}
          <Link
            to="/tracking"
            className={cn(
              'flex items-center gap-1 text-sm font-medium transition-colors',
              isActive('/tracking')
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Search className="w-3.5 h-3.5" />
            배송 추적
          </Link>

          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 우측 액션 */}
        <div className="flex items-center gap-2.5">
          {isAuthenticated && currentUser ? (
            <>
              {/* 배송 추적 바로가기 (태블릿) */}
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'hidden sm:flex lg:hidden items-center gap-1',
                  'text-muted-foreground hover:text-foreground'
                )}
                onClick={() => navigate('/tracking')}
              >
                <Search className="w-4 h-4" />
              </Button>

              {/* 사용자 아바타 + 이름 */}
              <div className="hidden lg:flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-400 text-white text-xs font-medium">
                    {currentUser.name?.charAt(0) ?? 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {currentUser.name}님
                </span>
              </div>

              <Button
                size="sm"
                variant="outline"
                className={cn('hidden lg:flex')}
                onClick={handleLogout}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className={cn('hidden sm:block lg:block')}>
                <Button size="sm" variant="outline">
                  로그인
                </Button>
              </Link>
              <Link to="/order" className={cn('hidden sm:block lg:block')}>
                <Button size="sm" variant="default">
                  주문하기
                </Button>
              </Link>
            </>
          )}

          <div className="lg:block">
            <ThemeToggle />
          </div>

          {/* 햄버거 버튼 */}
          <button
            className="text-muted-foreground relative flex size-8 lg:hidden"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-expanded={isMenuOpen}
            aria-label="메인 메뉴 열기/닫기"
          >
            <span className="sr-only">메인 메뉴 열기/닫기</span>
            <div className="absolute top-1/2 left-1/2 block w-[18px] -translate-x-1/2 -translate-y-1/2">
              <span
                aria-hidden="true"
                className={cn(
                  'absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out',
                  isMenuOpen ? 'rotate-45' : '-translate-y-1.5'
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  'absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out',
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  'absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out',
                  isMenuOpen ? '-rotate-45' : 'translate-y-1.5'
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {/* ── 모바일 풀블리드 패널 ── */}
      <div className="lg:hidden">
        <div
          ref={wrapperRef}
          style={{
            height: panelHeight === 'auto' ? 'auto' : panelHeight,
            minHeight: isMenuOpen ? `${minOpenHeight}px` : undefined,
            transition: 'height 320ms cubic-bezier(.22,.61,.36,1)',
          }}
          className={cn(
            'border-border bg-background overflow-hidden border-t',
            'relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen'
          )}
          aria-hidden={!isMenuOpen}
        >
          <div
            ref={contentRef}
            className="max-h-[calc(100vh-64px)] overflow-auto"
          >
            <div className="container px-2.5">
              <div className="px-5">
                <nav
                  className={cn(
                    'mt-6 flex flex-col',
                    'transition-[transform,opacity] duration-300',
                    isMenuOpen
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-2 opacity-0'
                  )}
                >
                  {/* 배송 추적 — 모바일 강조 */}
                  <Link
                    to="/tracking"
                    className={cn(
                      'flex items-center gap-2 mb-5 text-lg tracking-[-0.36px]',
                      isActive('/tracking')
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Search className="w-5 h-5" />
                    배송 추적
                    <Badge variant="secondary" className="ml-1 text-[10px]">
                      실시간
                    </Badge>
                  </Link>

                  <div className="flex flex-col gap-6">
                    {NAV_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          'text-lg tracking-[-0.36px]',
                          isActive(item.href)
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-4 mb-6 flex flex-col gap-3">
                    {isAuthenticated && currentUser ? (
                      <>
                        <div className="flex items-center gap-3 py-3 border-t border-border">
                          <Avatar className="w-9 h-9">
                            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-400 text-white text-xs">
                              {currentUser.name?.charAt(0) ?? 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {currentUser.name}님
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {currentUser.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsMenuOpen(false);
                            handleLogout();
                          }}
                        >
                          로그아웃
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/auth/login"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Button
                            className="w-full"
                            size="sm"
                            variant="outline"
                          >
                            로그인
                          </Button>
                        </Link>
                        <Link to="/order" onClick={() => setIsMenuOpen(false)}>
                          <Button
                            className="w-full"
                            size="sm"
                            variant="default"
                          >
                            주문하기
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

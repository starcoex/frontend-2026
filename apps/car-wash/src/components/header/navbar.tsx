import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Car, Gem, LogIn, MapPin, Zap } from 'lucide-react';
import { useAuth } from '@starcoex-frontend/auth';
import {
  ThemeToggle,
  UserMenuProvider,
  UserMenuRoot,
  UserMenuItem,
  UserMenuLogout,
  UserMenuSeparator,
  UserMenuData,
  NotificationBell,
  ZeragaeLogo,
} from '@starcoex-frontend/common';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/app/config/app.config';
import { cn } from '@/lib/utils';

// ── 상수 ─────────────────────────────────────────────────────────────────────

const AUTH_ROUTES: string[] = [
  APP_CONFIG.routes.login,
  APP_CONFIG.routes.register,
];

const NAV_LINKS = [
  { label: '홈', href: APP_CONFIG.routes.home },
  { label: '회사 소개', href: APP_CONFIG.routes.about },
  { label: '가격표', href: APP_CONFIG.routes.pricing },
  { label: '지점 찾기', href: APP_CONFIG.routes.stores },
  { label: '새로운 소식', href: APP_CONFIG.routes.changelog },
];

const SERVICE_ITEMS = [
  {
    label: '⚡ 스피드 존',
    description: '10분 외부 손세차',
    href: APP_CONFIG.routes.speed,
    icon: Zap,
  },
  {
    label: '💎 프리미엄 존',
    description: '전문 디테일링 · 코팅 · PPF',
    href: APP_CONFIG.routes.premium,
    icon: Gem,
  },
  {
    label: '📍 지점 찾기',
    description: '실시간 대기 현황 확인',
    href: APP_CONFIG.routes.stores,
    icon: MapPin,
  },
];

// ── 유틸 ─────────────────────────────────────────────────────────────────────

const convertToUserMenuData = (user: any): UserMenuData | null => {
  if (!user) return null;
  return {
    id: user.id?.toString() ?? '',
    email: user.email ?? '',
    name: user.name ?? '',
    avatar: user.avatarUrl ?? user.avatar?.url ?? undefined,
    userType: user.userType,
    role: user.role ?? undefined,
    isSocialUser: user.isSocialUser ?? false,
  };
};

// ── 모바일 메뉴 ───────────────────────────────────────────────────────────────

function MobileMenu({
  onClose,
  pathname,
  isAuthenticated,
  onLogout,
  navigate,
}: {
  onClose: () => void;
  pathname: string;
  isAuthenticated: boolean | null;
  onLogout: () => void;
  navigate: (path: string) => void;
}) {
  return createPortal(
    <motion.div
      className="bg-background fixed inset-0 z-[9999] flex flex-col"
      initial={{ clipPath: 'circle(0% at 50% 28px)' }}
      animate={{ clipPath: 'circle(200% at 50% 28px)' }}
      exit={{ clipPath: 'circle(0% at 50% 28px)' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* 헤더 */}
      <div className="container flex items-center justify-between py-5">
        <Link
          to={APP_CONFIG.routes.home}
          onClick={onClose}
          className="flex items-center gap-2.5"
        >
          <ZeragaeLogo width={24} height={24} />
        </Link>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground flex items-center rounded-full px-4 py-2 text-sm font-medium tracking-wide transition-colors md:hidden"
        >
          닫기
        </button>
      </div>

      {/* 서비스 메뉴 */}
      <div className="container flex flex-1 flex-col justify-center">
        <p className="text-muted-foreground mb-4 font-mono text-[0.625rem] tracking-wider uppercase">
          서비스
        </p>
        {SERVICE_ITEMS.map((item, i) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.1 + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              to={item.href}
              onClick={onClose}
              className={cn(
                'flex items-baseline gap-4 border-b border-dashed py-5 no-underline transition-colors',
                pathname.startsWith(item.href)
                  ? 'text-cyan-500'
                  : 'text-foreground hover:text-cyan-500'
              )}
            >
              <span className="text-muted-foreground/40 font-mono text-xs">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-bold text-3xl tracking-tight">
                {item.label}
              </span>
            </Link>
          </motion.div>
        ))}

        {/* 일반 메뉴 */}
        {NAV_LINKS.filter((l) => l.href !== '/').map((item, i) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.26 + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              to={item.href}
              onClick={onClose}
              className={cn(
                'flex items-baseline gap-4 border-b border-dashed py-5 no-underline transition-colors',
                pathname === item.href
                  ? 'text-cyan-500'
                  : 'text-foreground hover:text-cyan-500'
              )}
            >
              <span className="text-muted-foreground/40 font-mono text-xs">
                {String(SERVICE_ITEMS.length + i + 1).padStart(2, '0')}
              </span>
              <span className="font-bold text-3xl tracking-tight">
                {item.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* 하단 CTA */}
      <div className="container flex gap-3 pb-10">
        {isAuthenticated ? (
          <>
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => {
                navigate(APP_CONFIG.routes.dashboard);
                onClose();
              }}
            >
              <BarChart3 className="w-4 h-4 mr-1.5" />
              마이페이지
            </Button>
            <Button
              size="lg"
              variant="destructive"
              className="flex-1"
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              로그아웃
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => {
                navigate(APP_CONFIG.routes.login);
                onClose();
              }}
            >
              로그인
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-cyan-600 hover:bg-cyan-500"
              onClick={() => {
                navigate(APP_CONFIG.routes.register);
                onClose();
              }}
            >
              회원가입
            </Button>
          </>
        )}
      </div>
    </motion.div>,
    document.body
  );
}

// ── 메인 Navbar ───────────────────────────────────────────────────────────────

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const { currentUser, isAuthenticated, logout } = useAuth();
  const userMenuData = convertToUserMenuData(currentUser);

  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const lastY = useRef(0);

  const isAuthPage = AUTH_ROUTES.includes(pathname);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const delta = y - lastY.current;
    lastY.current = y;
    if (y < 20) {
      setHidden(false);
    } else if (delta > 3) {
      setHidden(true);
    } else if (delta < -3) {
      setHidden(false);
    }
  });

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate(APP_CONFIG.routes.home);
    } catch (e) {
      console.error('로그아웃 실패:', e);
    }
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === href : pathname.startsWith(href);

  if (isAuthPage) return null;

  return (
    <>
      <motion.nav
        className={cn(
          'fixed inset-x-0 top-0 z-20 py-4 transition-[margin] duration-300 md:py-5'
        )}
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      >
        <div className="container flex justify-center">
          <div className="bg-background/90 border-border/30 flex min-w-[175px] items-center justify-between gap-1 rounded-full border px-1.5 py-1 shadow-sm backdrop-blur-2xl md:min-w-fit md:gap-1 md:px-2 md:py-1.5">
            {/* 로고 */}
            <Link
              to={APP_CONFIG.routes.home}
              className="flex items-center gap-2 rounded-full px-3 py-2"
            >
              <ZeragaeLogo width={24} height={24} />
            </Link>

            {/* 데스크톱 링크 */}
            <div className="hidden items-center md:mx-2 md:flex">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    'rounded-full px-3.5 py-2 text-sm no-underline transition-colors lg:px-4',
                    isActive(item.href)
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* 데스크톱 CTA */}
            <div className="hidden items-center gap-1.5 md:flex">
              <ThemeToggle />

              {isAuthenticated && (
                <NotificationBell
                  onViewAll={() => navigate(APP_CONFIG.routes.notifications)}
                  onNotificationClick={(n) => {
                    if (n.actionUrl) navigate(n.actionUrl);
                  }}
                />
              )}

              {isAuthenticated ? (
                <UserMenuProvider
                  user={userMenuData}
                  isAuthenticated={isAuthenticated}
                  onLogout={handleLogout}
                >
                  <UserMenuRoot>
                    <UserMenuItem
                      icon={BarChart3}
                      href={APP_CONFIG.routes.dashboard}
                    >
                      마이페이지
                    </UserMenuItem>
                    <UserMenuItem icon={Car} href={APP_CONFIG.routes.bookings}>
                      예약 내역
                    </UserMenuItem>
                    <UserMenuSeparator />
                    <UserMenuLogout />
                  </UserMenuRoot>
                </UserMenuProvider>
              ) : (
                <>
                  <Button asChild variant="ghost" className="rounded-full">
                    <Link to={APP_CONFIG.routes.login}>로그인</Link>
                  </Button>
                  <Button
                    asChild
                    className="rounded-full bg-cyan-600 hover:bg-cyan-500"
                  >
                    <Link to={APP_CONFIG.routes.register}>
                      <LogIn className="w-3.5 h-3.5 mr-1.5" />
                      회원가입
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* 모바일 햄버거 */}
            <button
              onClick={() => setOpen(true)}
              className="text-muted-foreground hover:text-foreground flex items-center rounded-full px-4 py-2 text-sm font-medium tracking-wide transition-colors md:hidden"
            >
              메뉴
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <MobileMenu
            onClose={() => setOpen(false)}
            pathname={pathname}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
            navigate={navigate}
          />
        )}
      </AnimatePresence>
    </>
  );
}

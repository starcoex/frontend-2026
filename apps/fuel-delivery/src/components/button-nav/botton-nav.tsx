import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Package,
  Truck,
  MapPin,
  User,
  DollarSign,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';
import { useAuth } from '@starcoex-frontend/auth';

interface BottomNavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  matchPrefix?: string;
}

/** 비로그인 공개 탭 */
const PUBLIC_NAV_ITEMS: BottomNavItem[] = [
  { label: '홈', icon: Home, href: '/' },
  { label: '상품', icon: Package, href: '/products', matchPrefix: '/products' },
  {
    label: '가격',
    icon: DollarSign,
    href: '/pricing',
    matchPrefix: '/pricing',
  },
  { label: '지역', icon: MapPin, href: '/areas', matchPrefix: '/areas' },
  { label: '소개', icon: Info, href: '/about', matchPrefix: '/about' },
];

/** 로그인 후 탭 */
const PROTECTED_NAV_ITEMS: BottomNavItem[] = [
  { label: '홈', icon: Home, href: '/' },
  { label: '주문', icon: Package, href: '/order', matchPrefix: '/order' },
  {
    label: '배송추적',
    icon: Truck,
    href: '/tracking',
    matchPrefix: '/tracking',
  },
  { label: '지역', icon: MapPin, href: '/areas', matchPrefix: '/areas' },
  { label: '내정보', icon: User, href: '/profile', matchPrefix: '/profile' },
];

/** BottomNav를 숨길 경로 */
const HIDDEN_PATH_PREFIXES = [
  '/auth',
  '/order',
  '/tracking',
  '/portal-connect',
];

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isHidden = HIDDEN_PATH_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix)
  );
  if (isHidden) return null;

  const items = isAuthenticated ? PROTECTED_NAV_ITEMS : PUBLIC_NAV_ITEMS;

  const isActive = (item: BottomNavItem): boolean => {
    if (item.href === '/') return location.pathname === '/';
    return location.pathname.startsWith(item.matchPrefix ?? item.href);
  };

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'flex sm:hidden',
        'h-16 items-stretch',
        'bg-background border-t border-border',
        'pb-safe'
      )}
    >
      {items.map((item) => {
        const active = isActive(item);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-0.5',
              'text-xs font-medium transition-colors',
              'min-w-0 px-1 relative',
              active
                ? 'text-orange-500'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-orange-500" />
            )}
            <Icon
              className={cn(
                'h-5 w-5 shrink-0 transition-transform',
                active && 'scale-110'
              )}
            />
            <span className="truncate w-full text-center leading-tight">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

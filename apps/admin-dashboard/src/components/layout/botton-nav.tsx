import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingCart,
  Bell,
  Settings,
  Truck,
  Users,
  Package,
  CalendarDays,
  Wallet,
  ClipboardList,
} from 'lucide-react';
import { useTeamContext } from '@/components/team-provider';
import type { TeamName } from '@/app/types/sidebar-type';
import React from 'react';

interface BottomNavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  matchPrefix?: string; // 활성화 판단용 prefix
}

// 팀별 하단 탭 5개 구성
const BOTTOM_NAV_ITEMS: Record<TeamName | 'DELIVERY_ROLE', BottomNavItem[]> = {
  StarcoexMain: [
    {
      label: '대시보드',
      icon: LayoutDashboard,
      href: '/admin',
      matchPrefix: '/admin',
    },
    {
      label: '사용자',
      icon: Users,
      href: '/admin/users',
      matchPrefix: '/admin/users',
    },
    {
      label: '주문',
      icon: ShoppingCart,
      href: '/admin/orders',
      matchPrefix: '/admin/orders',
    },
    {
      label: '알림',
      icon: Bell,
      href: '/admin/notifications',
      matchPrefix: '/admin/notifications',
    },
    {
      label: '설정',
      icon: Settings,
      href: '/admin/settings',
      matchPrefix: '/admin/settings',
    },
  ],
  StarOil: [
    {
      label: '대시보드',
      icon: LayoutDashboard,
      href: '/admin',
      matchPrefix: '/admin',
    },
    {
      label: '예약',
      icon: CalendarDays,
      href: '/admin/reservations',
      matchPrefix: '/admin/reservations',
    },
    {
      label: '주문',
      icon: ShoppingCart,
      href: '/admin/orders',
      matchPrefix: '/admin/orders',
    },
    {
      label: '재고',
      icon: Package,
      href: '/admin/inventory',
      matchPrefix: '/admin/inventory',
    },
    {
      label: '설정',
      icon: Settings,
      href: '/admin/settings',
      matchPrefix: '/admin/settings',
    },
  ],
  Zeragae: [
    {
      label: '대시보드',
      icon: LayoutDashboard,
      href: '/admin',
      matchPrefix: '/admin',
    },
    {
      label: '예약',
      icon: CalendarDays,
      href: '/admin/reservations',
      matchPrefix: '/admin/reservations',
    },
    {
      label: '주문',
      icon: ShoppingCart,
      href: '/admin/orders',
      matchPrefix: '/admin/orders',
    },
    {
      label: '알림',
      icon: Bell,
      href: '/admin/notifications',
      matchPrefix: '/admin/notifications',
    },
    {
      label: '설정',
      icon: Settings,
      href: '/admin/settings',
      matchPrefix: '/admin/settings',
    },
  ],
  Delivery: [
    {
      label: '대시보드',
      icon: LayoutDashboard,
      href: '/admin/driver/dashboard',
      matchPrefix: '/admin/driver/dashboard',
    },
    {
      label: '배송목록',
      icon: Truck,
      href: '/admin/driver/deliveries',
      matchPrefix: '/admin/driver/deliveries',
    },
    {
      label: '진행중',
      icon: Package,
      href: '/admin/driver/active',
      matchPrefix: '/admin/driver/active',
    },
    {
      label: '건의사항',
      icon: ClipboardList,
      href: '/admin/suggestions',
      matchPrefix: '/admin/suggestions',
    },
    {
      label: '정산',
      icon: Wallet,
      href: '/admin/driver/settlements',
      matchPrefix: '/admin/driver/settlements',
    },
  ],
  // DELIVERY 역할 전용 (팀과 무관하게 배달기사 메뉴)
  DELIVERY_ROLE: [
    {
      label: '대시보드',
      icon: LayoutDashboard,
      href: '/admin/driver/dashboard',
      matchPrefix: '/admin/driver/dashboard',
    },
    {
      label: '배송목록',
      icon: Truck,
      href: '/admin/driver/deliveries',
      matchPrefix: '/admin/driver/deliveries',
    },
    {
      label: '진행중',
      icon: Package,
      href: '/admin/driver/active',
      matchPrefix: '/admin/driver/active',
    },
    {
      label: '건의사항',
      icon: ClipboardList,
      href: '/admin/suggestions',
      matchPrefix: '/admin/suggestions',
    },
    {
      label: '정산',
      icon: Wallet,
      href: '/admin/driver/settlements',
      matchPrefix: '/admin/driver/settlements',
    },
  ],
};

export const BottomNav = () => {
  const location = useLocation();
  const { currentTeam, userRole } = useTeamContext();

  // DELIVERY 역할은 팀 상관없이 배달기사 메뉴
  const navKey =
    userRole === 'DELIVERY'
      ? 'DELIVERY_ROLE'
      : (currentTeam as TeamName) ?? 'StarcoexMain';

  const items = BOTTOM_NAV_ITEMS[navKey] ?? BOTTOM_NAV_ITEMS['StarcoexMain'];

  const isActive = (item: BottomNavItem): boolean => {
    const prefix = item.matchPrefix ?? item.href;
    // 대시보드는 정확히 일치할 때만 활성화
    if (item.href === '/admin' || item.href === '/admin/driver/dashboard') {
      return location.pathname === item.href;
    }
    return location.pathname.startsWith(prefix);
  };

  return (
    <nav
      className={cn(
        // 모바일에서만 표시
        'fixed bottom-0 left-0 right-0 z-50',
        'flex sm:hidden',
        'h-16 items-stretch',
        'bg-background border-t border-border',
        // iOS Safe Area 대응
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
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {/* 활성화 인디케이터 (상단 바) */}
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" />
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

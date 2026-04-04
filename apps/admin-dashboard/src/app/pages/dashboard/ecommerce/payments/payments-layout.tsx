import { Outlet, useLocation, Link, NavLink } from 'react-router-dom';
import { useMemo } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  PAYMENT_ROUTES,
  PAYMENT_ROUTE_PATTERNS,
} from '@/app/constants/payment-routes';
import {
  PAYMENT_BREADCRUMB_CONFIGS,
  DEFAULT_PAYMENT_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/payment-breadcrumb-config';

// 정적 경로 → Breadcrumb 설정 매핑
const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [PAYMENT_ROUTES.LIST]: PAYMENT_BREADCRUMB_CONFIGS.LIST,
  [PAYMENT_ROUTES.CREATE]: PAYMENT_BREADCRUMB_CONFIGS.CREATE,
  [PAYMENT_ROUTES.STATS]: PAYMENT_BREADCRUMB_CONFIGS.STATS,
};

// 동적 경로 설정 (상세 페이지)
const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  const detailMatch = pathname.match(PAYMENT_ROUTE_PATTERNS.DETAIL);
  if (detailMatch) {
    return {
      label: '결제 상세',
      title: '결제 상세',
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }
  return null;
};

// 목록/통계 탭을 보여줄 경로
const isTabRoute = (pathname: string): boolean =>
  pathname === PAYMENT_ROUTES.LIST || pathname === PAYMENT_ROUTES.STATS;

// 목록/통계가 아닌 하위 경로 (Breadcrumb에 부모 표시)
const isSubRoute = (pathname: string): boolean =>
  pathname !== PAYMENT_ROUTES.LIST;

export const PaymentsLayout = () => {
  const location = useLocation();

  const config = useMemo((): BreadcrumbConfig => {
    const pathname = location.pathname;

    const staticConfig = PATH_TO_CONFIG_MAP[pathname];
    if (staticConfig) return staticConfig;

    const dynamicConfig = getDynamicRouteConfig(pathname);
    if (dynamicConfig) return dynamicConfig;

    return DEFAULT_PAYMENT_BREADCRUMB_CONFIG;
  }, [location.pathname]);

  const showParentBreadcrumb = isSubRoute(location.pathname);
  const showTabs = isTabRoute(location.pathname);

  return (
    <main className="flex h-full flex-1 flex-col p-4">
      <div className="mb-4 flex flex-col gap-4">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {showParentBreadcrumb ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={PAYMENT_ROUTES.LIST}>결제 관리</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {config.showInBreadcrumb && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{config.label}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage>{config.label}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        {/* 타이틀 */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex-none text-2xl font-bold tracking-tight">
            {config.title}
          </CardTitle>
        </div>

        {/* 탭 네비게이션 — 목록·통계 페이지에서만 표시 */}
        {showTabs && (
          <div className="flex gap-1 border-b">
            {[
              { to: PAYMENT_ROUTES.LIST, label: '결제 목록' },
              { to: PAYMENT_ROUTES.STATS, label: '통계' },
            ].map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 text-sm font-medium transition-colors',
                    'border-b-2 -mb-px',
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  )
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

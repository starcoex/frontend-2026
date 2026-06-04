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
import { PrimaryActions } from '@starcoex-frontend/common';
import {
  ADDRESS_ROUTES,
  ADDRESS_ROUTE_PATTERNS,
} from '@/app/constants/address-routes';
import {
  ADDRESS_BREADCRUMB_CONFIGS,
  DEFAULT_ADDRESS_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/address-breadcrumb-config';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [ADDRESS_ROUTES.LIST]: ADDRESS_BREADCRUMB_CONFIGS.LIST,
  [ADDRESS_ROUTES.CREATE]: ADDRESS_BREADCRUMB_CONFIGS.CREATE,
  [ADDRESS_ROUTES.STATS]: ADDRESS_BREADCRUMB_CONFIGS.STATS,
  [ADDRESS_ROUTES.LOGS]: ADDRESS_BREADCRUMB_CONFIGS.LOGS,
};

const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  if (ADDRESS_ROUTE_PATTERNS.DETAIL.test(pathname)) {
    return {
      label: '주소 상세',
      title: '주소 상세',
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }
  return null;
};

const isTabRoute = (pathname: string): boolean =>
  pathname === ADDRESS_ROUTES.LIST ||
  pathname === ADDRESS_ROUTES.STATS ||
  pathname === ADDRESS_ROUTES.LOGS;

const isSubRoute = (pathname: string): boolean =>
  pathname !== ADDRESS_ROUTES.LIST;

export const AddressLayout = () => {
  const location = useLocation();

  const config = useMemo((): BreadcrumbConfig => {
    const { pathname } = location;
    return (
      PATH_TO_CONFIG_MAP[pathname] ??
      getDynamicRouteConfig(pathname) ??
      DEFAULT_ADDRESS_BREADCRUMB_CONFIG
    );
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
                    <Link to={ADDRESS_ROUTES.LIST}>주소 관리</Link>
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

        {/* 타이틀 + 액션 */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex-none text-2xl font-bold tracking-tight">
            {config.title}
          </CardTitle>
          {config.showActions && (
            <PrimaryActions to={ADDRESS_ROUTES.CREATE} label="주소 추가" />
          )}
        </div>

        {/* 탭 네비게이션 */}
        {showTabs && (
          <div className="flex gap-1 border-b">
            {[
              { to: ADDRESS_ROUTES.LIST, label: '주소 목록' },
              { to: ADDRESS_ROUTES.STATS, label: '통계' },
              { to: ADDRESS_ROUTES.LOGS, label: '검색 로그' },
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

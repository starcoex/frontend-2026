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
  ANALYTICS_ROUTES,
  ANALYTICS_ROUTE_PATTERNS,
} from '@/app/constants/analytics-routes';
import {
  ANALYTICS_BREADCRUMB_CONFIGS,
  DEFAULT_ANALYTICS_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/analytics-breadcrumb-config';

// ─── 경로 → 설정 맵 ──────────────────────────────────────────────────────────

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [ANALYTICS_ROUTES.OVERVIEW]: ANALYTICS_BREADCRUMB_CONFIGS.OVERVIEW,
  [ANALYTICS_ROUTES.REALTIME]: ANALYTICS_BREADCRUMB_CONFIGS.REALTIME,
  [ANALYTICS_ROUTES.RANKING]: ANALYTICS_BREADCRUMB_CONFIGS.RANKING,
  [ANALYTICS_ROUTES.SERVICE]: ANALYTICS_BREADCRUMB_CONFIGS.SERVICE,
  [ANALYTICS_ROUTES.ADMIN]: ANALYTICS_BREADCRUMB_CONFIGS.ADMIN,
};

const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  if (ANALYTICS_ROUTE_PATTERNS.USER_DETAIL.test(pathname)) {
    return {
      label: '사용자 상세 분석',
      title: '사용자 상세 분석',
      showInBreadcrumb: true,
      showActions: false,
    };
  }
  return null;
};

const TAB_PATHS = new Set<string>([
  ANALYTICS_ROUTES.OVERVIEW,
  ANALYTICS_ROUTES.REALTIME,
  ANALYTICS_ROUTES.RANKING,
  ANALYTICS_ROUTES.SERVICE,
  ANALYTICS_ROUTES.ADMIN,
]);

const TABS = [
  { to: ANALYTICS_ROUTES.OVERVIEW, label: '개요' },
  { to: ANALYTICS_ROUTES.REALTIME, label: '실시간' },
  { to: ANALYTICS_ROUTES.RANKING, label: '랭킹' },
  { to: ANALYTICS_ROUTES.SERVICE, label: '서비스 분석' },
  { to: ANALYTICS_ROUTES.ADMIN, label: '어드민' },
] as const;

// ─── Layout ───────────────────────────────────────────────────────────────────

export const AnalyticsLayout = () => {
  const location = useLocation();

  const config = useMemo((): BreadcrumbConfig => {
    const { pathname } = location;
    return (
      PATH_TO_CONFIG_MAP[pathname] ??
      getDynamicRouteConfig(pathname) ??
      DEFAULT_ANALYTICS_BREADCRUMB_CONFIG
    );
  }, [location.pathname]);

  const isRootPath = location.pathname === ANALYTICS_ROUTES.ROOT;
  const showTabs = TAB_PATHS.has(location.pathname);

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
            {!isRootPath ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={ANALYTICS_ROUTES.ROOT}>시스템 분석</Link>
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

        {/* 탭 네비게이션 */}
        {showTabs && (
          <div className="w-full overflow-x-auto scrollbar-none -mx-1 px-1">
            <div className="flex gap-1 border-b min-w-max">
              {TABS.map((tab) => (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end
                  className={({ isActive }) =>
                    cn(
                      'px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap',
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
          </div>
        )}
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { CardTitle } from '@/components/ui/card';
import {
  LOYALTY_ROUTES,
  LOYALTY_ROUTE_PATTERNS,
} from '@/app/constants/loyalty-routes';
import {
  LOYALTY_BREADCRUMB_CONFIGS,
  DEFAULT_LOYALTY_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/loyalty-breadcrumb-config';
import { useUsers } from '@starcoex-frontend/auth';
import { LoyaltyStats } from '@/app/pages/dashboard/ecommerce/loyalty/components/loyalty-stats';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [LOYALTY_ROUTES.LIST]: LOYALTY_BREADCRUMB_CONFIGS.LIST,
  [LOYALTY_ROUTES.SETTINGS]: LOYALTY_BREADCRUMB_CONFIGS.SETTINGS,
  [LOYALTY_ROUTES.STAR_EVENTS]: LOYALTY_BREADCRUMB_CONFIGS.STAR_EVENTS,
  [LOYALTY_ROUTES.STAR_HISTORY]: LOYALTY_BREADCRUMB_CONFIGS.STAR_HISTORY,
};

const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  const detailMatch = pathname.match(LOYALTY_ROUTE_PATTERNS.DETAIL);
  if (detailMatch) {
    return {
      label: `회원 등급 상세 #${detailMatch[1]}`,
      title: `회원 등급 상세`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }
  return null;
};

export const LoyaltyLayout = () => {
  const location = useLocation();
  const { users, fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const config = useMemo((): BreadcrumbConfig => {
    const pathname = location.pathname;
    const staticConfig = PATH_TO_CONFIG_MAP[pathname];
    if (staticConfig) return staticConfig;

    const dynamicConfig = getDynamicRouteConfig(pathname);
    if (dynamicConfig) return dynamicConfig;

    return DEFAULT_LOYALTY_BREADCRUMB_CONFIG;
  }, [location.pathname]);

  return (
    <main className="flex h-full flex-1 flex-col p-4">
      <div className="mb-4 flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin">홈</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {config.showInBreadcrumb && (
              <BreadcrumbItem>
                <BreadcrumbPage>{config.label}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex-none text-2xl font-bold tracking-tight">
            {config.title}
          </CardTitle>
        </div>

        {config.showStats && <LoyaltyStats users={users} />}
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

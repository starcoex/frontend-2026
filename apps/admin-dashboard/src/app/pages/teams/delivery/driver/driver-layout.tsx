import { Outlet, useLocation, Link } from 'react-router-dom';
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
import { DRIVER_ROUTES } from '@/app/constants/teams/driver-routes';
import {
  DRIVER_BREADCRUMB_CONFIGS,
  DEFAULT_DRIVER_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/teams/driver-breadcrumb-config';

// delivery-layout.tsx의 PATH_TO_CONFIG_MAP 패턴 동일
const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [DRIVER_ROUTES.DASHBOARD]: DRIVER_BREADCRUMB_CONFIGS.DASHBOARD,
  [DRIVER_ROUTES.DELIVERIES]: DRIVER_BREADCRUMB_CONFIGS.DELIVERIES,
  [DRIVER_ROUTES.ACTIVE]: DRIVER_BREADCRUMB_CONFIGS.ACTIVE,
  [DRIVER_ROUTES.PROFILE]: DRIVER_BREADCRUMB_CONFIGS.PROFILE,
};

export function DriverLayout() {
  const location = useLocation();

  // delivery-layout.tsx의 config useMemo 패턴 동일
  const config = useMemo((): BreadcrumbConfig => {
    const pathname = location.pathname;
    const staticConfig = PATH_TO_CONFIG_MAP[pathname];
    if (staticConfig) return staticConfig;
    return DEFAULT_DRIVER_BREADCRUMB_CONFIG;
  }, [location.pathname]);

  // delivery-layout.tsx와 동일한 구조
  return (
    <main className="flex h-full flex-1 flex-col p-4">
      <div className="mb-4 flex flex-col gap-4">
        {/* Breadcrumb — delivery-layout.tsx 패턴 동일 */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin">홈</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={DRIVER_ROUTES.DASHBOARD}>배달기사</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {config.showInBreadcrumb &&
              location.pathname !== DRIVER_ROUTES.DASHBOARD && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{config.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
          </BreadcrumbList>
        </Breadcrumb>

        {/* 타이틀 — delivery-layout.tsx 패턴 동일 */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex-none text-2xl font-bold tracking-tight">
            {config.title}
          </CardTitle>
        </div>
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
}

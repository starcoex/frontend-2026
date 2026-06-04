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
import { OVERVIEW_ROUTES } from '@/app/constants/overview-routes';
import { BreadcrumbConfig } from '@/app/constants/analytics-breadcrumb-config';
import {
  DEFAULT_OVERVIEW_BREADCRUMB_CONFIG,
  OVERVIEW_BREADCRUMB_CONFIGS,
} from '@/app/constants/overview-breadcrumb-config';

// ─── 경로 → 설정 맵 ──────────────────────────────────────────────────────────

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [OVERVIEW_ROUTES.DASHBOARD]: OVERVIEW_BREADCRUMB_CONFIGS.DASHBOARD,
};

// ─── Layout ───────────────────────────────────────────────────────────────────

export const OverviewLayout = () => {
  const location = useLocation();

  const config = useMemo((): BreadcrumbConfig => {
    return (
      PATH_TO_CONFIG_MAP[location.pathname] ??
      DEFAULT_OVERVIEW_BREADCRUMB_CONFIG
    );
  }, [location.pathname]);

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
            <BreadcrumbItem>
              <BreadcrumbPage>{config.label}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* 타이틀 */}
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
};

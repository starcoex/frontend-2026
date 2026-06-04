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
import { SALES_ROUTES } from '@/app/constants/sales-routes';
import {
  SALES_BREADCRUMB_CONFIGS,
  DEFAULT_SALES_BREADCRUMB_CONFIG,
} from '@/app/constants/sales-breadcrumb-config';
import { BreadcrumbConfig } from '@/app/constants/analytics-breadcrumb-config';

// ─── 경로 → 설정 맵 ──────────────────────────────────────────────────────────

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [SALES_ROUTES.OVERVIEW]: SALES_BREADCRUMB_CONFIGS.OVERVIEW,
};

// ─── Layout ───────────────────────────────────────────────────────────────────

export const SalesLayout = () => {
  const location = useLocation();

  const config = useMemo((): BreadcrumbConfig => {
    return (
      PATH_TO_CONFIG_MAP[location.pathname] ?? DEFAULT_SALES_BREADCRUMB_CONFIG
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

        {/* 타이틀 + 액션 */}
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

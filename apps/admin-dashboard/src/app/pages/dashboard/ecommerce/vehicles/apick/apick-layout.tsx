import { Outlet, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { APICK_ROUTES } from '@/app/constants/apick-routes';
import {
  APICK_BREADCRUMB_CONFIGS,
  DEFAULT_APICK_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/apick-breadcrumb-config';
import { PageLayout } from '@starcoex-frontend/common';
import { ApickStats } from './components/apick-stats';
import { useApick } from '@starcoex-frontend/vehicles';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [APICK_ROUTES.FLOOD]: APICK_BREADCRUMB_CONFIGS.FLOOD,
  [APICK_ROUTES.SCRAP]: APICK_BREADCRUMB_CONFIGS.SCRAP,
  [APICK_ROUTES.SALE]: APICK_BREADCRUMB_CONFIGS.SALE,
  [APICK_ROUTES.SEARCH]: APICK_BREADCRUMB_CONFIGS.SEARCH,
  [APICK_ROUTES.STATS]: APICK_BREADCRUMB_CONFIGS.STATS,
  [APICK_ROUTES.ACCOUNT]: APICK_BREADCRUMB_CONFIGS.ACCOUNT,
};

export const ApickLayout = () => {
  const location = useLocation();
  const { stats } = useApick();

  const config = useMemo((): BreadcrumbConfig => {
    return (
      PATH_TO_CONFIG_MAP[location.pathname] ?? DEFAULT_APICK_BREADCRUMB_CONFIG
    );
  }, [location.pathname]);

  const breadcrumbs = [
    { label: 'Home', href: '/admin' },
    { label: 'Apick', href: APICK_ROUTES.FLOOD },
    ...(config.showInBreadcrumb ? [{ label: config.label }] : []),
  ];

  return (
    <PageLayout
      breadcrumbs={breadcrumbs}
      title={config.title}
      subContent={config.showTabs ? <ApickStats stats={stats} /> : undefined}
    >
      <Outlet />
    </PageLayout>
  );
};

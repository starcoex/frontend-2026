import { Outlet, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { CAR_CARE_ROUTES } from '@/app/constants/car-care-routes';
import {
  CAR_CARE_BREADCRUMB_CONFIGS,
  DEFAULT_CAR_CARE_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/car-care-breadcrumb-config';
import { PageLayout } from '@starcoex-frontend/common';
import { CarCarePrimaryActions } from '@/app/pages/dashboard/ecommerce/vehicles/car-care/components/car-care-primary-action';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [CAR_CARE_ROUTES.PRICES]: CAR_CARE_BREADCRUMB_CONFIGS.PRICES,
  [CAR_CARE_ROUTES.PRICES_CREATE]: CAR_CARE_BREADCRUMB_CONFIGS.PRICES_CREATE,
  [CAR_CARE_ROUTES.SURCHARGES]: CAR_CARE_BREADCRUMB_CONFIGS.SURCHARGES,
  [CAR_CARE_ROUTES.SURCHARGES_CREATE]:
    CAR_CARE_BREADCRUMB_CONFIGS.SURCHARGES_CREATE,
};

export const CarCareLayout = () => {
  const location = useLocation();
  const isPricesRoute = location.pathname === CAR_CARE_ROUTES.PRICES;

  const config = useMemo((): BreadcrumbConfig => {
    return (
      PATH_TO_CONFIG_MAP[location.pathname] ??
      DEFAULT_CAR_CARE_BREADCRUMB_CONFIG
    );
  }, [location.pathname]);

  const breadcrumbs = isPricesRoute
    ? [{ label: 'Home', href: '/admin' }, { label: config.label }]
    : [
        { label: 'Home', href: '/admin' },
        { label: '세차 가격', href: CAR_CARE_ROUTES.PRICES },
        ...(config.showInBreadcrumb ? [{ label: config.label }] : []),
      ];

  return (
    <PageLayout
      breadcrumbs={breadcrumbs}
      title={config.title}
      actions={config.showActions ? <CarCarePrimaryActions /> : undefined}
    >
      <Outlet />
    </PageLayout>
  );
};

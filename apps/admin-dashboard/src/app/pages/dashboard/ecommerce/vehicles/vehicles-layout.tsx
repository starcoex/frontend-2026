import { Outlet, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import {
  VEHICLE_ROUTES,
  VEHICLE_ROUTE_PATTERNS,
} from '@/app/constants/vehicle-routes';
import {
  VEHICLE_BREADCRUMB_CONFIGS,
  DEFAULT_VEHICLE_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/vehicle-breadcrumb-config';
import { PageLayout } from '@starcoex-frontend/common';
import { VehicleStats } from './components/vehicle-stats';
import { useVehicleManagement } from '@starcoex-frontend/vehicles';
import { VehiclePrimaryActions } from '@/app/pages/dashboard/ecommerce/vehicles/components/vehicle-primary-action';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [VEHICLE_ROUTES.LIST]: VEHICLE_BREADCRUMB_CONFIGS.LIST,
  [VEHICLE_ROUTES.BRANDS]: VEHICLE_BREADCRUMB_CONFIGS.BRANDS,
  [VEHICLE_ROUTES.MODELS]: VEHICLE_BREADCRUMB_CONFIGS.MODELS,
  [VEHICLE_ROUTES.DIMENSION_RULES]: VEHICLE_BREADCRUMB_CONFIGS.DIMENSION_RULES,
  [VEHICLE_ROUTES.PENDING_REVIEW]: VEHICLE_BREADCRUMB_CONFIGS.PENDING_REVIEW,
  [VEHICLE_ROUTES.LOW_CONFIDENCE]: VEHICLE_BREADCRUMB_CONFIGS.LOW_CONFIDENCE,
};

const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  const detailMatch = pathname.match(VEHICLE_ROUTE_PATTERNS.DETAIL);
  if (detailMatch)
    return {
      label: `차량 #${detailMatch[1]}`,
      title: `차량 #${detailMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showTabs: false,
    };
  return null;
};

export const VehiclesLayout = () => {
  const location = useLocation();
  const { vehicles } = useVehicleManagement();
  const isListRoute = location.pathname === VEHICLE_ROUTES.LIST;

  const config = useMemo((): BreadcrumbConfig => {
    return (
      PATH_TO_CONFIG_MAP[location.pathname] ??
      getDynamicRouteConfig(location.pathname) ??
      DEFAULT_VEHICLE_BREADCRUMB_CONFIG
    );
  }, [location.pathname]);

  const breadcrumbs = isListRoute
    ? [{ label: 'Home', href: '/admin' }, { label: config.label }]
    : [
        { label: 'Home', href: '/admin' },
        { label: '차량 관리', href: VEHICLE_ROUTES.LIST },
        ...(config.showInBreadcrumb ? [{ label: config.label }] : []),
      ];

  return (
    <PageLayout
      breadcrumbs={breadcrumbs}
      title={config.title}
      actions={config.showActions ? <VehiclePrimaryActions /> : undefined}
      subContent={
        config.showTabs ? <VehicleStats vehicles={vehicles} /> : undefined
      }
    >
      <Outlet />
    </PageLayout>
  );
};

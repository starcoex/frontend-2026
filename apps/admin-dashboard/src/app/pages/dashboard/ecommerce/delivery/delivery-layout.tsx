import { Outlet, useLocation, Link } from 'react-router-dom';
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
import { useDelivery } from '@starcoex-frontend/delivery';
import { DeliveryPrimaryActions } from './components/delivery-primary-actions';
import { DeliveryStats } from './components/delivery-stats';
import {
  DELIVERY_ROUTES,
  DELIVERY_ROUTE_PATTERNS,
} from '@/app/constants/delivery-routes';
import {
  DELIVERY_BREADCRUMB_CONFIGS,
  DEFAULT_DELIVERY_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/delivery-breadcrumb-config';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [DELIVERY_ROUTES.LIST]: DELIVERY_BREADCRUMB_CONFIGS.LIST,
  [DELIVERY_ROUTES.CREATE]: DELIVERY_BREADCRUMB_CONFIGS.CREATE,
  [DELIVERY_ROUTES.DRIVERS]: DELIVERY_BREADCRUMB_CONFIGS.DRIVERS,
  [DELIVERY_ROUTES.TRACKING]: DELIVERY_BREADCRUMB_CONFIGS.TRACKING,
};

const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  const editMatch = pathname.match(DELIVERY_ROUTE_PATTERNS.EDIT);
  if (editMatch) {
    return {
      label: `배송 수정 #${editMatch[1]}`,
      title: `배송 수정 #${editMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  const detailMatch = pathname.match(DELIVERY_ROUTE_PATTERNS.DETAIL);
  if (detailMatch) {
    return {
      label: `배송 상세 #${detailMatch[1]}`,
      title: `배송 상세 #${detailMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  return null;
};

export const DeliveryLayout = () => {
  const location = useLocation();
  const { deliveries, fetchDeliveries } = useDelivery();

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const config = useMemo((): BreadcrumbConfig => {
    const pathname = location.pathname;
    const staticConfig = PATH_TO_CONFIG_MAP[pathname];
    if (staticConfig) return staticConfig;

    const dynamicConfig = getDynamicRouteConfig(pathname);
    if (dynamicConfig) return dynamicConfig;

    return DEFAULT_DELIVERY_BREADCRUMB_CONFIG;
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
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={DELIVERY_ROUTES.LIST}>배송 관리</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {config.showInBreadcrumb &&
              location.pathname !== DELIVERY_ROUTES.LIST && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{config.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex-none text-2xl font-bold tracking-tight">
            {config.title}
          </CardTitle>
          {config.showActions && <DeliveryPrimaryActions />}
        </div>

        {config.showStats && <DeliveryStats deliveries={deliveries} />}
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

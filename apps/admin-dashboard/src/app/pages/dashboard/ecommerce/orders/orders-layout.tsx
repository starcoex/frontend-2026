import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
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
import {
  ORDER_ROUTES,
  ORDER_ROUTE_PATTERNS,
} from '@/app/constants/order-routes';
import {
  ORDER_BREADCRUMB_CONFIGS,
  DEFAULT_ORDER_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/order-breadcrumb-config';
import { useOrders } from '@starcoex-frontend/orders';
import { OrderPrimaryActions } from '@/app/pages/dashboard/ecommerce/orders/components/order-primary-action';
import { OrderStats } from '@/app/pages/dashboard/ecommerce/orders/components/order-stats';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [ORDER_ROUTES.LIST]: ORDER_BREADCRUMB_CONFIGS.LIST,
  [ORDER_ROUTES.LIST + '/create']: ORDER_BREADCRUMB_CONFIGS.CREATE,
};

const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  const editMatch = pathname.match(/^\/admin\/orders\/(\d+)\/edit$/);
  if (editMatch) {
    return {
      label: `주문 수정 #${editMatch[1]}`,
      title: `주문 수정 #${editMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showTabs: false,
    };
  }

  const detailMatch = pathname.match(ORDER_ROUTE_PATTERNS.DETAIL);
  if (detailMatch) {
    return {
      label: `주문 #${detailMatch[1]}`,
      title: `주문 #${detailMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showTabs: false,
    };
  }

  return null;
};

export const OrdersLayout = () => {
  const location = useLocation();
  const { orders } = useOrders();

  const config = useMemo((): BreadcrumbConfig => {
    const pathname = location.pathname;
    const staticConfig = PATH_TO_CONFIG_MAP[pathname];
    if (staticConfig) return staticConfig;

    const dynamicConfig = getDynamicRouteConfig(pathname);
    if (dynamicConfig) return dynamicConfig;

    return DEFAULT_ORDER_BREADCRUMB_CONFIG;
  }, [location.pathname]);

  return (
    <main className="flex h-full flex-1 flex-col p-4">
      <div className="mb-4 flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin">Home</Link>
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
          <CardTitle className="flex-none text-xl font-bold tracking-tight lg:text-2xl">
            {config.title}
          </CardTitle>
          {config.showActions && <OrderPrimaryActions />}
        </div>
        {config.showTabs && <OrderStats orders={orders} />}
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

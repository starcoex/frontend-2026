import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
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
import { PageLayout } from '@starcoex-frontend/common';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [ORDER_ROUTES.LIST]: ORDER_BREADCRUMB_CONFIGS.LIST,
  [ORDER_ROUTES.LIST + '/create']: ORDER_BREADCRUMB_CONFIGS.CREATE,
  [ORDER_ROUTES.STATS]: ORDER_BREADCRUMB_CONFIGS.STATS,
};

const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  const editMatch = pathname.match(/^\/admin\/orders\/(\d+)\/edit$/);
  if (editMatch)
    return {
      label: `주문 수정 #${editMatch[1]}`,
      title: `주문 수정 #${editMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showTabs: false,
    };
  const detailMatch = pathname.match(ORDER_ROUTE_PATTERNS.DETAIL);
  if (detailMatch)
    return {
      label: `주문 #${detailMatch[1]}`,
      title: `주문 #${detailMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showTabs: false,
    };
  return null;
};

export const OrdersLayout = () => {
  const location = useLocation();
  const { orders, fetchOrders } = useOrders();
  const isListRoute = location.pathname === ORDER_ROUTES.LIST;

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const config = useMemo((): BreadcrumbConfig => {
    return (
      PATH_TO_CONFIG_MAP[location.pathname] ??
      getDynamicRouteConfig(location.pathname) ??
      DEFAULT_ORDER_BREADCRUMB_CONFIG
    );
  }, [location.pathname]);

  // 브레드크럼 구성
  const breadcrumbs = isListRoute
    ? [{ label: 'Home', href: '/admin' }, { label: config.label }]
    : [
        { label: 'Home', href: '/admin' },
        { label: '주문 관리', href: ORDER_ROUTES.LIST },
        ...(config.showInBreadcrumb ? [{ label: config.label }] : []),
      ];

  return (
    <PageLayout
      breadcrumbs={breadcrumbs}
      title={config.title}
      actions={config.showActions ? <OrderPrimaryActions /> : undefined}
      subContent={config.showTabs ? <OrderStats orders={orders} /> : undefined}
    >
      <Outlet />
    </PageLayout>
  );
};

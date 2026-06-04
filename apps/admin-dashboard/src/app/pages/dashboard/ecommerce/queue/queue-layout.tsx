import { Outlet, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import {
  QUEUE_ROUTES,
  QUEUE_ROUTE_PATTERNS,
} from '@/app/constants/queue-routes';
import {
  QUEUE_BREADCRUMB_CONFIGS,
  DEFAULT_QUEUE_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/queue-breadcrumb-config';
import { PageLayout } from '@starcoex-frontend/common';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [QUEUE_ROUTES.LIST]: QUEUE_BREADCRUMB_CONFIGS.LIST,
  [QUEUE_ROUTES.CREATE]: QUEUE_BREADCRUMB_CONFIGS.CREATE, // ← 추가
  [QUEUE_ROUTES.STATS]: QUEUE_BREADCRUMB_CONFIGS.STATS,
};

const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  const editMatch = pathname.match(QUEUE_ROUTE_PATTERNS.EDIT);
  if (editMatch)
    return {
      label: `대기열 수정 #${editMatch[1]}`,
      title: `대기열 수정 #${editMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showTabs: false,
    };
  const detailMatch = pathname.match(QUEUE_ROUTE_PATTERNS.DETAIL);
  if (detailMatch)
    return {
      label: `티켓 #${detailMatch[1]}`,
      title: `티켓 #${detailMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showTabs: false,
    };
  return null;
};

export const QueueLayout = () => {
  const location = useLocation();
  const isListRoute = location.pathname === QUEUE_ROUTES.LIST;

  const config = useMemo((): BreadcrumbConfig => {
    return (
      PATH_TO_CONFIG_MAP[location.pathname] ??
      getDynamicRouteConfig(location.pathname) ??
      DEFAULT_QUEUE_BREADCRUMB_CONFIG
    );
  }, [location.pathname]);

  const breadcrumbs = isListRoute
    ? [{ label: 'Home', href: '/admin' }, { label: config.label }]
    : [
        { label: 'Home', href: '/admin' },
        { label: '대기열 관리', href: QUEUE_ROUTES.LIST },
        ...(config.showInBreadcrumb ? [{ label: config.label }] : []),
      ];

  return (
    <PageLayout
      breadcrumbs={breadcrumbs}
      title={config.title}
      subContent={config.showTabs ? <div /> : undefined}
    >
      <Outlet />
    </PageLayout>
  );
};

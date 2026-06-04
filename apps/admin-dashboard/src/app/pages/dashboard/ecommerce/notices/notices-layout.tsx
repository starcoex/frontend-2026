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
import {
  NOTICES_ROUTES,
  NOTICES_ROUTE_PATTERNS,
} from '@/app/constants/notices-routes';
import {
  NOTICES_BREADCRUMB_CONFIGS,
  DEFAULT_NOTICES_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/notices-breadcrumb-config';
import { useNotices } from '@starcoex-frontend/notices';
import { NoticePrimaryActions } from '@/app/pages/dashboard/ecommerce/notices/components/notice-primary-actions';
import { NoticeStats } from '@/app/pages/dashboard/ecommerce/notices/components/notice-stats';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [NOTICES_ROUTES.LIST]: NOTICES_BREADCRUMB_CONFIGS.LIST,
  [NOTICES_ROUTES.CREATE]: NOTICES_BREADCRUMB_CONFIGS.CREATE,
  [NOTICES_ROUTES.MANUALS]: NOTICES_BREADCRUMB_CONFIGS.MANUALS,
  [NOTICES_ROUTES.MANUAL_CREATE]: NOTICES_BREADCRUMB_CONFIGS.MANUAL_CREATE,
  [NOTICES_ROUTES.CATEGORIES]: NOTICES_BREADCRUMB_CONFIGS.CATEGORIES,
};

const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  if (pathname.match(NOTICES_ROUTE_PATTERNS.NOTICE_EDIT)) {
    const m = pathname.match(NOTICES_ROUTE_PATTERNS.NOTICE_EDIT)!;
    return {
      label: `공지 수정 #${m[1]}`,
      title: `공지 수정 #${m[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }
  if (pathname.match(NOTICES_ROUTE_PATTERNS.NOTICE_DETAIL)) {
    const m = pathname.match(NOTICES_ROUTE_PATTERNS.NOTICE_DETAIL)!;
    return {
      label: `공지 #${m[1]}`,
      title: `공지 #${m[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }
  if (pathname.match(NOTICES_ROUTE_PATTERNS.MANUAL_EDIT)) {
    const m = pathname.match(NOTICES_ROUTE_PATTERNS.MANUAL_EDIT)!;
    return {
      label: `매뉴얼 수정 #${m[1]}`,
      title: `매뉴얼 수정 #${m[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }
  if (pathname.match(NOTICES_ROUTE_PATTERNS.MANUAL_DETAIL)) {
    const m = pathname.match(NOTICES_ROUTE_PATTERNS.MANUAL_DETAIL)!;
    return {
      label: `매뉴얼 #${m[1]}`,
      title: `매뉴얼 #${m[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }
  return null;
};

export const NoticesLayout = () => {
  const location = useLocation();
  const { notices, fetchAdminNotices } = useNotices();

  useEffect(() => {
    fetchAdminNotices({});
  }, [fetchAdminNotices]);

  const config = useMemo((): BreadcrumbConfig => {
    const pathname = location.pathname;
    const staticConfig = PATH_TO_CONFIG_MAP[pathname];
    if (staticConfig) return staticConfig;

    const dynamicConfig = getDynamicRouteConfig(pathname);
    if (dynamicConfig) return dynamicConfig;

    return DEFAULT_NOTICES_BREADCRUMB_CONFIG;
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
                <Link to={NOTICES_ROUTES.LIST}>공지 관리</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {config.showInBreadcrumb &&
              location.pathname !== NOTICES_ROUTES.LIST && (
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
          <CardTitle className="flex-none text-xl font-bold tracking-tight lg:text-2xl">
            {config.title}
          </CardTitle>
          {config.showActions && <NoticePrimaryActions />}
        </div>

        {config.showStats && <NoticeStats notices={notices} />}
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

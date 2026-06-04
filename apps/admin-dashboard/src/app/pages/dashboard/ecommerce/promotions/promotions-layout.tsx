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
  PROMOTION_ROUTES,
  PROMOTION_ROUTE_PATTERNS,
} from '@/app/constants/promotion-routes';
import {
  PROMOTION_BREADCRUMB_CONFIGS,
  DEFAULT_PROMOTION_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/promotion-breadcrumb-config';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [PROMOTION_ROUTES.LIST]: PROMOTION_BREADCRUMB_CONFIGS.LIST,
  [PROMOTION_ROUTES.CREATE]: PROMOTION_BREADCRUMB_CONFIGS.CREATE,
};

const getDynamicConfig = (pathname: string): BreadcrumbConfig | null => {
  const editMatch = pathname.match(PROMOTION_ROUTE_PATTERNS.EDIT);
  if (editMatch) {
    return {
      label: `프로모션 #${editMatch[1]} 수정`,
      title: '프로모션 수정',
      showInBreadcrumb: true,
    };
  }
  const detailMatch = pathname.match(PROMOTION_ROUTE_PATTERNS.DETAIL);
  if (detailMatch) {
    return {
      label: `프로모션 #${detailMatch[1]}`,
      title: '프로모션 상세',
      showInBreadcrumb: true,
    };
  }
  return null;
};

export const PromotionsLayout = () => {
  const location = useLocation();

  const config = useMemo((): BreadcrumbConfig => {
    const pathname = location.pathname;
    const staticConfig = PATH_TO_CONFIG_MAP[pathname];
    if (staticConfig) return staticConfig;

    const dynamicConfig = getDynamicConfig(pathname);
    if (dynamicConfig) return dynamicConfig;

    return DEFAULT_PROMOTION_BREADCRUMB_CONFIG;
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
                <Link to="/admin/promotions">프로모션</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {config.showInBreadcrumb &&
              location.pathname !== PROMOTION_ROUTES.LIST && (
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
        </div>
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
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
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import {
  BreadcrumbConfig,
  DEFAULT_STORE_BREADCRUMB_CONFIG,
  STORE_BREADCRUMB_CONFIGS,
} from '@/app/constants/stores-breadcrumb-config';
import {
  STORE_ROUTE_PATTERNS,
  STORE_ROUTES,
} from '@/app/constants/stores-routes';
import { useStores } from '@starcoex-frontend/stores';
import { StoreStats } from '@/app/pages/dashboard/ecommerce/stores/components/store-stats';
import { BrandStats } from '@/app/pages/dashboard/ecommerce/stores/brands/components/brand-stats';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [STORE_ROUTES.LIST]: STORE_BREADCRUMB_CONFIGS.LIST,
  [STORE_ROUTES.CREATE]: STORE_BREADCRUMB_CONFIGS.CREATE,
  [STORE_ROUTES.BRANDS]: STORE_BREADCRUMB_CONFIGS.BRANDS,
};

const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  const editMatch = pathname.match(STORE_ROUTE_PATTERNS.EDIT);
  if (editMatch) {
    return {
      label: `매장 수정 #${editMatch[1]}`,
      title: `매장 수정 #${editMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  const detailMatch = pathname.match(STORE_ROUTE_PATTERNS.DETAIL);
  if (detailMatch) {
    return {
      label: `매장 #${detailMatch[1]}`,
      title: `매장 상세 #${detailMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  return null;
};

export const StoresLayout = () => {
  const location = useLocation();
  const {
    stores,
    brands,
    statistics,
    fetchStores,
    fetchBrands,
    fetchStatistics,
  } = useStores();

  useEffect(() => {
    Promise.all([fetchStores(), fetchBrands(), fetchStatistics()]);
  }, [fetchStores, fetchBrands, fetchStatistics]);

  const config = useMemo((): BreadcrumbConfig => {
    const pathname = location.pathname;
    const staticConfig = PATH_TO_CONFIG_MAP[pathname];
    if (staticConfig) return staticConfig;

    const dynamicConfig = getDynamicRouteConfig(pathname);
    if (dynamicConfig) return dynamicConfig;

    return DEFAULT_STORE_BREADCRUMB_CONFIG;
  }, [location.pathname]);

  const isBrandPage = location.pathname.includes('/brands');

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
            {config.showInBreadcrumb && (
              <BreadcrumbItem>
                <BreadcrumbPage>{config.label}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex-none text-2xl font-bold tracking-tight">
            {config.title}
          </CardTitle>
          {config.showActions && !isBrandPage && (
            <Button asChild>
              <Link to={STORE_ROUTES.CREATE}>
                <PlusIcon className="mr-2 h-4 w-4" />
                매장 추가
              </Link>
            </Button>
          )}
        </div>

        {config.showStats &&
          (isBrandPage ? (
            <BrandStats brands={brands} stores={stores} />
          ) : (
            <StoreStats stores={stores} statistics={statistics} />
          ))}
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

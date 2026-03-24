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
import { useInventory } from '@starcoex-frontend/inventory';
import { InventoryPrimaryActions } from './components/inventory-primary-actions';
import { InventoryStats } from './components/inventory-stats';
import {
  INVENTORY_ROUTES,
  INVENTORY_ROUTE_PATTERNS,
} from '@/app/constants/inventory-routes';
import {
  INVENTORY_BREADCRUMB_CONFIGS,
  DEFAULT_INVENTORY_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/inventory-breadcrumb-config';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [INVENTORY_ROUTES.LIST]: INVENTORY_BREADCRUMB_CONFIGS.LIST,
  [INVENTORY_ROUTES.LOW_STOCK]: INVENTORY_BREADCRUMB_CONFIGS.LOW_STOCK,
  [INVENTORY_ROUTES.CREATE]: INVENTORY_BREADCRUMB_CONFIGS.CREATE, // ← 추가
};

const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  const editMatch = pathname.match(INVENTORY_ROUTE_PATTERNS.EDIT);
  if (editMatch) {
    return {
      label: `재고 수정 #${editMatch[1]}`,
      title: `재고 수정 #${editMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  const detailMatch = pathname.match(INVENTORY_ROUTE_PATTERNS.DETAIL);
  if (detailMatch) {
    return {
      label: `재고 #${detailMatch[1]}`,
      title: `재고 상세 #${detailMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }
  return null;
};

export const InventoryLayout = () => {
  const location = useLocation();
  const { inventories, fetchLowStockInventories, fetchStoreInventories } =
    useInventory();

  useEffect(() => {
    fetchStoreInventories();
    fetchLowStockInventories();
  }, [fetchStoreInventories, fetchLowStockInventories]);

  const config = useMemo((): BreadcrumbConfig => {
    const pathname = location.pathname;

    const staticConfig = PATH_TO_CONFIG_MAP[pathname];
    if (staticConfig) return staticConfig;

    const dynamicConfig = getDynamicRouteConfig(pathname);
    if (dynamicConfig) return dynamicConfig;

    return DEFAULT_INVENTORY_BREADCRUMB_CONFIG;
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
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={INVENTORY_ROUTES.LIST}>재고 관리</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {config.showInBreadcrumb &&
              location.pathname !== INVENTORY_ROUTES.LIST && (
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
          {config.showActions && <InventoryPrimaryActions />}
        </div>

        {config.showStats && <InventoryStats inventories={inventories} />}
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

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
  PRODUCT_ROUTES,
  PRODUCT_ROUTE_PATTERNS,
} from '@/app/constants/product-routes';
import {
  PRODUCT_BREADCRUMB_CONFIGS,
  DEFAULT_PRODUCT_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/product-breadcrumb-config';
import { useProducts } from '@starcoex-frontend/products';
import { ProductPrimaryActions } from '@/app/pages/dashboard/ecommerce/products/components/product-primary-actions';
import { ProductStats } from '@/app/pages/dashboard/ecommerce/products/components/product-stats';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [PRODUCT_ROUTES.LIST]: PRODUCT_BREADCRUMB_CONFIGS.LIST,
  [PRODUCT_ROUTES.CREATE]: PRODUCT_BREADCRUMB_CONFIGS.CREATE,
};

const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  const editMatch = pathname.match(PRODUCT_ROUTE_PATTERNS.EDIT);
  if (editMatch) {
    return {
      label: `Edit Product #${editMatch[1]}`,
      title: `Edit Product #${editMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  const detailMatch = pathname.match(PRODUCT_ROUTE_PATTERNS.DETAIL);
  if (detailMatch) {
    return {
      label: `Product #${detailMatch[1]}`,
      title: `Product Details #${detailMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  return null;
};

export const ProductsLayout = () => {
  const location = useLocation();
  const { products } = useProducts();

  const config = useMemo((): BreadcrumbConfig => {
    const pathname = location.pathname;
    const staticConfig = PATH_TO_CONFIG_MAP[pathname];
    if (staticConfig) return staticConfig;

    const dynamicConfig = getDynamicRouteConfig(pathname);
    if (dynamicConfig) return dynamicConfig;

    return DEFAULT_PRODUCT_BREADCRUMB_CONFIG;
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
          <CardTitle className="flex-none text-2xl font-bold tracking-tight">
            {config.title}
          </CardTitle>
          {config.showActions && <ProductPrimaryActions />}
        </div>

        {config.showStats && <ProductStats products={products} />}
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

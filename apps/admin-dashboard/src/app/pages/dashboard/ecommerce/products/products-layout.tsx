import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
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
import { PageLayout } from '@starcoex-frontend/common';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [PRODUCT_ROUTES.LIST]: PRODUCT_BREADCRUMB_CONFIGS.LIST,
  [PRODUCT_ROUTES.CREATE]: PRODUCT_BREADCRUMB_CONFIGS.CREATE,
  [PRODUCT_ROUTES.SCAN]: PRODUCT_BREADCRUMB_CONFIGS.SCAN,
  [PRODUCT_ROUTES.INVENTORY]: PRODUCT_BREADCRUMB_CONFIGS.INVENTORY,
  [PRODUCT_ROUTES.SETTINGS]: PRODUCT_BREADCRUMB_CONFIGS.SETTINGS,
};

const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  if (pathname.match(PRODUCT_ROUTE_PATTERNS.EDIT))
    return {
      label: '제품 수정',
      title: '제품 수정',
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  if (pathname.match(PRODUCT_ROUTE_PATTERNS.DETAIL))
    return {
      label: '제품 상세',
      title: '제품 상세',
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  return null;
};

export const ProductsLayout = () => {
  const location = useLocation();
  const { products, fetchProducts, fetchProductTypes } = useProducts();

  useEffect(() => {
    fetchProducts();
    fetchProductTypes();
  }, [fetchProducts, fetchProductTypes]);

  const config = useMemo((): BreadcrumbConfig => {
    return (
      PATH_TO_CONFIG_MAP[location.pathname] ??
      getDynamicRouteConfig(location.pathname) ??
      DEFAULT_PRODUCT_BREADCRUMB_CONFIG
    );
  }, [location.pathname]);

  const breadcrumbs = config.showInBreadcrumb
    ? [
        { label: '홈', href: '/admin' },
        { label: '제품 관리', href: PRODUCT_ROUTES.LIST },
        { label: config.label },
      ]
    : [{ label: '홈', href: '/admin' }, { label: config.label }];

  return (
    <PageLayout
      breadcrumbs={breadcrumbs}
      title={config.title}
      actions={config.showActions ? <ProductPrimaryActions /> : undefined}
      subContent={
        config.showStats ? <ProductStats products={products} /> : undefined
      }
    >
      <Outlet />
    </PageLayout>
  );
};

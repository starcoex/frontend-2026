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
import { useCart } from '@starcoex-frontend/cart';
import { CART_ROUTES, CART_ROUTE_PATTERNS } from '@/app/constants/cart-routes';
import {
  CART_BREADCRUMB_CONFIGS,
  DEFAULT_CART_BREADCRUMB_CONFIG,
  type CartBreadcrumbConfig,
} from '@/app/constants/cart-breadcrumb-config';
import { CartStats } from '@/app/pages/dashboard/ecommerce/cart/components/cart-stats';

const PATH_TO_CONFIG_MAP: Record<string, CartBreadcrumbConfig> = {
  [CART_ROUTES.LIST]: CART_BREADCRUMB_CONFIGS.LIST,
};

const getDynamicRouteConfig = (
  pathname: string
): CartBreadcrumbConfig | null => {
  const detailMatch = pathname.match(CART_ROUTE_PATTERNS.DETAIL);
  if (detailMatch) {
    return {
      label: `장바구니 #${detailMatch[1]}`,
      title: `장바구니 상세 #${detailMatch[1]}`,
      showInBreadcrumb: true,
      showStats: false,
    };
  }
  return null;
};

const isSubRoute = (pathname: string): boolean => pathname !== CART_ROUTES.LIST;

export const CartLayout = () => {
  const location = useLocation();
  const { fetchMyCart } = useCart();

  useEffect(() => {
    fetchMyCart();
  }, [fetchMyCart]);

  const config = useMemo((): CartBreadcrumbConfig => {
    const pathname = location.pathname;
    const staticConfig = PATH_TO_CONFIG_MAP[pathname];
    if (staticConfig) return staticConfig;

    const dynamicConfig = getDynamicRouteConfig(pathname);
    if (dynamicConfig) return dynamicConfig;

    return DEFAULT_CART_BREADCRUMB_CONFIG;
  }, [location.pathname]);

  const showParentBreadcrumb = isSubRoute(location.pathname);

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
            {showParentBreadcrumb ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={CART_ROUTES.LIST}>장바구니</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {config.showInBreadcrumb && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{config.label}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </>
            ) : (
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
        </div>

        {config.showStats && <CartStats />}
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

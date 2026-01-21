import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { PlusIcon } from 'lucide-react';
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
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  PRODUCT_ROUTES,
  PRODUCT_ROUTE_PATTERNS,
} from '@/app/constants/product-routes';
import {
  PRODUCT_BREADCRUMB_CONFIGS,
  DEFAULT_PRODUCT_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/product-breadcrumb-config';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [PRODUCT_ROUTES.LIST]: PRODUCT_BREADCRUMB_CONFIGS.LIST,
  [PRODUCT_ROUTES.CREATE]: PRODUCT_BREADCRUMB_CONFIGS.CREATE,
};

const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  const editMatch = pathname.match(PRODUCT_ROUTE_PATTERNS.EDIT);
  if (editMatch) {
    const productId = editMatch[1];
    return {
      label: `Edit Product #${productId}`,
      title: `Edit Product #${productId}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  const detailMatch = pathname.match(PRODUCT_ROUTE_PATTERNS.DETAIL);
  if (detailMatch) {
    const productId = detailMatch[1];
    return {
      label: `Product #${productId}`,
      title: `Product Details #${productId}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  return null;
};

// 제품 통계 컴포넌트
const ProductStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Total Sales</CardDescription>
          <CardTitle className="font-display text-2xl lg:text-3xl">
            $30,230
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <span className="text-green-600">+20.1%</span>
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Number of Sales</CardDescription>
          <CardTitle className="font-display text-2xl lg:text-3xl">
            982
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <span className="text-green-600">+5.02</span>
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Affiliate</CardDescription>
          <CardTitle className="font-display text-2xl lg:text-3xl">
            $4,530
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <span className="text-green-600">+3.1%</span>
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Discounts</CardDescription>
          <CardTitle className="font-display text-2xl lg:text-3xl">
            $2,230
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <span className="text-red-600">-3.58%</span>
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
};

// 제품 액션 버튼
const ProductActions = () => {
  return (
    <Button asChild>
      <Link to={PRODUCT_ROUTES.CREATE}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Product
      </Link>
    </Button>
  );
};

export const ProductsLayout = () => {
  const location = useLocation();

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
          {config.showActions && <ProductActions />}
        </div>

        {config.showStats && <ProductStats />}
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

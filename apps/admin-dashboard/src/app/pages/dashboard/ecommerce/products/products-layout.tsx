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
import { useProducts } from '@starcoex-frontend/products';

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
  const { products } = useProducts();

  const stats = useMemo(() => {
    const totalRevenue = products.reduce(
      (sum, p) => sum + p.basePrice * p.orderCount,
      0
    );
    const totalOrders = products.reduce((sum, p) => sum + p.orderCount, 0);
    const featuredCount = products.filter((p) => p.isFeatured).length;
    const lowStockCount = products.filter((p) => p.baseStock < 10).length;

    return { totalRevenue, totalOrders, featuredCount, lowStockCount };
  }, [products]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>총 매출</CardDescription>
          <CardTitle className="font-display text-2xl lg:text-3xl">
            ₩{stats.totalRevenue.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <span className="text-muted-foreground">전체 기간</span>
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>총 주문수</CardDescription>
          <CardTitle className="font-display text-2xl lg:text-3xl">
            {stats.totalOrders.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <span className="text-muted-foreground">전체 기간</span>
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>추천 상품</CardDescription>
          <CardTitle className="font-display text-2xl lg:text-3xl">
            {stats.featuredCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <span className="text-muted-foreground">
                {products.length > 0
                  ? `${Math.round(
                      (stats.featuredCount / products.length) * 100
                    )}%`
                  : '0%'}
              </span>
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>재고 부족</CardDescription>
          <CardTitle className="font-display text-2xl lg:text-3xl">
            {stats.lowStockCount}
          </CardTitle>
          <CardAction>
            <Badge
              variant={stats.lowStockCount > 0 ? 'destructive' : 'outline'}
            >
              {stats.lowStockCount > 0 ? '주의' : '정상'}
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

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
  BreadcrumbConfig,
  DEFAULT_STORE_BREADCRUMB_CONFIG,
  STORE_BREADCRUMB_CONFIGS,
} from '@/app/constants/stores-breadcrumb-config';
import {
  STORE_ROUTE_PATTERNS,
  STORE_ROUTES,
} from '@/app/constants/stores-routes';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [STORE_ROUTES.LIST]: STORE_BREADCRUMB_CONFIGS.LIST,
  [STORE_ROUTES.CREATE]: STORE_BREADCRUMB_CONFIGS.CREATE,
  [STORE_ROUTES.BRANDS]: STORE_BREADCRUMB_CONFIGS.BRANDS,
  [STORE_ROUTES.BRANDS_CREATE]: STORE_BREADCRUMB_CONFIGS.BRANDS_CREATE,
};

const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  const editMatch = pathname.match(STORE_ROUTE_PATTERNS.EDIT);
  if (editMatch) {
    const storeId = editMatch[1];
    return {
      label: `Edit Store #${storeId}`,
      title: `Edit Store #${storeId}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  const detailMatch = pathname.match(STORE_ROUTE_PATTERNS.DETAIL);
  if (detailMatch) {
    const storeId = detailMatch[1];
    return {
      label: `Store #${storeId}`,
      title: `Store Details #${storeId}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  return null;
};

// 매장 통계 컴포넌트
const StoreStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Total Stores</CardDescription>
          <CardTitle className="font-display text-2xl lg:text-3xl">
            24
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <span className="text-green-600">+12.5%</span>
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Active Stores</CardDescription>
          <CardTitle className="font-display text-2xl lg:text-3xl">
            22
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <span className="text-green-600">+8.2%</span>
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Total Orders</CardDescription>
          <CardTitle className="font-display text-2xl lg:text-3xl">
            1,842
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <span className="text-green-600">+15.3%</span>
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Average Rating</CardDescription>
          <CardTitle className="font-display text-2xl lg:text-3xl">
            4.8
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <span className="text-green-600">+0.2</span>
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
};

// 매장 액션 버튼
const StoreActions = () => {
  return (
    <div className="flex gap-2">
      <Button asChild variant="outline">
        <Link to={STORE_ROUTES.BRANDS}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Manage Brands
        </Link>
      </Button>
      <Button asChild>
        <Link to={STORE_ROUTES.CREATE}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Store
        </Link>
      </Button>
    </div>
  );
};

export const StoresLayout = () => {
  const location = useLocation();

  const config = useMemo((): BreadcrumbConfig => {
    const pathname = location.pathname;
    const staticConfig = PATH_TO_CONFIG_MAP[pathname];
    if (staticConfig) return staticConfig;

    const dynamicConfig = getDynamicRouteConfig(pathname);
    if (dynamicConfig) return dynamicConfig;

    return DEFAULT_STORE_BREADCRUMB_CONFIG;
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
          {config.showActions && <StoreActions />}
        </div>

        {config.showStats && <StoreStats />}
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

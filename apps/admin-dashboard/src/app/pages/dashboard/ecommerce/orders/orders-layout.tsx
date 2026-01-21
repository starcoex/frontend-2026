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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ORDER_ROUTES,
  ORDER_ROUTE_PATTERNS,
} from '@/app/constants/order-routes';
import {
  ORDER_BREADCRUMB_CONFIGS,
  DEFAULT_ORDER_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/order-breadcrumb-config';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [ORDER_ROUTES.LIST]: ORDER_BREADCRUMB_CONFIGS.LIST,
  [ORDER_ROUTES.CREATE]: ORDER_BREADCRUMB_CONFIGS.CREATE,
};

const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  const detailMatch = pathname.match(ORDER_ROUTE_PATTERNS.DETAIL);
  if (detailMatch) {
    const orderId = detailMatch[1];
    return {
      label: `Order #${orderId}`,
      title: `Order #${orderId}`,
      showInBreadcrumb: true,
      showActions: false,
      showTabs: false,
    };
  }

  return null;
};

// 주문 액션 버튼
const OrderActions = () => {
  return (
    <Button asChild>
      <Link to={ORDER_ROUTES.CREATE}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Create Order
      </Link>
    </Button>
  );
};

// 주문 탭 컴포넌트
const OrderTabs = () => {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
        <TabsTrigger value="processed">Processed</TabsTrigger>
        <TabsTrigger value="returned">Returned</TabsTrigger>
        <TabsTrigger value="canceled">Canceled</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export const OrdersLayout = () => {
  const location = useLocation();

  const config = useMemo((): BreadcrumbConfig => {
    const pathname = location.pathname;
    const staticConfig = PATH_TO_CONFIG_MAP[pathname];
    if (staticConfig) return staticConfig;

    const dynamicConfig = getDynamicRouteConfig(pathname);
    if (dynamicConfig) return dynamicConfig;

    return DEFAULT_ORDER_BREADCRUMB_CONFIG;
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
          <CardTitle className="flex-none text-xl font-bold tracking-tight lg:text-2xl">
            {config.title}
          </CardTitle>
          {config.showActions && <OrderActions />}
        </div>

        {config.showTabs && <OrderTabs />}
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

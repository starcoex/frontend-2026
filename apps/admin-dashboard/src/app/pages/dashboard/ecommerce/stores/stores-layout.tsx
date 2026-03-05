import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
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
import { useStores } from '@starcoex-frontend/stores';

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
      label: `매장 수정 #${storeId}`,
      title: `매장 수정 #${storeId}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  const detailMatch = pathname.match(STORE_ROUTE_PATTERNS.DETAIL);
  if (detailMatch) {
    const storeId = detailMatch[1];
    return {
      label: `매장 #${storeId}`,
      title: `매장 상세 #${storeId}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  return null;
};

// 매장 통계 컴포넌트 (매장 목록 페이지용 - 4개 카드)
const StoreStats = () => {
  const { statistics, stores, isLoading, error } = useStores();

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardDescription>로딩 중...</CardDescription>
              <CardTitle className="font-display text-2xl lg:text-3xl">
                -
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription className="text-red-600">
              에러: {error}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // 통계 데이터가 없는 경우
  if (!statistics) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>통계 데이터를 불러올 수 없습니다.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const { current, growthRate } = statistics;

  // 클라이언트에서 총 주문 수 계산 (모든 매장의 orderCount 합산)
  const totalOrders = stores.reduce((sum, store) => sum + store.orderCount, 0);

  // 클라이언트에서 평균 평점 계산 (rating이 있는 매장들의 평균)
  const storesWithRating = stores.filter((s) => s.rating !== null);
  const averageRating =
    storesWithRating.length > 0
      ? (
          storesWithRating.reduce(
            (sum, store) => sum + Number(store.rating ?? 0),
            0
          ) / storesWithRating.length
        ).toFixed(1)
      : '0.0';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>전체 매장</CardDescription>
          <CardTitle className="font-display text-2xl lg:text-3xl">
            {current.totalStores}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <span
                className={
                  growthRate.totalStores >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }
              >
                {growthRate.totalStores >= 0 ? '+' : ''}
                {growthRate.totalStores.toFixed(1)}%
              </span>
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>활성 매장</CardDescription>
          <CardTitle className="font-display text-2xl lg:text-3xl">
            {current.activeStores}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <span
                className={
                  growthRate.activeStores >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }
              >
                {growthRate.activeStores >= 0 ? '+' : ''}
                {growthRate.activeStores.toFixed(1)}%
              </span>
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>총 주문 수</CardDescription>
          <CardTitle className="font-display text-2xl lg:text-3xl">
            {totalOrders.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <span className="text-muted-foreground">
                {stores.length > 0
                  ? `평균 ${Math.round(totalOrders / stores.length)}개`
                  : '0개'}
              </span>
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>평균 평점</CardDescription>
          <CardTitle className="font-display text-2xl lg:text-3xl">
            {averageRating}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <span className="text-muted-foreground">
                {storesWithRating.length > 0
                  ? `${storesWithRating.length}개 매장`
                  : '평점 없음'}
              </span>
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
};

// 브랜드 통계 컴포넌트 (브랜드 목록 페이지용 - 4개 카드)
const BrandStats = () => {
  const { totalBrands, activeBrands, stores } = useStores();

  // 활성 브랜드 비율 계산
  const activeBrandsPercent =
    totalBrands > 0 ? ((activeBrands / totalBrands) * 100).toFixed(1) : '0.0';

  // 브랜드별 총 주문 수 (모든 매장의 orderCount 합산)
  const totalOrders = stores.reduce((sum, store) => sum + store.orderCount, 0);

  // 브랜드별 평균 평점 (rating이 있는 매장들의 평균)
  const storesWithRating = stores.filter((s) => s.rating !== null);
  const averageRating =
    storesWithRating.length > 0
      ? (
          storesWithRating.reduce(
            (sum, store) => sum + Number(store.rating ?? 0),
            0
          ) / storesWithRating.length
        ).toFixed(1)
      : '0.0';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>전체 브랜드</CardDescription>
          <CardTitle className="font-display text-2xl lg:text-3xl">
            {totalBrands}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <span className="text-muted-foreground">{totalBrands}개</span>
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>활성 브랜드</CardDescription>
          <CardTitle className="font-display text-2xl lg:text-3xl">
            {activeBrands}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <span className="text-green-600">{activeBrandsPercent}%</span>
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>총 주문 수</CardDescription>
          <CardTitle className="font-display text-2xl lg:text-3xl">
            {totalOrders.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <span className="text-muted-foreground">
                {stores.length > 0
                  ? `매장당 평균 ${Math.round(totalOrders / stores.length)}개`
                  : '0개'}
              </span>
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>평균 평점</CardDescription>
          <CardTitle className="font-display text-2xl lg:text-3xl">
            {averageRating}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <span className="text-muted-foreground">
                {storesWithRating.length > 0
                  ? `${storesWithRating.length}개 매장 기준`
                  : '평점 없음'}
              </span>
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
};

// 매장 액션 버튼 (매장 목록 페이지용)
const StoreActions = () => {
  return (
    <div className="flex gap-2">
      <Button asChild>
        <Link to={STORE_ROUTES.CREATE}>
          <PlusIcon className="mr-2 h-4 w-4" />
          매장 추가
        </Link>
      </Button>
    </div>
  );
};

// 브랜드 액션 버튼 (브랜드 목록 페이지용)
const BrandActions = () => {
  return (
    <div className="flex gap-2">
      <Button asChild>
        <Link to={STORE_ROUTES.BRANDS_CREATE}>
          <PlusIcon className="mr-2 h-4 w-4" />
          브랜드 추가
        </Link>
      </Button>
    </div>
  );
};

export const StoresLayout = () => {
  const location = useLocation();
  const { fetchStores, fetchBrands, fetchStatistics } = useStores();

  // 매장, 브랜드, 통계 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchStores(), fetchBrands(), fetchStatistics()]);
        console.log('✅ 데이터 로드 완료');
      } catch (error) {
        console.error('❌ 데이터 로드 실패:', error);
      }
    };

    loadData();
  }, [fetchStores, fetchBrands, fetchStatistics]);

  const config = useMemo((): BreadcrumbConfig => {
    const pathname = location.pathname;
    const staticConfig = PATH_TO_CONFIG_MAP[pathname];
    if (staticConfig) return staticConfig;

    const dynamicConfig = getDynamicRouteConfig(pathname);
    if (dynamicConfig) return dynamicConfig;

    return DEFAULT_STORE_BREADCRUMB_CONFIG;
  }, [location.pathname]);

  // 브랜드 페이지인지 확인
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
          {config.showActions &&
            (isBrandPage ? <BrandActions /> : <StoreActions />)}
        </div>

        {config.showStats && (isBrandPage ? <BrandStats /> : <StoreStats />)}
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

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
import {
  RESERVATION_ROUTES,
  RESERVATION_ROUTE_PATTERNS,
} from '@/app/constants/reservation-routes';
import {
  RESERVATION_BREADCRUMB_CONFIGS,
  DEFAULT_RESERVATION_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/reservation-breadcrumb-config';
import { useReservations } from '@starcoex-frontend/reservations';
import { ReservationStats } from './components/reservation-stats';
import { ReservationPrimaryActions } from '@/app/pages/dashboard/ecommerce/reservations/components/reservation-primary-actions';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [RESERVATION_ROUTES.LIST]: RESERVATION_BREADCRUMB_CONFIGS.LIST,
  [RESERVATION_ROUTES.CREATE]: RESERVATION_BREADCRUMB_CONFIGS.CREATE,
  [RESERVATION_ROUTES.SERVICES]: RESERVATION_BREADCRUMB_CONFIGS.SERVICES,
};

const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  const editMatch = pathname.match(RESERVATION_ROUTE_PATTERNS.EDIT);
  if (editMatch) {
    return {
      label: `예약 수정 #${editMatch[1]}`,
      title: `예약 수정 #${editMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  const detailMatch = pathname.match(RESERVATION_ROUTE_PATTERNS.DETAIL);
  if (detailMatch) {
    return {
      label: `예약 #${detailMatch[1]}`,
      title: `예약 상세 #${detailMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  return null;
};

const isSubRoute = (pathname: string): boolean =>
  pathname !== RESERVATION_ROUTES.LIST;

export const ReservationsLayout = () => {
  const location = useLocation();
  const { reservations, fetchReservations } = useReservations();

  useEffect(() => {
    fetchReservations({});
  }, [fetchReservations]);

  const config = useMemo((): BreadcrumbConfig => {
    const pathname = location.pathname;
    const staticConfig = PATH_TO_CONFIG_MAP[pathname];
    if (staticConfig) return staticConfig;

    const dynamicConfig = getDynamicRouteConfig(pathname);
    if (dynamicConfig) return dynamicConfig;

    return DEFAULT_RESERVATION_BREADCRUMB_CONFIG;
  }, [location.pathname]);

  const showParentBreadcrumb = isSubRoute(location.pathname);

  return (
    <main className="flex h-full flex-1 flex-col p-4">
      <div className="mb-4 flex flex-col gap-4">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {showParentBreadcrumb ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={RESERVATION_ROUTES.LIST}>예약 관리</Link>
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

        {/* 타이틀 + 액션 */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex-none text-2xl font-bold tracking-tight">
            {config.title}
          </CardTitle>
          {config.showActions && <ReservationPrimaryActions />}
        </div>

        {/* 통계 */}
        {config.showStats && <ReservationStats reservations={reservations} />}
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

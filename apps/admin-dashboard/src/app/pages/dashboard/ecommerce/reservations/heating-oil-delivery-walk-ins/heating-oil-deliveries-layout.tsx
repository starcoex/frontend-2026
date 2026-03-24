import { Outlet, useLocation, Link } from 'react-router-dom';
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
import { HeatingOilDeliveryPrimaryActions } from '@/app/pages/dashboard/ecommerce/reservations/heating-oil-delivery-walk-ins/components/heation-oil-delivery-primary-actions';

interface BreadcrumbConfig {
  label: string;
  title: string;
  isSubRoute: boolean;
  showActions: boolean;
}

const BASE_PATH = '/admin/heating-oil-deliveries';

const getConfig = (pathname: string): BreadcrumbConfig => {
  if (pathname === BASE_PATH) {
    return {
      label: '난방유 배달',
      title: '난방유 배달',
      isSubRoute: false,
      showActions: true,
    };
  }
  if (pathname.endsWith('/create')) {
    return {
      label: '배달 등록',
      title: '배달 등록',
      isSubRoute: true,
      showActions: false,
    };
  }
  if (pathname.match(/\/\d+\/edit$/)) {
    return {
      label: '배달 수정',
      title: '배달 수정',
      isSubRoute: true,
      showActions: false,
    };
  }
  if (pathname.match(/\/\d+$/)) {
    return {
      label: '배달 상세',
      title: '배달 상세',
      isSubRoute: true,
      showActions: false,
    };
  }
  return {
    label: '난방유 배달',
    title: '난방유 배달',
    isSubRoute: false,
    showActions: false,
  };
};

export const HeatingOilDeliveriesLayout = () => {
  const location = useLocation();
  const config = useMemo(
    () => getConfig(location.pathname),
    [location.pathname]
  );

  return (
    <main className="flex h-full flex-1 flex-col p-4">
      <div className="mb-4 flex flex-col gap-4">
        {/* BreadCrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {config.isSubRoute ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={BASE_PATH}>난방유 배달</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{config.label}</BreadcrumbPage>
                </BreadcrumbItem>
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
          {config.showActions && <HeatingOilDeliveryPrimaryActions />}
        </div>
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

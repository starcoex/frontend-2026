import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { UserPrimaryActions } from './components/user-primary-actions';
import { UsersStats } from './components/users-stats';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';
import { USER_ROUTES, USER_ROUTE_PATTERNS } from '@/app/constants/user-routes';
import {
  BREADCRUMB_CONFIGS,
  DEFAULT_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/breadcrumb-config';
import { useUsersContext } from '@starcoex-frontend/auth';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [USER_ROUTES.LIST]: BREADCRUMB_CONFIGS.LIST,
  [USER_ROUTES.CREATE]: BREADCRUMB_CONFIGS.CREATE,
  [USER_ROUTES.ADMINS]: BREADCRUMB_CONFIGS.ADMINS,
  [USER_ROUTES.MEMBERS]: BREADCRUMB_CONFIGS.MEMBERS,
  [USER_ROUTES.DRIVERS]: BREADCRUMB_CONFIGS.DRIVERS,
  [USER_ROUTES.INVITATIONS]: BREADCRUMB_CONFIGS.INVITATIONS, // ✅ 추가
};

const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  const editMatch = pathname.match(USER_ROUTE_PATTERNS.EDIT);
  if (editMatch) {
    const userId = editMatch[1];
    return {
      label: `Edit User #${userId}`,
      title: `Edit User #${userId}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  const detailMatch = pathname.match(USER_ROUTE_PATTERNS.DETAIL);
  if (detailMatch) {
    const userId = detailMatch[1];
    return {
      label: `User #${userId}`,
      title: `User Details #${userId}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  return null;
};

export const UsersLayout = () => {
  const location = useLocation();

  // ✅ Context에서 모든 상태 가져오기
  const { users, stats, loading, statsLoading, refetch } = useUsersContext();

  // ✅ config 계산
  const config = useMemo((): BreadcrumbConfig => {
    const pathname = location.pathname;
    const staticConfig = PATH_TO_CONFIG_MAP[pathname];
    if (staticConfig) return staticConfig;
    const dynamicConfig = getDynamicRouteConfig(pathname);
    if (dynamicConfig) return dynamicConfig;
    return DEFAULT_BREADCRUMB_CONFIG;
  }, [location.pathname]);

  return (
    <main className="flex h-full flex-1 flex-col p-4">
      <div className="mb-4 flex flex-col gap-2">
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
          <CardTitle className="flex-none text-xl font-bold tracking-tight">
            {config.title}
          </CardTitle>
          {config.showActions && <UserPrimaryActions onUserCreated={refetch} />}
        </div>

        {config.showStats && (
          <UsersStats stats={stats} loading={statsLoading} />
        )}
      </div>

      <div className="flex-1">
        <Outlet
          context={{ users, loading, error: null, refreshUsers: refetch }}
        />
      </div>
    </main>
  );
};

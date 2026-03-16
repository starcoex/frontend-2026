import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
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
import { MediaProvider } from '@starcoex-frontend/media';
import {
  FILE_BREADCRUMB_CONFIGS,
  DEFAULT_FILE_BREADCRUMB_CONFIG,
  type FileBreadcrumbConfig,
} from '@/app/constants/file-breadcrumb-config';
import { FILE_ROUTES } from '@/app/constants/file-routes';
import { FilePrimaryActions } from '@/app/pages/dashboard/board/file-manager/components/file-primary-action';
import { SummaryCards } from '@/app/pages/dashboard/board/file-manager/components/summary-cards';

const PATH_TO_CONFIG_MAP: Record<string, FileBreadcrumbConfig> = {
  [FILE_ROUTES.ROOT]: FILE_BREADCRUMB_CONFIGS.ROOT,
  [FILE_ROUTES.RECENT]: FILE_BREADCRUMB_CONFIGS.RECENT,
  [FILE_ROUTES.ANALYSIS]: FILE_BREADCRUMB_CONFIGS.ANALYSIS,
};

export const FileManagerLayout = () => {
  const location = useLocation();

  const config = useMemo((): FileBreadcrumbConfig => {
    return (
      PATH_TO_CONFIG_MAP[location.pathname] ?? DEFAULT_FILE_BREADCRUMB_CONFIG
    );
  }, [location.pathname]);

  const isRoot = location.pathname === FILE_ROUTES.ROOT;

  return (
    <MediaProvider>
      <main className="flex h-full flex-1 flex-col p-4">
        <div className="mb-4 flex flex-col gap-4">
          {/* 1. Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/admin">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {isRoot ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>Media</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to={FILE_ROUTES.ROOT}>Media</Link>
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
              )}
            </BreadcrumbList>
          </Breadcrumb>

          {/* 2. 타이틀 + 액션 */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="flex-none text-xl font-bold tracking-tight lg:text-2xl">
              {config.title}
            </CardTitle>
            {config.showActions && <FilePrimaryActions />}
          </div>

          {/* 3. 통계 카드 */}
          {config.showStats && <SummaryCards />}
        </div>

        {/* 4. 하위 페이지 */}
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </MediaProvider>
  );
};

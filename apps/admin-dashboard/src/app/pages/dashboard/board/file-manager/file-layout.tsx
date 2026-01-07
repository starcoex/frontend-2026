import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  FileUploadDialog,
  SummaryCards,
} from '@/app/pages/dashboard/board/file-manager/components';
import { CardTitle } from '@/components/ui/card';
import { MediaProvider } from '@starcoex-frontend/media';

interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb?: boolean;
  showActions?: boolean; // 업로드 버튼 표시 여부
  showStats?: boolean; // SummaryCards 표시 여부
}

export const FileManagerLayout = () => {
  const location = useLocation();

  // ✅ 경로별 설정 정의
  const getBreadcrumbConfig = (pathname: string): BreadcrumbConfig => {
    const pathConfigs: Record<string, BreadcrumbConfig> = {
      '/admin/media': {
        label: 'File Manager',
        title: 'File Manager',
        showInBreadcrumb: true,
        showActions: true, // 메인 화면에서만 업로드 버튼 표시
        showStats: true, // 메인 화면에서만 요약 카드 표시
      },
      '/admin/media/recent': {
        label: 'Recent Files',
        title: 'Recently Uploaded',
        showInBreadcrumb: true,
        showActions: false,
        showStats: false,
      },
    };

    // 기본값
    return (
      pathConfigs[pathname] || {
        label: 'File Manager',
        title: 'File Management',
        showInBreadcrumb: true,
        showActions: true,
        showStats: true,
      }
    );
  };

  const config = getBreadcrumbConfig(location.pathname);

  return (
    <MediaProvider>
      <main className="flex h-full flex-1 flex-col p-4">
        <div className="mb-4 flex flex-col gap-2">
          {/* 1. Breadcrumb 영역 */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/admin">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/admin/media">Media</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {config.showInBreadcrumb &&
                location.pathname !== '/admin/media' && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{config.label}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
            </BreadcrumbList>
          </Breadcrumb>

          {/* 2. 타이틀 및 액션(업로드) 버튼 영역 */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="flex-none text-xl font-bold tracking-tight lg:text-2xl">
              {config.title}
            </CardTitle>
            {/* ✅ 조건부로 액션 버튼(파일 업로드) 표시 */}
            {config.showActions && <FileUploadDialog />}
          </div>

          {/* 3. 통계(Summary Cards) 영역 - 조건부 표시 */}
          {config.showStats && <SummaryCards />}
        </div>

        {/* 4. 하위 페이지 컨텐츠 (File Manager Page 등) */}
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </MediaProvider>
  );
};

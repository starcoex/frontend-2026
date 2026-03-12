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

interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb?: boolean;
}

const getBreadcrumbConfig = (pathname: string): BreadcrumbConfig => {
  const pathConfigs: Record<string, BreadcrumbConfig> = {
    '/admin/categories': {
      label: '카테고리 관리',
      title: '전체 카테고리',
      showInBreadcrumb: true,
    },
    '/admin/categories/create': {
      label: '카테고리 등록',
      title: '새 카테고리 등록',
      showInBreadcrumb: true,
    },
    '/admin/categories/hierarchy': {
      label: '카테고리 계층',
      title: '카테고리 계층 구조',
      showInBreadcrumb: true,
    },
  };

  // 동적 라우트 처리 (수정 페이지)
  const editMatch = pathname.match(/^\/admin\/categories\/(\d+)\/edit$/);
  if (editMatch) {
    return {
      label: `카테고리 #${editMatch[1]} 수정`,
      title: `카테고리 #${editMatch[1]} 수정`,
      showInBreadcrumb: true,
    };
  }

  const detailMatch = pathname.match(/^\/admin\/categories\/(\d+)$/);
  if (detailMatch) {
    return {
      label: `카테고리 #${detailMatch[1]}`,
      title: `카테고리 상세 #${detailMatch[1]}`,
      showInBreadcrumb: true,
    };
  }

  return (
    pathConfigs[pathname] || {
      label: '카테고리 관리',
      title: '카테고리 관리',
      showInBreadcrumb: true,
    }
  );
};

export const CategoriesLayout = () => {
  const location = useLocation();
  const config = getBreadcrumbConfig(location.pathname);

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
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin/categories">카테고리 관리</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {config.showInBreadcrumb &&
              location.pathname !== '/admin/categories' && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{config.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex-none text-xl font-bold tracking-tight">
            {config.title}
          </h2>
        </div>
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

export default CategoriesLayout;

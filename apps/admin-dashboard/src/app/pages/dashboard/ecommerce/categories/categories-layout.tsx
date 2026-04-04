import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
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
import { useCategories } from '@starcoex-frontend/categories';
import type { Category } from '@starcoex-frontend/categories';
import { CategoryPrimaryActions } from './components/category-primary-actions';
import { CategoryStats } from './components/category-stats';
import {
  CATEGORY_ROUTES,
  CATEGORY_ROUTE_PATTERNS,
} from '@/app/constants/category-routes';
import {
  CATEGORY_BREADCRUMB_CONFIGS,
  DEFAULT_CATEGORY_BREADCRUMB_CONFIG,
  type CategoryBreadcrumbConfig,
} from '@/app/constants/category-breadcrumb-config';

const PATH_TO_CONFIG_MAP: Record<string, CategoryBreadcrumbConfig> = {
  [CATEGORY_ROUTES.LIST]: CATEGORY_BREADCRUMB_CONFIGS.LIST,
  [CATEGORY_ROUTES.HIERARCHY]: CATEGORY_BREADCRUMB_CONFIGS.HIERARCHY,
};

const getDynamicRouteConfig = (
  pathname: string
): CategoryBreadcrumbConfig | null => {
  const editMatch = pathname.match(CATEGORY_ROUTE_PATTERNS.EDIT);
  if (editMatch) {
    return {
      label: `카테고리 #${editMatch[1]} 수정`,
      title: `카테고리 #${editMatch[1]} 수정`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  const detailMatch = pathname.match(CATEGORY_ROUTE_PATTERNS.DETAIL);
  if (detailMatch) {
    return {
      label: `카테고리 #${detailMatch[1]}`,
      title: `카테고리 상세 #${detailMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  return null;
};

// 트리 → flat 배열 변환 (children 제거하여 buildTree 재조립 시 중복 방지)
function flattenTree(nodes: Category[]): Category[] {
  return nodes.reduce<Category[]>((acc, node) => {
    const { children, ...rest } = node;
    acc.push(rest as Category); // children 없이 push
    if (children?.length) {
      acc.push(...flattenTree(children));
    }
    return acc;
  }, []);
}
export const CategoriesLayout = () => {
  const location = useLocation();
  const { categoryTree, fetchCategoryTree } = useCategories();

  useEffect(() => {
    fetchCategoryTree();
  }, [fetchCategoryTree]);

  const config = useMemo((): CategoryBreadcrumbConfig => {
    const pathname = location.pathname;
    const staticConfig = PATH_TO_CONFIG_MAP[pathname];
    if (staticConfig) return staticConfig;

    const dynamicConfig = getDynamicRouteConfig(pathname);
    if (dynamicConfig) return dynamicConfig;

    return DEFAULT_CATEGORY_BREADCRUMB_CONFIG;
  }, [location.pathname]);

  const flatCategories = useMemo(
    () => flattenTree(categoryTree),
    [categoryTree]
  );

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
          {config.showActions && <CategoryPrimaryActions />}
        </div>

        {config.showStats && <CategoryStats categories={flatCategories} />}
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

export default CategoriesLayout;

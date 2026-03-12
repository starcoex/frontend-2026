import { useEffect, useMemo } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Category, useCategories } from '@starcoex-frontend/categories';
import { categoryColumns } from './components/category-columns';
import { CategoriesTable } from './components/categories-table';
import { CategoryPrimaryActions } from './components/category-primary-actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

// ✅ 최상위만 필터링 후 평면화 (중복 방지)
const flattenCategories = (categories: Category[]): Category[] => {
  return categories.reduce<Category[]>((acc, category) => {
    acc.push(category);
    if (category.children?.length) {
      acc.push(...flattenCategories(category.children));
    }
    return acc;
  }, []);
};

const CategoriesPage = () => {
  const { categoryTree, isLoading, error, fetchCategoryTree } = useCategories();

  // ✅ fetchCategories → fetchCategoryTree 로 변경
  useEffect(() => {
    fetchCategoryTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allCategories = useMemo(() => {
    // ✅ 최상위(parentId가 null/undefined)만 필터링 후 평면화
    const rootCategories = categoryTree.filter(
      (c) => c.parentId === null || c.parentId === undefined
    );
    return flattenCategories(rootCategories);
  }, [categoryTree]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            카테고리를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">카테고리 관리</h2>
          <p className="text-muted-foreground">전체 카테고리 목록입니다.</p>
        </div>
        <CategoryPrimaryActions />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>데이터 로딩 실패</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchCategoryTree()}
              className="ml-4"
            >
              다시 시도
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!error && allCategories.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed">
          <h3 className="mb-2 text-lg font-semibold">카테고리가 없습니다</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            첫 카테고리를 등록해 보세요.
          </p>
          <CategoryPrimaryActions />
        </div>
      )}

      {!error && allCategories.length > 0 && (
        <div className="flex-1">
          <CategoriesTable data={allCategories} columns={categoryColumns} />
        </div>
      )}
    </>
  );
};

export default CategoriesPage;

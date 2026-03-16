import { useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useCategories } from '@starcoex-frontend/categories';
import { CategoryTreeView } from './components/category-tree-view';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const CategoryHierarchyPage = () => {
  const { categoryTree, isLoading, error, fetchCategoryTree } = useCategories();

  useEffect(() => {
    fetchCategoryTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            카테고리 트리를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">카테고리 계층</h2>
          <p className="text-muted-foreground">
            드래그하여 카테고리 순서와 계층을 변경할 수 있습니다.
          </p>
        </div>
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

      {!error && <CategoryTreeView categories={categoryTree} />}
    </>
  );
};

export default CategoryHierarchyPage;

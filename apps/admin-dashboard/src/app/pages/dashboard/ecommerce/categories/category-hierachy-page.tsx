import { useCategories } from '@starcoex-frontend/categories';
import { CategoryTreeView } from './components/category-tree-view';
import {
  ErrorAlert,
  LoadingSpinner,
  PageHead,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { CategoryHierarchyStats } from './components/category-hierarchy-stats';

const CategoryHierarchyPage = () => {
  const { categoryTree, isLoading, error, fetchCategoryTree } = useCategories();

  if (isLoading) {
    return <LoadingSpinner message="카테고리 트리를 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`카테고리 계층 - ${COMPANY_INFO.name}`}
        description="카테고리 계층 구조를 관리하세요."
        keywords={['카테고리 계층', '카테고리 관리', COMPANY_INFO.name]}
        og={{
          title: `카테고리 계층 - ${COMPANY_INFO.name}`,
          description: '드래그앤드롭으로 카테고리 계층을 관리합니다.',
          image: '/images/og-products.jpg',
          type: 'website',
        }}
      />

      {error && (
        <ErrorAlert error={error} onRetry={() => fetchCategoryTree()} />
      )}

      {!error && (
        <div className="space-y-4">
          <CategoryHierarchyStats categories={categoryTree} />
          <CategoryTreeView categories={categoryTree} />
        </div>
      )}
    </>
  );
};

export default CategoryHierarchyPage;

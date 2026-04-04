import { useMemo } from 'react';
import { type Category, useCategories } from '@starcoex-frontend/categories';
import { categoryColumns } from './components/category-columns';
import { CategoriesTable } from './components/categories-table';
import {
  ErrorAlert,
  LoadingSpinner,
  PageHead,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';

// children 없는 순수 flat 객체로 변환 (테이블 row 중복 방지)
const flattenTree = (nodes: Category[]): Category[] =>
  nodes.reduce<Category[]>((acc, node) => {
    const { children, ...rest } = node;
    acc.push(rest as Category);
    if (children?.length) {
      acc.push(...flattenTree(children));
    }
    return acc;
  }, []);

const CategoriesPage = () => {
  const { categoryTree, isLoading, error, fetchCategoryTree } = useCategories();

  const allCategories = useMemo(
    () => flattenTree(categoryTree),
    [categoryTree]
  );

  if (isLoading) {
    return <LoadingSpinner message="카테고리 데이터를 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`카테고리 관리 - ${COMPANY_INFO.name}`}
        description="카테고리 목록을 관리하고 필터링하세요."
        keywords={['카테고리 관리', '카테고리 목록', COMPANY_INFO.name]}
        og={{
          title: `카테고리 관리 - ${COMPANY_INFO.name}`,
          description: '카테고리 목록 조회 및 관리 시스템',
          image: '/images/og-products.jpg',
          type: 'website',
        }}
      />

      {error && (
        <ErrorAlert error={error} onRetry={() => fetchCategoryTree()} />
      )}

      {!error && (
        <CategoriesTable data={allCategories} columns={categoryColumns} />
      )}
    </>
  );
};

export default CategoriesPage;

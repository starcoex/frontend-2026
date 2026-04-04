import {
  ErrorAlert,
  LoadingSpinner,
  PageHead,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useProducts } from '@starcoex-frontend/products';
import { ProductsTable } from '@/app/pages/dashboard/ecommerce/products/components/product-table';

export default function ProductsPage() {
  const { products, isLoading, error, fetchProducts } = useProducts();

  if (isLoading) {
    return <LoadingSpinner message="제품 데이터를 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`제품 관리 - ${COMPANY_INFO.name}`}
        description="제품 목록을 관리하고 필터링하세요."
        keywords={['제품 관리', '상품 목록', COMPANY_INFO.name]}
        og={{
          title: `제품 관리 - ${COMPANY_INFO.name}`,
          description: '제품 목록 조회 및 관리 시스템',
          image: '/images/og-products.jpg',
          type: 'website',
        }}
      />

      {error && <ErrorAlert error={error} onRetry={() => fetchProducts()} />}

      {!error && <ProductsTable data={products} />}
    </>
  );
}

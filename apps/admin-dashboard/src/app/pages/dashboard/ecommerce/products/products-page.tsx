import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useProducts } from '@starcoex-frontend/products';
import { ProductsTable } from '@/app/pages/dashboard/ecommerce/products/components/product-table';
import { ProductPrimaryActions } from '@/app/pages/dashboard/ecommerce/products/components/product-primary-actions';

export default function ProductsPage() {
  const { products, isLoading, error, fetchProducts } = useProducts();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            제품 데이터를 불러오는 중...
          </p>
        </div>
      </div>
    );
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

      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">제품 관리</h1>
        <ProductPrimaryActions />
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
              onClick={() => fetchProducts()}
              className="ml-4"
            >
              다시 시도
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!error && <ProductsTable data={products} />}
    </>
  );
}

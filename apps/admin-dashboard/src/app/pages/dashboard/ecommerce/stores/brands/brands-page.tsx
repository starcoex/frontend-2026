import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { AlertCircle } from 'lucide-react';
import { useStores } from '@starcoex-frontend/stores';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { BrandTable } from '@/app/pages/dashboard/ecommerce/stores/brands/components/brand-table';

export default function BrandsPage() {
  const { brands, error, fetchBrands } = useStores();

  return (
    <>
      <PageHead
        title={`브랜드 관리 - ${COMPANY_INFO.name}`}
        description="브랜드 목록을 관리하고 필터링하세요."
        keywords={['브랜드 관리', '브랜드 목록', COMPANY_INFO.name]}
        og={{
          title: `브랜드 관리 - ${COMPANY_INFO.name}`,
          description: '브랜드 목록 조회 및 관리 시스템',
          image: '/images/og-brands.jpg',
          type: 'website',
        }}
      />

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>데이터 로딩 실패</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchBrands()}
              className="ml-4"
            >
              다시 시도
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!error && <BrandTable data={brands} />}
    </>
  );
}

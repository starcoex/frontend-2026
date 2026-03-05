import { Button } from '@/components/ui/button';
import BrandList from './brand-list';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { AlertCircle, Tag } from 'lucide-react';
import { useStores } from '@starcoex-frontend/stores';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

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

      {/* ✅ 에러 알림 */}
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

      {/* ✅ Empty State */}
      {!error && brands.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <Tag className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">브랜드가 없습니다</h3>
          <p className="text-sm text-muted-foreground mb-4">
            첫 브랜드를 등록하여 시작하세요
          </p>
          <Button asChild>
            <Link to="/admin/stores/brands/create">브랜드 추가</Link>
          </Button>
        </div>
      )}

      {/* ✅ 브랜드 목록 */}
      {brands.length > 0 && <BrandList data={brands} />}
    </>
  );
}

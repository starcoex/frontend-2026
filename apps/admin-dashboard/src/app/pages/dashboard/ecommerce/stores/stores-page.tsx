import { Button } from '@/components/ui/button';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useEffect } from 'react';
import { AlertCircle, Loader2, StoreIcon } from 'lucide-react';
import { useStores } from '@starcoex-frontend/stores';
import StoreList from '@/app/pages/dashboard/ecommerce/stores/store-list';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

export default function StoresPage() {
  const { stores, isLoading, error, fetchStores } = useStores();

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            매장 데이터를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`매장 관리 - ${COMPANY_INFO.name}`}
        description="매장 목록을 관리하고 필터링하세요."
        keywords={['매장 관리', '지점 목록', COMPANY_INFO.name]}
        og={{
          title: `매장 관리 - ${COMPANY_INFO.name}`,
          description: '매장 목록 조회 및 관리 시스템',
          image: '/images/og-stores.jpg',
          type: 'website',
        }}
      />

      {/* ✅ 실제 에러만 표시 */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>데이터 로딩 실패</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchStores()}
              className="ml-4"
            >
              다시 시도
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* ✅ Empty State: 에러 없고 데이터도 없을 때 */}
      {!error && stores.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <StoreIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">매장이 없습니다</h3>
          <p className="text-sm text-muted-foreground mb-4">
            첫 매장을 등록하여 시작하세요
          </p>
          <Button asChild>
            <Link to="/admin/stores/create">매장 추가</Link>
          </Button>
        </div>
      )}

      {/* ✅ 데이터가 있을 때만 테이블 표시 */}
      {!error && stores.length > 0 && <StoreList data={stores} />}
    </>
  );
}

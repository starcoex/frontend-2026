import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useStores } from '@starcoex-frontend/stores';
import { StoreTable } from '@/app/pages/dashboard/ecommerce/stores/components/store-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function StoresPage() {
  const { stores, isLoading, error, fetchStores } = useStores();

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
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

      {!error && <StoreTable data={stores} />}
    </>
  );
}

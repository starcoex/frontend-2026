import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useStores } from '@starcoex-frontend/stores';
import StoreEditForm from '@/app/pages/dashboard/ecommerce/stores/edit/store-edit-form';

export default function StoreEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentStore, isLoading, error, fetchStoreById } = useStores();

  useEffect(() => {
    if (id) fetchStoreById(parseInt(id));
  }, [id, fetchStoreById]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            매장 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !currentStore) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '매장을 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/stores')}>매장 목록으로</Button>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`${currentStore.name} 수정 - ${COMPANY_INFO.name}`}
        description="매장 정보를 수정하세요."
        keywords={['매장 수정', currentStore.name, COMPANY_INFO.name]}
        og={{
          title: `${currentStore.name} 수정 - ${COMPANY_INFO.name}`,
          description: '매장 정보 수정',
          image: '/images/og-stores.jpg',
          type: 'website',
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-lg)">
        <StoreEditForm store={currentStore} />
      </div>
    </>
  );
}

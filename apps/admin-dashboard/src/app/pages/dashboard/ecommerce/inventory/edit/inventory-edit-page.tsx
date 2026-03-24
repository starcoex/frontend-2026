import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInventory } from '@starcoex-frontend/inventory';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { INVENTORY_ROUTES } from '@/app/constants/inventory-routes';
import { InventoryEditForm } from './inventory-edit-form';

export default function InventoryEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentInventory, isLoading, error, fetchInventoryById } =
    useInventory();

  useEffect(() => {
    if (id) fetchInventoryById(parseInt(id));
  }, [id, fetchInventoryById]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            재고 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !currentInventory) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '재고 정보를 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate(INVENTORY_ROUTES.LIST)}>
          재고 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`재고 #${currentInventory.id} 수정 - ${COMPANY_INFO.name}`}
        description="재고 정보를 수정하세요."
        keywords={[
          '재고 수정',
          `매장 #${currentInventory.storeId}`,
          COMPANY_INFO.name,
        ]}
        og={{
          title: `재고 #${currentInventory.id} 수정 - ${COMPANY_INFO.name}`,
          description: '재고 정보를 수정하세요.',
          image: '/images/og-inventory.jpg',
          type: 'website',
        }}
      />
      <InventoryEditForm inventory={currentInventory} />
    </>
  );
}

import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { InventoryCreateForm } from './inventory-create-form';

export default function InventoryCreatePage() {
  return (
    <>
      <PageHead
        title={`재고 추가 - ${COMPANY_INFO.name}`}
        description="새로운 매장 재고를 등록합니다."
        keywords={['재고 추가', '재고 등록', COMPANY_INFO.name]}
        og={{
          title: `재고 추가 - ${COMPANY_INFO.name}`,
          description: '새로운 매장 재고를 등록합니다.',
          image: '/images/og-inventory.jpg',
          type: 'website',
        }}
      />
      <InventoryCreateForm />
    </>
  );
}

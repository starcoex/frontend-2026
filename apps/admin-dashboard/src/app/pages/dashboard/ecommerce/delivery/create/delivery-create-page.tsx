import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import AddDeliveryForm from '@/app/pages/dashboard/ecommerce/delivery/create/add-delivery-form/add-delivery-form';

export default function DeliveryCreatePage() {
  return (
    <>
      <PageHead
        title={`배송 추가 - ${COMPANY_INFO.name}`}
        description="새로운 배송을 등록하세요."
        keywords={['배송 추가', '배송 등록', '배송 관리', COMPANY_INFO.name]}
        og={{
          title: `배송 추가 - ${COMPANY_INFO.name}`,
          description: '새로운 배송을 빠르고 쉽게 등록하세요',
          image: '/images/og-delivery.jpg',
          type: 'website',
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-lg)">
        <div className="space-y-4">
          <AddDeliveryForm />
        </div>
      </div>
    </>
  );
}

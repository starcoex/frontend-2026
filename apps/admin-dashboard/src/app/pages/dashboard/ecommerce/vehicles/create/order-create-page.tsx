import AddOrderForm from './add-order-form';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';

export default function OrderCreatePage() {
  return (
    <>
      <PageHead
        title={`주문 추가 - ${COMPANY_INFO.name}`}
        description="새로운 주문을 등록하세요."
        keywords={['주문 추가', '주문 등록', COMPANY_INFO.name]}
        og={{
          title: `주문 추가 - ${COMPANY_INFO.name}`,
          description: '새로운 주문을 빠르고 쉽게 등록하세요',
          image: '/images/og-orders.jpg',
          type: 'website',
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-lg)">
        <div className="space-y-4">
          <AddOrderForm />
        </div>
      </div>
    </>
  );
}

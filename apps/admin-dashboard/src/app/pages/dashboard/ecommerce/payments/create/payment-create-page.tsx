import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { AddPaymentForm } from './add-payment-form';

export default function PaymentCreatePage() {
  return (
    <>
      <PageHead
        title={`결제 등록 - ${COMPANY_INFO.name}`}
        description="수동 결제를 등록하세요. 현장 결제, 현금 결제 등 포트원을 거치지 않는 결제를 직접 등록할 수 있습니다."
        keywords={[
          '결제 등록',
          '수동 결제',
          '현장 결제',
          '결제 관리',
          COMPANY_INFO.name,
        ]}
        og={{
          title: `결제 등록 - ${COMPANY_INFO.name}`,
          description: '수동 결제를 빠르고 쉽게 등록하세요.',
          image: '/images/og-payments.jpg',
          type: 'website',
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-lg)">
        <div className="space-y-4">
          <AddPaymentForm />
        </div>
      </div>
    </>
  );
}

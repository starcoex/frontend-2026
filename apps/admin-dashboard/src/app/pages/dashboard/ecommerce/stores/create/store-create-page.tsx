import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import AddStoreForm from '@/app/pages/dashboard/ecommerce/stores/create/add-store-form';

export default function StoreCreatePage() {
  return (
    <>
      <PageHead
        title={`매장 추가 - ${COMPANY_INFO.name}`}
        description="새로운 매장을 등록하세요. 매장명, 위치, 연락처 등을 빠르고 쉽게 추가할 수 있습니다."
        keywords={[
          '매장 추가',
          '지점 등록',
          '매장 관리',
          COMPANY_INFO.name,
          '이커머스',
        ]}
        og={{
          title: `매장 추가 - ${COMPANY_INFO.name}`,
          description: '새로운 매장을 빠르고 쉽게 등록하세요',
          image: '/images/og-store-create.jpg',
          type: 'website',
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-lg)">
        <div className="space-y-4">
          <AddStoreForm />
        </div>
      </div>
    </>
  );
}

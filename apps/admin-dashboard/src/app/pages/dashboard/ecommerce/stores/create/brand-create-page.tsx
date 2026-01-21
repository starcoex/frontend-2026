import AddBrandForm from './add-brand-form';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';

export default function BrandCreatePage() {
  return (
    <>
      <PageHead
        title={`브랜드 추가 - ${COMPANY_INFO.name}`}
        description="새로운 브랜드를 등록하세요."
        keywords={['브랜드 추가', '브랜드 등록', COMPANY_INFO.name]}
        og={{
          title: `브랜드 추가 - ${COMPANY_INFO.name}`,
          description: '새로운 브랜드를 등록하세요',
          image: '/images/og-brand-create.jpg',
          type: 'website',
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-lg)">
        <div className="space-y-4">
          <AddBrandForm />
        </div>
      </div>
    </>
  );
}

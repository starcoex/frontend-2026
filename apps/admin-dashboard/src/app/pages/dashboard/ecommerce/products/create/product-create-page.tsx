import AddProductForm from './add-product-form';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';

export default function ProductCreatePage() {
  return (
    <>
      <PageHead
        title={`제품 추가 - ${COMPANY_INFO.name}`}
        description="새로운 제품을 등록하세요. 제품명, 가격, 카테고리, 이미지 등을 빠르고 쉽게 추가할 수 있습니다."
        keywords={[
          '제품 추가',
          '상품 등록',
          '제품 관리',
          '재고 등록',
          COMPANY_INFO.name,
          '이커머스',
        ]}
        og={{
          title: `제품 추가 - ${COMPANY_INFO.name}`,
          description: '새로운 제품을 빠르고 쉽게 등록하세요',
          image: '/images/og-product-create.jpg',
          type: 'website',
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-lg)">
        <div className="space-y-4">
          <AddProductForm />
        </div>
      </div>
    </>
  );
}

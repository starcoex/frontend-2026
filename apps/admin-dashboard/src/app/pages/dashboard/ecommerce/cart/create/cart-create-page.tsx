import AddCartItemForm from './add-cart-item-form';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';

export default function CartCreatePage() {
  return (
    <>
      <PageHead
        title={`장바구니 상품 추가 - ${COMPANY_INFO.name}`}
        description="관리자가 고객 장바구니에 상품을 추가합니다."
        keywords={['장바구니 추가', '상품 추가', COMPANY_INFO.name]}
        og={{
          title: `장바구니 상품 추가 - ${COMPANY_INFO.name}`,
          description: '관리자 장바구니 상품 추가',
          image: '/images/og-cart.jpg',
          type: 'website',
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-lg)">
        <div className="space-y-4">
          <AddCartItemForm />
        </div>
      </div>
    </>
  );
}

import {
  ErrorAlert,
  LoadingSpinner,
  PageHead,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useCart } from '@starcoex-frontend/cart';
import { CartTable } from './components/cart-table';

export default function CartPage() {
  const { cart, isLoading, error, fetchMyCart } = useCart();

  if (isLoading) {
    return <LoadingSpinner message="장바구니를 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`장바구니 관리 - ${COMPANY_INFO.name}`}
        description="장바구니 목록을 관리하고 필터링하세요."
        keywords={['장바구니 관리', '장바구니 목록', COMPANY_INFO.name]}
        og={{
          title: `장바구니 관리 - ${COMPANY_INFO.name}`,
          description: '장바구니 목록 조회 및 관리 시스템',
          image: '/images/og-cart.jpg',
          type: 'website',
        }}
      />

      {error && <ErrorAlert error={error} onRetry={() => fetchMyCart()} />}

      {!error && <CartTable data={cart ? [cart] : []} />}
    </>
  );
}

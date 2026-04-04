import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useCart } from '@starcoex-frontend/cart';
import { CartEmpty } from '@/app/pages/dashboard/ecommerce/cart/components/cart-empty';
import { CartItemList } from '@/app/pages/dashboard/ecommerce/cart/components/cart-item-list';
import { CartSummary } from '@/app/pages/dashboard/ecommerce/cart/components/cart-summary';

export default function CartDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { cart, isLoading, error, fetchMyCart, isCartEmpty } = useCart();

  useEffect(() => {
    fetchMyCart();
  }, [fetchMyCart]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            장바구니를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !cart) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '장바구니를 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/cart')}>
          장바구니 목록으로
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`사용자 #${userId} 장바구니 - ${COMPANY_INFO.name}`}
        description="사용자 장바구니 상세 정보"
        keywords={['장바구니 상세', `사용자 #${userId}`, COMPANY_INFO.name]}
        og={{
          title: `사용자 #${userId} 장바구니 - ${COMPANY_INFO.name}`,
          description: '사용자 장바구니 상세',
          image: '/images/og-cart.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/admin/cart">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
              사용자 #{userId} 장바구니
            </h1>
            <p className="text-muted-foreground text-sm">
              상품 {cart.itemCount}개 · ₩{cart.totalAmount.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            {isCartEmpty ? (
              <CartEmpty />
            ) : (
              <CartItemList items={cart.items ?? []} />
            )}
          </div>
          {!isCartEmpty && (
            <div className="w-full lg:w-[320px]">
              <CartSummary cart={cart} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

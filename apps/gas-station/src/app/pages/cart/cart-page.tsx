import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@starcoex-frontend/cart';
import {
  CartEmptyState,
  CartItemCard,
  CartSummaryPanel,
} from '@starcoex-frontend/common';

const PROMO_CODES: Record<string, number> = {
  SAVE10: 10,
  SAVE20: 20,
};

export const CartPage: React.FC = () => {
  const { cart, cartItemCount, cartTotalAmount, isCartEmpty, isLoading } =
    useCart();

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    percentOff: number;
  } | null>(null);
  const [promoError, setPromoError] = useState('');

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    const percentOff = PROMO_CODES[code];
    if (percentOff) {
      setAppliedPromo({ code, percentOff });
      setPromoError('');
    } else {
      setPromoError('유효하지 않은 할인 코드입니다.');
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError('');
  };

  const discountAmount = appliedPromo
    ? cartTotalAmount * (appliedPromo.percentOff / 100)
    : 0;
  const afterDiscountTotal = Math.max(0, cartTotalAmount - discountAmount);

  return (
    <section className="mx-auto max-w-5xl px-4 py-20">
      {/* 헤더 */}
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold">장바구니</h1>
          <p className="text-muted-foreground text-sm">
            {cartItemCount > 0
              ? `총 ${cartItemCount}개의 상품이 담겨 있습니다`
              : '장바구니가 비어 있습니다'}
          </p>
        </div>

        {/* 프로모션 코드 */}
        {!appliedPromo ? (
          <div className="space-y-1">
            <div className="flex gap-2">
              <Input
                placeholder="할인 코드 입력"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    applyPromo();
                  }
                }}
                className="w-44"
                aria-invalid={!!promoError}
              />
              <Button
                type="button"
                onClick={applyPromo}
                disabled={!promoInput.trim()}
              >
                적용
              </Button>
            </div>
            {promoError && (
              <p className="text-destructive text-xs">{promoError}</p>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-green-600">
              {appliedPromo.code} ({appliedPromo.percentOff}% 할인 적용됨)
            </span>
            <Button
              type="button"
              variant="link"
              size="sm"
              className="text-destructive h-auto p-0"
              onClick={removePromo}
            >
              제거
            </Button>
          </div>
        )}
      </header>

      {/* 본문 */}
      {isCartEmpty ? (
        <CartEmptyState />
      ) : (
        <div>
          {/* 테이블 헤더 — 데스크톱 */}
          <div className="text-muted-foreground bg-muted hidden items-center gap-4 rounded-lg px-4 py-3 text-xs font-medium md:grid md:grid-cols-[1.6fr_0.5fr_0.7fr_0.5fr]">
            <div>상품</div>
            <div>단가</div>
            <div className="text-center">수량</div>
            <div className="text-right">합계</div>
          </div>

          {/* 상품 목록 */}
          <div className="divide-y">
            {cart?.items?.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>

          <Separator className="my-6" />

          {/* 요약 패널 */}
          <CartSummaryPanel
            subtotal={cartTotalAmount}
            discountAmount={discountAmount}
            afterDiscountTotal={afterDiscountTotal}
            appliedPromo={appliedPromo}
            loading={isLoading}
            totalItems={cartItemCount}
          />
        </div>
      )}
    </section>
  );
};

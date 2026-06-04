import React, { useEffect, useState } from 'react';
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
  const {
    cart,
    cartItemCount,
    cartTotalAmount,
    isCartEmpty,
    isLoading,
    fetchMyCart,
  } = useCart();

  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    percentOff: number;
  } | null>(null);

  useEffect(() => {
    fetchMyCart();
  }, [fetchMyCart]);

  const handleApplyPromo = (code: string): boolean => {
    const percentOff = PROMO_CODES[code];
    if (percentOff) {
      setAppliedPromo({ code, percentOff });
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  const discountAmount = appliedPromo
    ? cartTotalAmount * (appliedPromo.percentOff / 100)
    : 0;
  const afterDiscountTotal = Math.max(0, cartTotalAmount - discountAmount);

  if (isCartEmpty) {
    return (
      <section className="py-32">
        <div className="container max-w-lg">
          <CartEmptyState />
        </div>
      </section>
    );
  }

  return (
    <section className="py-32">
      <div className="container">
        <h1 className="mb-8 text-3xl font-semibold">장바구니</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* 상품 목록 */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-40 animate-pulse rounded-xl bg-muted"
                    />
                  ))
                : cart?.items?.map((item) => (
                    <CartItemCard key={item.id} item={item} />
                  ))}
            </div>
          </div>

          {/* 주문 요약 */}
          <div className="lg:col-span-1">
            <CartSummaryPanel
              subtotal={cartTotalAmount}
              discountAmount={discountAmount}
              afterDiscountTotal={afterDiscountTotal}
              appliedPromo={appliedPromo}
              loading={isLoading}
              totalItems={cartItemCount}
              onApplyPromo={handleApplyPromo}
              onRemovePromo={handleRemovePromo}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

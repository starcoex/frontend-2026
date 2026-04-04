import React from 'react';
import { ArrowRight, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Separator } from '../ui';

interface CartSummaryPanelProps {
  subtotal: number;
  discountAmount: number;
  afterDiscountTotal: number;
  appliedPromo: { code: string; percentOff: number } | null;
  loading: boolean;
  totalItems: number;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(value);
}

export const CartSummaryPanel: React.FC<CartSummaryPanelProps> = ({
  subtotal,
  discountAmount,
  afterDiscountTotal,
  appliedPromo,
  loading,
  totalItems,
}) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border bg-card p-6 space-y-4 md:max-w-sm md:ml-auto">
      <h2 className="text-base font-semibold">주문 요약</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>상품 금액</span>
          <span>{formatMoney(subtotal)}</span>
        </div>

        {appliedPromo && (
          <div className="flex justify-between text-destructive">
            <span>할인 ({appliedPromo.percentOff}%)</span>
            <span>- {formatMoney(discountAmount)}</span>
          </div>
        )}

        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          <Truck className="w-3 h-3" />
          <span>배송비 및 세금 별도</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between font-semibold text-base">
        <span>합계</span>
        <span>{formatMoney(afterDiscountTotal)}</span>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={() => navigate('/checkout')}
        disabled={loading || totalItems === 0}
      >
        결제하기
        <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </div>
  );
};

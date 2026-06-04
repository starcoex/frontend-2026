import React from 'react';
import { ArrowRight, RefreshCcw, Shield, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Separator } from '../ui';
import { CartPromoInput } from './cart-promo-input';

interface CartSummaryPanelProps {
  subtotal: number;
  discountAmount: number;
  afterDiscountTotal: number;
  appliedPromo: { code: string; percentOff: number } | null;
  loading: boolean;
  totalItems: number;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
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
  onApplyPromo,
  onRemovePromo,
}) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border bg-card p-6 space-y-4 md:max-w-sm md:ml-auto">
      <h2 className="text-base font-semibold">주문 요약</h2>

      {/* 프로모 코드 */}
      <CartPromoInput
        appliedPromo={appliedPromo}
        onApply={onApplyPromo}
        onRemove={onRemovePromo}
      />

      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>상품 금액</span>
          <span>{formatMoney(subtotal)}</span>
        </div>

        {appliedPromo && (
          <div className="flex justify-between text-green-600">
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

      <p className="text-center text-xs text-muted-foreground">
        결제 시 세금이 계산됩니다
      </p>

      {/* 신뢰 배지 */}
      <Separator />
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Truck className="w-5 h-5 shrink-0" />
          <span>₩150,000 이상 무료 배송</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <RefreshCcw className="w-5 h-5 shrink-0" />
          <span>30일 무료 반품</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Shield className="w-5 h-5 shrink-0" />
          <span>안전한 결제</span>
        </div>
      </div>
    </div>
  );
};

import { ShoppingBag, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCart } from '@starcoex-frontend/cart';
import type { Cart } from '@starcoex-frontend/cart';

interface CartSummaryProps {
  cart: Cart;
}

export function CartSummary({ cart }: CartSummaryProps) {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [clearOpen, setClearOpen] = useState(false);

  const handleClearCart = async () => {
    const res = await clearCart();
    if (res.success) {
      toast.success('장바구니를 비웠습니다.');
    } else {
      toast.error('장바구니 비우기에 실패했습니다.');
    }
    setClearOpen(false);
  };

  const hasUnavailableItems = cart.items?.some((item) => !item.isAvailable);
  const hasPriceChangedItems = cart.items?.some((item) => item.isPriceChanged);

  return (
    <>
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShoppingBag className="size-4 opacity-60" />
            주문 요약
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 경고 배너 */}
          {hasUnavailableItems && (
            <Badge
              variant="destructive"
              className="w-full justify-center py-1.5"
            >
              구매 불가 상품이 포함되어 있습니다
            </Badge>
          )}
          {hasPriceChangedItems && (
            <Badge variant="warning" className="w-full justify-center py-1.5">
              가격 변동 상품이 있습니다
            </Badge>
          )}

          {/* 금액 요약 */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">상품 금액</span>
              <span>₩{cart.totalAmount.toLocaleString()}</span>
            </div>

            {cart.estimatedShipping !== null &&
              cart.estimatedShipping !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    배송비
                  </span>
                  <span>
                    {cart.estimatedShipping === 0
                      ? '무료'
                      : `₩${cart.estimatedShipping.toLocaleString()}`}
                  </span>
                </div>
              )}

            {cart.daysUntilExpiry !== null &&
              cart.daysUntilExpiry !== undefined && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>장바구니 만료</span>
                  <span>{cart.daysUntilExpiry}일 후</span>
                </div>
              )}
          </div>

          <Separator />

          {/* 최종 금액 */}
          <div className="flex justify-between font-semibold">
            <span>최종 금액</span>
            <span className="text-lg">
              ₩
              {(
                cart.totalAmount + (cart.estimatedShipping ?? 0)
              ).toLocaleString()}
            </span>
          </div>

          {/* 주문 버튼 */}
          <Button
            className="w-full"
            size="lg"
            disabled={hasUnavailableItems || cart.isExpired}
            onClick={() => navigate('/checkout')}
          >
            주문하기 ({cart.itemCount}개)
          </Button>

          {/* 장바구니 비우기 */}
          <Button
            variant="outline"
            size="sm"
            className="w-full text-destructive hover:text-destructive"
            onClick={() => setClearOpen(true)}
          >
            장바구니 비우기
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>장바구니 비우기</AlertDialogTitle>
            <AlertDialogDescription>
              장바구니의 모든 상품을 삭제합니다. 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearCart}
              className="bg-destructive hover:bg-destructive/90"
            >
              비우기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

import { Trash2, Plus, Minus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useState } from 'react';
import { useCart } from '@starcoex-frontend/cart';
import type { CartItem } from '@starcoex-frontend/cart';

interface CartItemListProps {
  items: CartItem[];
}

export function CartItemList({ items }: CartItemListProps) {
  const { updateCartItem, removeFromCart } = useCart();
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

  const handleQuantityChange = async (item: CartItem, delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    const res = await updateCartItem({
      productId: item.productId,
      storeId: item.storeId,
      quantity: newQty,
    });

    if (!res.success) {
      toast.error(res.error?.message ?? '수량 변경에 실패했습니다.');
    }
  };

  const handleRemove = async () => {
    if (!itemToRemove) return;
    const res = await removeFromCart({
      productId: itemToRemove.productId,
      storeId: itemToRemove.storeId,
    });
    if (res.success) {
      toast.success('상품이 장바구니에서 삭제되었습니다.');
    } else {
      toast.error(res.error?.message ?? '삭제에 실패했습니다.');
    }
    setItemToRemove(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            장바구니 상품
            <Badge variant="secondary" className="ml-2">
              {items.length}개
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between rounded-lg border p-3 ${
                !item.isAvailable
                  ? 'border-destructive/30 bg-destructive/5'
                  : ''
              }`}
            >
              <div className="flex flex-col gap-1 min-w-0">
                {/* 상품 ID (실제 환경에서는 product.name 으로 교체) */}
                <span className="text-sm font-medium">
                  상품 #{item.productId}
                </span>
                <span className="text-xs text-muted-foreground">
                  스토어 #{item.storeId}
                </span>

                {/* 가격 변동 경고 */}
                {item.isPriceChanged && (
                  <div className="flex items-center gap-1 text-xs text-warning">
                    <AlertCircle className="h-3 w-3" />
                    가격이 변경되었습니다
                  </div>
                )}

                {/* 재고 부족 경고 */}
                {!item.isAvailable && (
                  <Badge variant="destructive" className="w-fit text-xs">
                    품절 / 구매 불가
                  </Badge>
                )}
                {item.availableStock !== null &&
                  item.availableStock !== undefined &&
                  item.availableStock <= 5 &&
                  item.isAvailable && (
                    <span className="text-xs text-warning">
                      잔여 {item.availableStock}개
                    </span>
                  )}
              </div>

              <div className="flex items-center gap-3 ml-4 shrink-0">
                {/* 수량 조절 */}
                <div className="flex items-center rounded-md border">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-r-none"
                    onClick={() => handleQuantityChange(item, -1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-l-none"
                    onClick={() => handleQuantityChange(item, 1)}
                    disabled={
                      item.availableStock !== null &&
                      item.availableStock !== undefined &&
                      item.quantity >= item.availableStock
                    }
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* 소계 */}
                <span className="w-20 text-right text-sm font-semibold">
                  ₩{item.subtotal.toLocaleString()}
                </span>

                {/* 삭제 버튼 */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setItemToRemove(item)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog
        open={!!itemToRemove}
        onOpenChange={(open) => !open && setItemToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>상품 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              상품 #{itemToRemove?.productId}을(를) 장바구니에서 삭제합니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-destructive hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

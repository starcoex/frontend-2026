import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button, Badge, AspectRatio } from '../ui';
import { useCart } from '@starcoex-frontend/cart';
import type { CartItem } from '@starcoex-frontend/cart';
import { useProducts } from '@starcoex-frontend/products';

interface CartItemCardProps {
  item: CartItem;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(value);
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { updateCartItem, removeFromCart, isLoading } = useCart();
  const { products } = useProducts();

  const product = products.find((p) => p.id === item.productId);
  const imageUrl = product?.imageUrl ?? product?.imageUrls?.[0] ?? null;
  const productName = product?.name ?? `상품 #${item.productId}`;

  const unitPrice = item.currentPrice ?? 0;
  const totalPrice = item.subtotal ?? 0;

  const handleQuantityChange = async (newQty: number) => {
    if (newQty < 1) {
      await removeFromCart({
        productId: item.productId,
        storeId: item.storeId,
      });
      return;
    }
    await updateCartItem({
      productId: item.productId,
      storeId: item.storeId,
      quantity: newQty,
    });
  };

  const handleRemove = async () => {
    await removeFromCart({ productId: item.productId, storeId: item.storeId });
  };

  return (
    <div className="flex gap-4 rounded-xl border bg-card p-4">
      {/* 이미지: 있으면 AspectRatio + img, 없으면 고정 크기 플레이스홀더 */}
      {imageUrl ? (
        <div className="w-28 shrink-0">
          <AspectRatio
            ratio={1}
            className="overflow-hidden rounded-lg bg-muted"
          >
            <img
              src={imageUrl}
              alt={productName}
              className="size-full object-cover"
            />
          </AspectRatio>
        </div>
      ) : (
        <div className="w-28 h-28 shrink-0 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
          <span className="text-xl font-bold text-muted-foreground">
            #{item.productId}
          </span>
        </div>
      )}

      {/* 중앙: 상품 정보 + 수량 */}
      <div className="flex flex-1 flex-col justify-between min-w-0 py-0.5">
        <div className="space-y-1">
          <h3 className="text-base font-medium leading-snug">{productName}</h3>
          <p className="text-sm text-muted-foreground">
            스토어 #{item.storeId}
          </p>
          <p className="text-xs text-muted-foreground">
            SKU: {String(item.productId).padStart(6, '0')}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {item.isAvailable !== false ? (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              >
                재고 있음
              </Badge>
            ) : (
              <Badge variant="secondary">품절</Badge>
            )}
            {item.isPriceChanged === true && (
              <Badge variant="destructive">가격 변동</Badge>
            )}
          </div>
        </div>

        {/* 수량 조절 */}
        <div className="flex items-center gap-2 pt-3">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isLoading || item.quantity <= 1}
          >
            <Minus className="size-3.5" />
          </Button>
          <span className="w-8 text-center text-base font-medium">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={
              isLoading ||
              item.isAvailable === false ||
              (item.availableStock != null &&
                item.quantity >= item.availableStock)
            }
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* 우측: 가격 + 삭제 */}
      <div className="flex flex-col items-end justify-between py-0.5">
        <div className="text-right">
          <p className="text-lg font-semibold">{formatMoney(totalPrice)}</p>
          <p className="text-sm text-muted-foreground">
            {formatMoney(unitPrice)} 개당
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive"
          onClick={handleRemove}
          disabled={isLoading}
        >
          <Trash2 className="mr-1.5 size-4" />
          삭제
        </Button>
      </div>
    </div>
  );
};

import React from 'react';
import { Minus, Plus, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCart } from '@starcoex-frontend/cart';
import type { CartItem } from '@starcoex-frontend/cart';

interface CartItemCardProps {
  item: CartItem;
}

const TYPE_CONFIG: Record<string, { label: string; className: string }> = {
  fuel: {
    label: '연료',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  },
  service: {
    label: '서비스',
    className:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  },
  product: {
    label: '상품',
    className:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  },
};

function formatMoney(value: number) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(value);
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { updateCartItem, removeFromCart, isLoading } = useCart();

  const typeConfig = TYPE_CONFIG[item.type ?? ''] ?? {
    label: '상품',
    className: 'bg-gray-100 text-gray-800',
  };

  const unitPrice = item.price ?? item.unitPrice ?? 0;
  const totalPrice = unitPrice * item.quantity;

  const handleQuantityChange = async (newQty: number) => {
    if (newQty < 1) {
      await removeFromCart({ cartItemId: item.id });
      return;
    }
    await updateCartItem({ cartItemId: item.id, quantity: newQty });
  };

  const handleRemove = async () => {
    await removeFromCart({ cartItemId: item.id });
  };

  return (
    <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-[1.6fr_0.5fr_0.7fr_0.5fr] md:items-center md:px-4">
      {/* 상품 정보 */}
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-lg text-muted-foreground font-medium">
              {item.name.charAt(0)}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{item.name}</p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {item.type && (
              <Badge
                variant="secondary"
                className={cn('text-xs', typeConfig.className)}
              >
                {typeConfig.label}
              </Badge>
            )}
            {item.stationName && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{item.stationName}</span>
              </div>
            )}
          </div>
        </div>

        {/* 모바일 제거 버튼 */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden w-8 h-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleRemove}
          disabled={isLoading}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* 단가 — 데스크톱 */}
      <div className="hidden md:block text-sm text-muted-foreground">
        {formatMoney(unitPrice)}
      </div>

      {/* 수량 조절 */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-8 h-8 p-0"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={isLoading || item.quantity <= 1}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <div className="min-w-[2rem] h-8 flex items-center justify-center text-sm font-medium bg-muted rounded">
          {item.quantity}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-8 h-8 p-0"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isLoading}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      {/* 합계 + 데스크톱 제거 버튼 */}
      <div className="flex items-center justify-between md:justify-end gap-2">
        <span className="text-sm font-semibold">{formatMoney(totalPrice)}</span>
        <Button
          variant="ghost"
          size="sm"
          className="hidden md:flex w-8 h-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleRemove}
          disabled={isLoading}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

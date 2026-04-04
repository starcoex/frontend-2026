import { ShoppingCart, PackageCheck, AlertTriangle, Ban } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@starcoex-frontend/cart';

export function CartStats() {
  const { cart } = useCart();

  const unavailableCount =
    cart?.items?.filter((item) => !item.isAvailable).length ?? 0;
  const priceChangedCount =
    cart?.items?.filter((item) => item.isPriceChanged).length ?? 0;

  const statItems = [
    {
      label: '총 상품 수',
      value: cart?.itemCount ?? 0,
      icon: ShoppingCart,
      badge: cart?.isEmpty
        ? { label: '비어있음', variant: 'secondary' as const }
        : { label: '상품 있음', variant: 'success' as const },
    },
    {
      label: '총 금액',
      value: `₩${(cart?.totalAmount ?? 0).toLocaleString()}`,
      icon: PackageCheck,
      badge:
        cart?.estimatedShipping === 0
          ? { label: '무료 배송', variant: 'success' as const }
          : null,
    },
    {
      label: '가격 변동',
      value: priceChangedCount,
      icon: AlertTriangle,
      badge:
        priceChangedCount > 0
          ? { label: '확인 필요', variant: 'warning' as const }
          : { label: '정상', variant: 'outline' as const },
    },
    {
      label: '구매 불가',
      value: unavailableCount,
      icon: Ban,
      badge:
        unavailableCount > 0
          ? { label: '처리 필요', variant: 'destructive' as const }
          : { label: '정상', variant: 'outline' as const },
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat) => (
        <Card key={stat.label}>
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <stat.icon className="size-4 opacity-60" />
              {stat.label}
            </CardDescription>
            <CardTitle className="font-display text-2xl lg:text-3xl">
              {stat.value}
            </CardTitle>
            {stat.badge && (
              <CardAction>
                <Badge variant={stat.badge.variant}>{stat.badge.label}</Badge>
              </CardAction>
            )}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

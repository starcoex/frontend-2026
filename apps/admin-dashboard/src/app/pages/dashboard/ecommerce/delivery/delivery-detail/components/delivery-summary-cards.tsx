import { Package, User, Truck } from 'lucide-react';
import type { Delivery } from '@starcoex-frontend/delivery';
import {
  formatDeliveryFee,
  formatEstimatedTime,
} from '@/app/pages/dashboard/ecommerce/delivery/data/delivery-data';

export function DeliverySummaryCards({ d }: { d: Delivery }) {
  const items = [
    { label: '배송비', value: formatDeliveryFee(d.deliveryFee), icon: Package },
    { label: '기사 수령액', value: formatDeliveryFee(d.driverFee), icon: User },
    { label: '아이템 수', value: `${d.itemCount}개`, icon: Package },
    {
      label: '예상 소요시간',
      value: d.estimatedTime ? formatEstimatedTime(d.estimatedTime) : '-',
      icon: Truck,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-muted hover:border-primary/30 grid auto-cols-max grid-flow-col gap-4 rounded-lg border p-4"
        >
          <item.icon className="size-6 opacity-40" />
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm">{item.label}</span>
            <span className="text-lg font-semibold">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

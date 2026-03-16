import { Badge } from '@/components/ui/badge';
import {
  ORDER_FULFILLMENT_OPTIONS,
  ORDER_PAYMENT_STATUS_OPTIONS,
  ORDER_STATUS_OPTIONS,
  OrderFulfillmentValue,
  OrderPaymentStatusValue,
  OrderStatusValue,
} from '@/app/pages/dashboard/ecommerce/orders/data/order-data';

// 빠른 조회용 Map
const ORDER_STATUS_MAP = Object.fromEntries(
  ORDER_STATUS_OPTIONS.map((o) => [o.value, o])
) as Record<OrderStatusValue, (typeof ORDER_STATUS_OPTIONS)[number]>;

const PAYMENT_STATUS_MAP = Object.fromEntries(
  ORDER_PAYMENT_STATUS_OPTIONS.map((o) => [o.value, o])
) as Record<
  OrderPaymentStatusValue,
  (typeof ORDER_PAYMENT_STATUS_OPTIONS)[number]
>;

const FULFILLMENT_MAP = Object.fromEntries(
  ORDER_FULFILLMENT_OPTIONS.map((o) => [o.value, o])
) as Record<OrderFulfillmentValue, (typeof ORDER_FULFILLMENT_OPTIONS)[number]>;

export function OrderStatusBadge({ status }: { status: OrderStatusValue }) {
  const config = ORDER_STATUS_MAP[status];
  return (
    <Badge variant={config?.variant as any}>{config?.label ?? status}</Badge>
  );
}

export function PaymentStatusBadge({
  status,
}: {
  status: OrderPaymentStatusValue;
}) {
  const config = PAYMENT_STATUS_MAP[status];
  return (
    <Badge variant={config?.variant as any}>{config?.label ?? status}</Badge>
  );
}

export function FulfillmentBadge({ type }: { type: OrderFulfillmentValue }) {
  const config = FULFILLMENT_MAP[type];
  return <Badge variant="outline">{config?.label ?? type}</Badge>;
}

// 외부 참조용 re-export
export { ORDER_STATUS_MAP, PAYMENT_STATUS_MAP };

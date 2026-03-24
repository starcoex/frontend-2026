export const HEATING_OIL_DELIVERY_STATUS_OPTIONS = [
  { value: 'PENDING', label: '대기 중' },
  { value: 'CONFIRMED', label: '확정' },
  { value: 'DRIVER_ASSIGNED', label: '기사 배정' },
  { value: 'DISPATCHED', label: '출발' },
  { value: 'ARRIVED', label: '도착' },
  { value: 'COMPLETED', label: '완료' },
  { value: 'CANCELLED', label: '취소됨' },
  { value: 'REFUND_REQUESTED', label: '환불 요청' },
  { value: 'REFUNDED', label: '환불 완료' },
] as const;

export type HeatingOilDeliveryStatusValue =
  (typeof HEATING_OIL_DELIVERY_STATUS_OPTIONS)[number]['value'];

export const HEATING_OIL_DELIVERY_STATUS_CONFIG: Record<
  HeatingOilDeliveryStatusValue,
  {
    label: string;
    variant:
      | 'default'
      | 'success'
      | 'warning'
      | 'destructive'
      | 'outline'
      | 'secondary';
  }
> = {
  PENDING: { label: '대기 중', variant: 'warning' },
  CONFIRMED: { label: '확정', variant: 'default' },
  DRIVER_ASSIGNED: { label: '기사 배정', variant: 'default' },
  DISPATCHED: { label: '출발', variant: 'success' },
  ARRIVED: { label: '도착', variant: 'success' },
  COMPLETED: { label: '완료', variant: 'outline' },
  CANCELLED: { label: '취소됨', variant: 'secondary' },
  REFUND_REQUESTED: { label: '환불 요청', variant: 'warning' },
  REFUNDED: { label: '환불 완료', variant: 'outline' },
};

export const HEATING_OIL_FUEL_TYPE_LABELS: Record<string, string> = {
  KEROSENE: '등유',
};

export const HEATING_OIL_ORDER_TYPE_LABELS: Record<string, string> = {
  STANDARD: '일반',
  URGENT: '긴급',
};

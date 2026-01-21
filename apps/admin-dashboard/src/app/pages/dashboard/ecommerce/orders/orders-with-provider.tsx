import { OrdersLayout } from '@/app/pages/dashboard/ecommerce/orders/orders-layout';

// Orders는 특별한 Provider가 필요 없지만, 일관성을 위해 구조 유지
export const OrdersWithProvider = () => {
  return <OrdersLayout />;
};

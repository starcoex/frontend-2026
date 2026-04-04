import { NotificationsProvider } from '@starcoex-frontend/notifications';
import { NotificationsLayout } from '@/app/pages/dashboard/ecommerce/notifications/notifications-layout';
import { ProductsProvider } from '@starcoex-frontend/products';
import { PaymentsProvider } from '@starcoex-frontend/payments';
import { OrdersProvider } from '@starcoex-frontend/orders';
import { ReservationsProvider } from '@starcoex-frontend/reservations';

export const NotificationsWithProvider = () => {
  return (
    <NotificationsProvider>
      <ReservationsProvider>
        <PaymentsProvider>
          <OrdersProvider>
            <ProductsProvider>
              <NotificationsLayout />
            </ProductsProvider>
          </OrdersProvider>
        </PaymentsProvider>
      </ReservationsProvider>
    </NotificationsProvider>
  );
};

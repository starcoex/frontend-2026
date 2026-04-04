import { DeliveryProvider } from '@starcoex-frontend/delivery';
import { StoresProvider } from '@starcoex-frontend/stores';
import { DeliveryLayout } from '@/app/pages/dashboard/ecommerce/delivery/delivery-layout';
import { OrdersProvider } from '@starcoex-frontend/orders';
import { ReservationsProvider } from '@starcoex-frontend/reservations';

export const DeliveryWithProvider = () => {
  return (
    <StoresProvider>
      <DeliveryProvider>
        <OrdersProvider>
          <ReservationsProvider>
            <DeliveryLayout />
          </ReservationsProvider>
        </OrdersProvider>
      </DeliveryProvider>
    </StoresProvider>
  );
};

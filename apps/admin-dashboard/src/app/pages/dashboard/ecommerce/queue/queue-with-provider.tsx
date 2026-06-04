import { QueueLayout } from '@/app/pages/dashboard/ecommerce/queue/queue-layout';
import { QueueProvider } from '@starcoex-frontend/queue';
import { StoresProvider } from '@starcoex-frontend/stores';
import { ReservationsProvider } from '@starcoex-frontend/reservations';

export const QueueWithProvider = () => {
  return (
    <QueueProvider>
      <StoresProvider>
        <ReservationsProvider>
          <QueueLayout />
        </ReservationsProvider>
      </StoresProvider>
    </QueueProvider>
  );
};

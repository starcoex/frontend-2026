import { ReservationsProvider } from '@starcoex-frontend/reservations';
import { StoresProvider } from '@starcoex-frontend/stores';
import { WalkInsLayout } from './walk-ins-layout';

export const WalkInsWithProvider = () => {
  return (
    <StoresProvider>
      <ReservationsProvider>
        <WalkInsLayout />
      </ReservationsProvider>
    </StoresProvider>
  );
};

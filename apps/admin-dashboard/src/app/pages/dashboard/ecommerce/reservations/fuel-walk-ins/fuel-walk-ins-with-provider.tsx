import { FuelWalkInsProvider } from '@starcoex-frontend/reservations';
import { StoresProvider } from '@starcoex-frontend/stores';
import { FuelWalkInsLayout } from './fuel-walk-ins-layout';

export const FuelWalkInsWithProvider = () => {
  return (
    <StoresProvider>
      <FuelWalkInsProvider>
        <FuelWalkInsLayout />
      </FuelWalkInsProvider>
    </StoresProvider>
  );
};

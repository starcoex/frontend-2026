import { VehicleProvider } from '@starcoex-frontend/vehicles';
import { VehiclesLayout } from '@/app/pages/dashboard/ecommerce/vehicles/vehicles-layout';

export const VehiclesWithProvider = () => {
  return (
    <VehicleProvider>
      <VehiclesLayout />
    </VehicleProvider>
  );
};

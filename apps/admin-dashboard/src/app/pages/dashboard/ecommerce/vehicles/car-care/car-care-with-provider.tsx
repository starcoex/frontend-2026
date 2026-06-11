import { CarCareProvider } from '@starcoex-frontend/vehicles';
import { CarCareLayout } from '@/app/pages/dashboard/ecommerce/vehicles/car-care/car-care-layout';

export const CarCareWithProvider = () => {
  return (
    <CarCareProvider>
      <CarCareLayout />
    </CarCareProvider>
  );
};

import { ApickProvider } from '@starcoex-frontend/vehicles';
import { ApickLayout } from '@/app/pages/dashboard/ecommerce/vehicles/apick/apick-layout';

export const ApickWithProvider = () => {
  return (
    <ApickProvider>
      <ApickLayout />
    </ApickProvider>
  );
};

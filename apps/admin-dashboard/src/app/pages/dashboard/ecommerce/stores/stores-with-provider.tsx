import { StoresProvider } from '@starcoex-frontend/stores';
import { StoresLayout } from '@/app/pages/dashboard/ecommerce/stores/stores-layout';

export const StoresWithProvider = () => {
  return (
    <StoresProvider>
      <StoresLayout />
    </StoresProvider>
  );
};

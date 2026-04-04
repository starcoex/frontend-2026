import { StoresProvider } from '@starcoex-frontend/stores';
import { StoresLayout } from '@/app/pages/dashboard/ecommerce/stores/stores-layout';
import { MediaProvider } from '@starcoex-frontend/media';

export const StoresWithProvider = () => {
  return (
    <MediaProvider>
      <StoresProvider>
        <StoresLayout />
      </StoresProvider>
    </MediaProvider>
  );
};

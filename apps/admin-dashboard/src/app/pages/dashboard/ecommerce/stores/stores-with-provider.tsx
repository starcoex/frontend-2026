import { StoresProvider } from '@starcoex-frontend/stores';
import { StoresLayout } from '@/app/pages/dashboard/ecommerce/stores/stores-layout';
import { MediaProvider } from '@starcoex-frontend/media';
import { QueueProvider } from '@starcoex-frontend/queue';

export const StoresWithProvider = () => {
  return (
    <MediaProvider>
      <StoresProvider>
        <QueueProvider>
          <StoresLayout />
        </QueueProvider>
      </StoresProvider>
    </MediaProvider>
  );
};

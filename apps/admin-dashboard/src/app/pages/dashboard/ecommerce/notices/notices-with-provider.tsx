import { NoticesLayout } from '@/app/pages/dashboard/ecommerce/notices/notices-layout';
import { NoticesProvider } from '@starcoex-frontend/notices';
import { MediaProvider } from '@starcoex-frontend/media';

export const NoticesWithProvider = () => {
  return (
    <NoticesProvider>
      <MediaProvider>
        <NoticesLayout />
      </MediaProvider>
    </NoticesProvider>
  );
};

import { PromotionsProvider } from '@starcoex-frontend/promotions';
import { PromotionsLayout } from '@/app/pages/dashboard/ecommerce/promotions/promotions-layout';
import { MediaProvider } from '@starcoex-frontend/media';

export const PromotionsWithProvider = () => {
  return (
    <MediaProvider>
      <PromotionsProvider>
        <PromotionsLayout />
      </PromotionsProvider>
    </MediaProvider>
  );
};

import { ReviewsLayout } from '@/app/pages/dashboard/ecommerce/reviews/reviews-layout';
import { ReviewsProvider } from '@starcoex-frontend/reviews';
import { ProductsProvider } from '@starcoex-frontend/products';
import { StoresProvider } from '@starcoex-frontend/stores';
import { DeliveryProvider } from '@starcoex-frontend/delivery';
import { ReservationsProvider } from '@starcoex-frontend/reservations';

export const ReviewsWithProvider = () => {
  return (
    <ReviewsProvider>
      <ProductsProvider>
        <StoresProvider>
          <DeliveryProvider>
            <ReservationsProvider>
              <ReviewsLayout />
            </ReservationsProvider>
          </DeliveryProvider>
        </StoresProvider>
      </ProductsProvider>
    </ReviewsProvider>
  );
};

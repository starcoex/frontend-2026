import { AnalyticsProvider } from '@starcoex-frontend/analytics';
import { PaymentsProvider } from '@starcoex-frontend/payments';
import { OrdersProvider } from '@starcoex-frontend/orders';
import { ReservationsProvider } from '@starcoex-frontend/reservations';
import { DeliveryProvider } from '@starcoex-frontend/delivery';
import { LoyaltyProvider } from '@starcoex-frontend/loyalty';
import { PromotionsProvider } from '@starcoex-frontend/promotions';
import { ReviewsProvider } from '@starcoex-frontend/reviews';
import { StoresProvider } from '@starcoex-frontend/stores';
import { OverviewPage } from '@/app/pages/dashboard/board/overview/overview-page';

export const OverviewWithProvider = () => {
  return (
    <AnalyticsProvider>
      <PaymentsProvider>
        <OrdersProvider>
          <ReservationsProvider>
            <DeliveryProvider>
              <LoyaltyProvider>
                <PromotionsProvider>
                  <ReviewsProvider>
                    <StoresProvider>
                      <OverviewPage />
                    </StoresProvider>
                  </ReviewsProvider>
                </PromotionsProvider>
              </LoyaltyProvider>
            </DeliveryProvider>
          </ReservationsProvider>
        </OrdersProvider>
      </PaymentsProvider>
    </AnalyticsProvider>
  );
};

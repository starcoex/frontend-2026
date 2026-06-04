import { PaymentsProvider } from '@starcoex-frontend/payments';
import { OrdersProvider } from '@starcoex-frontend/orders';
import { ProductsProvider } from '@starcoex-frontend/products';
import { AnalyticsProvider } from '@starcoex-frontend/analytics';
import { SalesLayout } from '@/app/pages/dashboard/board/sales/sales-layout';

export const SalesWithProvider = () => {
  return (
    <AnalyticsProvider>
      <PaymentsProvider>
        <OrdersProvider>
          <ProductsProvider>
            <SalesLayout />
          </ProductsProvider>
        </OrdersProvider>
      </PaymentsProvider>
    </AnalyticsProvider>
  );
};

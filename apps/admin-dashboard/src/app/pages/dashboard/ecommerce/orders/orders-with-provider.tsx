import { OrdersLayout } from '@/app/pages/dashboard/ecommerce/orders/orders-layout';
import { OrdersProvider } from '@starcoex-frontend/orders';
import { StoresProvider } from '@starcoex-frontend/stores';
import { ProductsProvider } from '@starcoex-frontend/products';

export const OrdersWithProvider = () => {
  return (
    <ProductsProvider>
      <StoresProvider>
        <OrdersProvider>
          <OrdersLayout />
        </OrdersProvider>
      </StoresProvider>
    </ProductsProvider>
  );
};

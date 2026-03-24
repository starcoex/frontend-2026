import { HeatingOilDeliveriesProvider } from '@starcoex-frontend/reservations';
import { StoresProvider } from '@starcoex-frontend/stores';
import { ProductsProvider } from '@starcoex-frontend/products';
import { HeatingOilDeliveriesLayout } from './heating-oil-deliveries-layout';

export const HeatingOilDeliveriesWithProvider = () => {
  return (
    <ProductsProvider>
      <StoresProvider>
        <HeatingOilDeliveriesProvider>
          <HeatingOilDeliveriesLayout />
        </HeatingOilDeliveriesProvider>
      </StoresProvider>
    </ProductsProvider>
  );
};

import { ReservationsProvider } from '@starcoex-frontend/reservations';
import { ReservationsLayout } from '@/app/pages/dashboard/ecommerce/reservations/reservation-layout';
import { StoresProvider } from '@starcoex-frontend/stores';
import { ProductsProvider } from '@starcoex-frontend/products';
import { CategoriesProvider } from '@starcoex-frontend/categories';

export const ReservationsWithProvider = () => {
  return (
    <CategoriesProvider>
      <ProductsProvider>
        <StoresProvider>
          <ReservationsProvider>
            <ReservationsLayout />
          </ReservationsProvider>
        </StoresProvider>
      </ProductsProvider>
    </CategoriesProvider>
  );
};

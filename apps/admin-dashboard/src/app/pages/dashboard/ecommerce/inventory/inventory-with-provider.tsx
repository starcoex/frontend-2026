import { InventoryProvider } from '@starcoex-frontend/inventory';
import { StoresProvider } from '@starcoex-frontend/stores';
import { InventoryLayout } from '@/app/pages/dashboard/ecommerce/inventory/inventory-layout';
import { ProductsProvider } from '@starcoex-frontend/products';

export const InventoryWithProvider = () => {
  return (
    <StoresProvider>
      <ProductsProvider>
        <InventoryProvider>
          <InventoryLayout />
        </InventoryProvider>
      </ProductsProvider>
    </StoresProvider>
  );
};

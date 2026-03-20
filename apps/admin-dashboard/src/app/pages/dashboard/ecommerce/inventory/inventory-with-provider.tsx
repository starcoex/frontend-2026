import { InventoryProvider } from '@starcoex-frontend/inventory';
import { StoresProvider } from '@starcoex-frontend/stores';
import { InventoryLayout } from '@/app/pages/dashboard/ecommerce/inventory/inventory-layout';

export const InventoryWithProvider = () => {
  return (
    <StoresProvider>
      <InventoryProvider>
        <InventoryLayout />
      </InventoryProvider>
    </StoresProvider>
  );
};

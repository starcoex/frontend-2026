import { AddressProvider } from '@starcoex-frontend/address';
import { AddressLayout } from '@/app/pages/dashboard/ecommerce/address/address-layout';

export const AddressWithProvider = () => {
  return (
    <AddressProvider>
      <AddressLayout />
    </AddressProvider>
  );
};

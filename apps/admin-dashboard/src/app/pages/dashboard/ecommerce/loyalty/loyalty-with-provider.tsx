import { LoyaltyProvider } from '@starcoex-frontend/loyalty';
import { UsersProvider } from '@starcoex-frontend/auth';
import { LoyaltyLayout } from '@/app/pages/dashboard/ecommerce/loyalty/loyalty-layout';

export const LoyaltyWithProvider = () => {
  return (
    <UsersProvider>
      <LoyaltyProvider>
        <LoyaltyLayout />
      </LoyaltyProvider>
    </UsersProvider>
  );
};

import { PaymentsProvider } from '@starcoex-frontend/payments';
import { PaymentsLayout } from '@/app/pages/dashboard/ecommerce/payments/payments-layout';

export const PaymentsWithProvider = () => {
  return (
    <PaymentsProvider>
      <PaymentsLayout />
    </PaymentsProvider>
  );
};

import { NotificationsProvider } from '@starcoex-frontend/notifications';
import { PaymentsProvider } from '@starcoex-frontend/payments';
import { SettingsLayout } from './settings-layout';

export const SettingsWithProvider = () => {
  return (
    <NotificationsProvider>
      <PaymentsProvider>
        <SettingsLayout />
      </PaymentsProvider>
    </NotificationsProvider>
  );
};

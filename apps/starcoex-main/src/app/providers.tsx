import { Toaster } from 'sonner';
import { ThemeProvider } from '@starcoex-frontend/common';
import * as React from 'react';
import { AddressProvider } from '@starcoex-frontend/address';
import { MediaProvider } from '@starcoex-frontend/media';
import { LoyaltyProvider } from '@starcoex-frontend/loyalty';
import { JobsProvider } from '@starcoex-frontend/jobs';
import { ContactsProvider } from '@starcoex-frontend/contact';
import { OrdersProvider } from '@starcoex-frontend/orders';
import { NotificationsProvider } from '@starcoex-frontend/notifications';
import { PaymentsProvider } from '@starcoex-frontend/payments';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="starcoex-main-theme">
      <AddressProvider>
        <MediaProvider>
          <LoyaltyProvider>
            <JobsProvider>
              <ContactsProvider>
                <JobsProvider>
                  <OrdersProvider>
                    <NotificationsProvider>
                      <PaymentsProvider>{children}</PaymentsProvider>
                    </NotificationsProvider>
                  </OrdersProvider>
                </JobsProvider>
              </ContactsProvider>
            </JobsProvider>
          </LoyaltyProvider>
        </MediaProvider>
      </AddressProvider>
      <Toaster
        position="top-right"
        richColors
        closeButton
        expand={false}
        duration={4000}
        theme="system" // 테마에 따라 자동 변경
      />
    </ThemeProvider>
  );
};

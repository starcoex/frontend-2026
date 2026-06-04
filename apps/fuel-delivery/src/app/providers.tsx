import { Toaster } from 'sonner';
import { ThemeProvider } from '@starcoex-frontend/common';
import * as React from 'react';
import { LoyaltyProvider } from '@starcoex-frontend/loyalty';
import { NotificationsProvider } from '@starcoex-frontend/notifications';
import { QueueProvider } from '@starcoex-frontend/queue';
import { StoresProvider } from '@starcoex-frontend/stores';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="fuel-delivery-theme">
      <LoyaltyProvider>
        <QueueProvider>
          <StoresProvider>
            <NotificationsProvider>{children}</NotificationsProvider>
          </StoresProvider>
        </QueueProvider>
      </LoyaltyProvider>
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

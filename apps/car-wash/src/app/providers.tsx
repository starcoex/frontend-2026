import { Toaster } from 'sonner';
import { ThemeProvider } from '@starcoex-frontend/common';
import * as React from 'react';
import { LoyaltyProvider } from '@starcoex-frontend/loyalty';
import { FuelDataProvider } from '@starcoex-frontend/vehicles';
import { QueueProvider } from '@starcoex-frontend/queue';
import { StoresProvider } from '@starcoex-frontend/stores';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="car-wash-theme">
      <LoyaltyProvider>
        <FuelDataProvider autoLoad={true}>
          <QueueProvider>
            <StoresProvider>{children}</StoresProvider>
          </QueueProvider>
        </FuelDataProvider>
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

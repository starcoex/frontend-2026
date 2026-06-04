import { Toaster } from 'sonner';
import { ThemeProvider } from '@starcoex-frontend/common';
import * as React from 'react';
import { AddressProvider } from '@starcoex-frontend/address';
import { MediaProvider } from '@starcoex-frontend/media';
import { LoyaltyProvider } from '@starcoex-frontend/loyalty';
import { JobsProvider } from '@starcoex-frontend/jobs';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="starcoex-main-theme">
      <AddressProvider>
        <MediaProvider>
          <LoyaltyProvider>
            <JobsProvider>{children}</JobsProvider>
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

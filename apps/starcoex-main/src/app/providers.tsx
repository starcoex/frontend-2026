import { Toaster } from 'sonner';
import { ThemeProvider } from '@starcoex-frontend/common';
import * as React from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="starcoex-main-theme">
      {children}
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

import { Toaster } from 'sonner';
import { ThemeProvider } from '@starcoex-frontend/common';
import * as React from 'react';
import { ProductsProvider } from '@starcoex-frontend/products';
import { OrdersProvider } from '@starcoex-frontend/orders';
import { PaymentsProvider } from '@starcoex-frontend/payments';
import { NotificationsProvider } from '@starcoex-frontend/notifications';
import { CartProvider } from '@starcoex-frontend/cart';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="gas-station-theme">
      <ProductsProvider>
        <OrdersProvider>
          <PaymentsProvider>
            <NotificationsProvider>
              <CartProvider>{children}</CartProvider>
            </NotificationsProvider>
          </PaymentsProvider>
        </OrdersProvider>
      </ProductsProvider>
      <Toaster
        position="top-right"
        richColors
        closeButton
        expand={false}
        duration={4000}
        theme="system"
      />
    </ThemeProvider>
  );
};

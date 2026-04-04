import { CartProvider } from '@starcoex-frontend/cart';
import { CartLayout } from '@/app/pages/dashboard/ecommerce/cart/cart-layout';

export const CartWithProvider = () => {
  return (
    <CartProvider>
      <CartLayout />
    </CartProvider>
  );
};

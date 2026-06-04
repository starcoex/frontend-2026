import { CartProvider } from '@starcoex-frontend/cart';
import { CartLayout } from '@/app/pages/dashboard/ecommerce/cart/cart-layout';
import { ProductsProvider } from '@starcoex-frontend/products';
import { StoresProvider } from '@starcoex-frontend/stores';

export const CartWithProvider = () => {
  return (
    <ProductsProvider>
      <StoresProvider>
        <CartProvider>
          <CartLayout />
        </CartProvider>
      </StoresProvider>
    </ProductsProvider>
  );
};

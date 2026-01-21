import { ProductsLayout } from '@/app/pages/dashboard/ecommerce/products/products-layout';
import { ProductsProvider } from '@starcoex-frontend/products';
import { MediaProvider } from '@starcoex-frontend/media';

export const ProductsWithProvider = () => {
  return (
    <MediaProvider>
      <ProductsProvider>
        <ProductsLayout />
      </ProductsProvider>
    </MediaProvider>
  );
};

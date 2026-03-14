import { ProductsLayout } from '@/app/pages/dashboard/ecommerce/products/products-layout';
import { ProductsProvider } from '@starcoex-frontend/products';
import { MediaProvider } from '@starcoex-frontend/media';
import { StoresProvider } from '@starcoex-frontend/stores';
import { CategoriesProvider } from '@starcoex-frontend/categories';

export const ProductsWithProvider = () => {
  return (
    <MediaProvider>
      <CategoriesProvider>
        <StoresProvider>
          <ProductsProvider>
            <ProductsLayout />
          </ProductsProvider>
        </StoresProvider>
      </CategoriesProvider>
    </MediaProvider>
  );
};

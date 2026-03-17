import { ProductsProvider } from '@starcoex-frontend/products';
import ProductScanPage from '@/app/pages/dashboard/ecommerce/products/scan/product-scan';

export const ProductScanWithProvider = () => {
  return (
    <ProductsProvider>
      <ProductScanPage />
    </ProductsProvider>
  );
};

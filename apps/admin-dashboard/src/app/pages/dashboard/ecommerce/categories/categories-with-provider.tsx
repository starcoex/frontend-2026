import { CategoriesProvider } from '@starcoex-frontend/categories';
import CategoriesLayout from '@/app/pages/dashboard/ecommerce/categories/categories-layout';

export const CategoriesWithProvider = () => {
  return (
    <CategoriesProvider>
      <CategoriesLayout />
    </CategoriesProvider>
  );
};

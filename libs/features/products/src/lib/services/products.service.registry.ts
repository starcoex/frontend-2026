import type { ApolloClient } from '@apollo/client';
import { ProductsService } from './products.service';
import { serviceRegistry } from './service-registry';

serviceRegistry.registerService<ProductsService>(
  'products',
  (ctx: ApolloClient) => new ProductsService(ctx)
);

export const initProductsService = (client: ApolloClient): ProductsService => {
  return serviceRegistry.initializeService<ProductsService>('products', client);
};

export const getProductsService = (): ProductsService => {
  return serviceRegistry.getService<ProductsService>('products');
};

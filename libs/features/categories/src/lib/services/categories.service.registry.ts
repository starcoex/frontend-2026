import type { ApolloClient } from '@apollo/client';
import { CategoriesService } from './categories.service';
import { serviceRegistry } from './service-registry';

serviceRegistry.registerService<CategoriesService>(
  'categories',
  (ctx: ApolloClient) => new CategoriesService(ctx)
);

export const initCategoriesService = (
  client: ApolloClient
): CategoriesService => {
  return serviceRegistry.initializeService<CategoriesService>(
    'categories',
    client
  );
};

export const getCategoriesService = (): CategoriesService => {
  return serviceRegistry.getService<CategoriesService>('categories');
};

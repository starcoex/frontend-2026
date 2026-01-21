import type { ApolloClient } from '@apollo/client';
import { StoresService } from './stores.service';
import { serviceRegistry } from './service-registry';

export const createStoresService = (client: ApolloClient): StoresService =>
  new StoresService(client);

serviceRegistry.registerService<StoresService>(
  'stores',
  (ctx: ApolloClient) => {
    return new StoresService(ctx);
  }
);

export const initStoresService = (client: ApolloClient): StoresService => {
  return serviceRegistry.initializeService<StoresService>('stores', client);
};

export const getStoresService = (): StoresService => {
  return serviceRegistry.getService<StoresService>('stores');
};

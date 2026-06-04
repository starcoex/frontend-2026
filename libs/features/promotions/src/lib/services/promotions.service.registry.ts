import type { ApolloClient } from '@apollo/client';
import { PromotionsService } from './promotions.service';
import { serviceRegistry } from './service-registry';

export const createPromotionsService = (
  client: ApolloClient
): PromotionsService => new PromotionsService(client);

serviceRegistry.registerService<PromotionsService>(
  'promotions',
  (ctx: ApolloClient) => {
    return new PromotionsService(ctx);
  }
);

export const initPromotionsService = (
  client: ApolloClient
): PromotionsService => {
  return serviceRegistry.initializeService<PromotionsService>(
    'promotions',
    client
  );
};

export const getPromotionsService = (): PromotionsService => {
  return serviceRegistry.getService<PromotionsService>('promotions');
};

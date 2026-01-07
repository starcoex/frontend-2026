import type { ApolloClient } from '@apollo/client';
import { LoyaltyService } from './loyalty.service';
import { serviceRegistry } from './service-registry';

export const createLoyaltyService = (client: ApolloClient): LoyaltyService =>
  new LoyaltyService(client);

serviceRegistry.registerService<LoyaltyService>(
  'loyalty',
  (ctx: ApolloClient) => {
    return new LoyaltyService(ctx);
  }
);

export const initLoyaltyService = (client: ApolloClient): LoyaltyService => {
  return serviceRegistry.initializeService<LoyaltyService>('loyalty', client);
};

export const getLoyaltyService = (): LoyaltyService => {
  return serviceRegistry.getService<LoyaltyService>('loyalty');
};

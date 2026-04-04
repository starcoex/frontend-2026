import type { ApolloClient } from '@apollo/client';
import { DeliveryService } from './delivery.service';
import { serviceRegistry } from './service-registry';

serviceRegistry.registerService<DeliveryService>(
  'delivery',
  (ctx: ApolloClient) => new DeliveryService(ctx)
);

export const initDeliveryService = (client: ApolloClient): DeliveryService => {
  return serviceRegistry.initializeService<DeliveryService>('delivery', client);
};

export const getDeliveryService = (): DeliveryService => {
  return serviceRegistry.getService<DeliveryService>('delivery');
};

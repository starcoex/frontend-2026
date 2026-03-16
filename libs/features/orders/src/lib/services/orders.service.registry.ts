import type { ApolloClient } from '@apollo/client';
import { OrdersService } from './orders.service';
import { serviceRegistry } from './service-registry';

serviceRegistry.registerService<OrdersService>(
  'orders',
  (ctx: ApolloClient) => new OrdersService(ctx)
);

export const initOrdersService = (client: ApolloClient): OrdersService => {
  return serviceRegistry.initializeService<OrdersService>('orders', client);
};

export const getOrdersService = (): OrdersService => {
  return serviceRegistry.getService<OrdersService>('orders');
};

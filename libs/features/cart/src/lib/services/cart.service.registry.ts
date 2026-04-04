import type { ApolloClient } from '@apollo/client';
import { CartService } from './cart.service';
import { serviceRegistry } from './service-registry';

serviceRegistry.registerService<CartService>(
  'cart',
  (ctx: ApolloClient) => new CartService(ctx)
);

export const initCartService = (client: ApolloClient): CartService => {
  return serviceRegistry.initializeService<CartService>('cart', client);
};

export const getCartService = (): CartService => {
  return serviceRegistry.getService<CartService>('cart');
};

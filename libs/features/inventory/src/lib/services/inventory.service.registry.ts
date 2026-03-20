import type { ApolloClient } from '@apollo/client';
import { InventoryService } from './inventory.service';
import { serviceRegistry } from './service-registry';

serviceRegistry.registerService<InventoryService>(
  'inventory',
  (ctx: ApolloClient) => new InventoryService(ctx)
);

export const initInventoryService = (
  client: ApolloClient
): InventoryService => {
  return serviceRegistry.initializeService<InventoryService>(
    'inventory',
    client
  );
};

export const getInventoryService = (): InventoryService => {
  return serviceRegistry.getService<InventoryService>('inventory');
};

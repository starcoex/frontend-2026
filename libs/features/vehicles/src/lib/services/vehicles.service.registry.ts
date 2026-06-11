import type { ApolloClient } from '@apollo/client';
import { serviceRegistry } from './service-registry';
import { VehiclesService } from '../services';

serviceRegistry.registerService<VehiclesService>(
  'vehicles',
  (ctx: ApolloClient) => new VehiclesService(ctx)
);

export const initVehiclesService = (client: ApolloClient): VehiclesService => {
  return serviceRegistry.initializeService<VehiclesService>('vehicles', client);
};

export const getVehiclesService = (): VehiclesService => {
  return serviceRegistry.getService<VehiclesService>('vehicles');
};

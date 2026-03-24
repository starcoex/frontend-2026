import type { ApolloClient } from '@apollo/client';
import { ReservationsService } from './reservations.service';
import { serviceRegistry } from './service-registry';

serviceRegistry.registerService<ReservationsService>(
  'reservations',
  (ctx: ApolloClient) => new ReservationsService(ctx)
);

export const initReservationsService = (
  client: ApolloClient
): ReservationsService => {
  return serviceRegistry.initializeService<ReservationsService>(
    'reservations',
    client
  );
};

export const getReservationsService = (): ReservationsService => {
  return serviceRegistry.getService<ReservationsService>('reservations');
};

import type { ApolloClient } from '@apollo/client';
import { PaymentsService } from './payments.service';
import { serviceRegistry } from './service-registry';

serviceRegistry.registerService<PaymentsService>(
  'payments',
  (ctx: ApolloClient) => new PaymentsService(ctx)
);

export const initPaymentsService = (client: ApolloClient): PaymentsService => {
  return serviceRegistry.initializeService<PaymentsService>('payments', client);
};

export const getPaymentsService = (): PaymentsService => {
  return serviceRegistry.getService<PaymentsService>('payments');
};

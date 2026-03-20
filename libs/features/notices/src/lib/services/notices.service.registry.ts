import type { ApolloClient } from '@apollo/client';
import { NoticesService } from './notices.service';
import { serviceRegistry } from './service-registry';

serviceRegistry.registerService<NoticesService>(
  'notices',
  (ctx: ApolloClient) => new NoticesService(ctx)
);

export const initNoticesService = (client: ApolloClient): NoticesService => {
  return serviceRegistry.initializeService<NoticesService>('notices', client);
};

export const getNoticesService = (): NoticesService => {
  return serviceRegistry.getService<NoticesService>('notices');
};

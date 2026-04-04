import type { ApolloClient } from '@apollo/client';
import { NotificationsService } from './notifications.service';
import { serviceRegistry } from './service-registry';

serviceRegistry.registerService<NotificationsService>(
  'notifications',
  (ctx: ApolloClient) => new NotificationsService(ctx)
);

export const initNotificationsService = (
  client: ApolloClient
): NotificationsService => {
  return serviceRegistry.initializeService<NotificationsService>(
    'notifications',
    client
  );
};

export const getNotificationsService = (): NotificationsService => {
  return serviceRegistry.getService<NotificationsService>('notifications');
};

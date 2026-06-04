import type { ApolloClient } from '@apollo/client';
import { AnalyticsService } from './analytics.service';
import { serviceRegistry } from './service-registry';

serviceRegistry.registerService<AnalyticsService>(
  'analytics',
  (ctx: ApolloClient) => new AnalyticsService(ctx)
);

export const initAnalyticsService = (
  client: ApolloClient
): AnalyticsService => {
  return serviceRegistry.initializeService<AnalyticsService>(
    'analytics',
    client
  );
};

export const getAnalyticsService = (): AnalyticsService => {
  return serviceRegistry.getService<AnalyticsService>('analytics');
};

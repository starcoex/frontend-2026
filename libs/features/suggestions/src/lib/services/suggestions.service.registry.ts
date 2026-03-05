import type { ApolloClient } from '@apollo/client';
import { SuggestionsService } from './suggestions.service';
import { serviceRegistry } from './service-registry';

serviceRegistry.registerService<SuggestionsService>(
  'suggestions',
  (ctx: ApolloClient) => new SuggestionsService(ctx)
);

export const initSuggestionsService = (
  client: ApolloClient
): SuggestionsService => {
  return serviceRegistry.initializeService<SuggestionsService>(
    'suggestions',
    client
  );
};

export const getSuggestionsService = (): SuggestionsService => {
  return serviceRegistry.getService<SuggestionsService>('suggestions');
};

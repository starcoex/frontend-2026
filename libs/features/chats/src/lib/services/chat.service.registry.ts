import type { ApolloClient } from '@apollo/client';
import { ChatService } from './chat.service';
import { serviceRegistry } from './service-registry';

serviceRegistry.registerService<ChatService>(
  'chat',
  (ctx: ApolloClient) => new ChatService(ctx)
);

export const initChatService = (client: ApolloClient): ChatService => {
  return serviceRegistry.initializeService<ChatService>('chat', client);
};

export const getChatService = (): ChatService => {
  return serviceRegistry.getService<ChatService>('chat');
};

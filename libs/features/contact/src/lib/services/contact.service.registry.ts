import type { ApolloClient } from '@apollo/client';
import { ContactsService } from './contacts.service';
import { serviceRegistry } from './service-registry';

serviceRegistry.registerService<ContactsService>(
  'contact',
  (ctx: ApolloClient) => new ContactsService(ctx)
);

export const initContactsService = (client: ApolloClient): ContactsService => {
  return serviceRegistry.initializeService<ContactsService>('contact', client);
};

export const getContactsService = (): ContactsService => {
  return serviceRegistry.getService<ContactsService>('contact');
};

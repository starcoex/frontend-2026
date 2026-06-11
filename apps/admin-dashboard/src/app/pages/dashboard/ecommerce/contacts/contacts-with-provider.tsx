import { ContactsLayout } from './contacts-layout';
import { ContactsProvider } from '@starcoex-frontend/contact';

export const ContactsWithProvider = () => {
  return (
    <ContactsProvider>
      <ContactsLayout />
    </ContactsProvider>
  );
};

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
  useLayoutEffect,
} from 'react';
import { useApolloClient } from '@apollo/client/react';
import type {
  ContactsState,
  ContactsContextValue,
  ContactFilters,
  Contact,
} from '../types';
import { serviceRegistry, initContactsService } from '../services';

const ContactsContext = createContext<ContactsContextValue | undefined>(
  undefined
);

const initialState: ContactsState = {
  contacts: [],
  currentContact: null,
  filters: {},
  isLoading: false,
  error: null,
  totalCount: 0,
  hasNextPage: false,
};

export const ContactsProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ContactsState>(initialState);
  const apolloClient = useApolloClient();

  useLayoutEffect(() => {
    if (!serviceRegistry.isServiceInitialized('contacts')) {
      try {
        initContactsService(apolloClient);
      } catch (error) {
        console.error('❌ ContactsService initialization failed:', error);
      }
    }
  }, [apolloClient]);

  const setContacts = useCallback(
    (contacts: Contact[]) => setState((prev) => ({ ...prev, contacts })),
    []
  );

  const addContact = useCallback(
    (contact: Contact) =>
      setState((prev) => ({ ...prev, contacts: [contact, ...prev.contacts] })),
    []
  );

  const updateContactInContext = useCallback(
    (id: number, updates: Partial<Contact>) => {
      setState((prev) => ({
        ...prev,
        contacts: prev.contacts.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
        currentContact:
          prev.currentContact?.id === id
            ? { ...prev.currentContact, ...updates }
            : prev.currentContact,
      }));
    },
    []
  );

  const setCurrentContact = useCallback(
    (contact: Contact | null) =>
      setState((prev) => ({ ...prev, currentContact: contact })),
    []
  );

  const setFilters = useCallback(
    (filters: Partial<ContactFilters>) =>
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, ...filters },
      })),
    []
  );

  const clearFilters = useCallback(
    () => setState((prev) => ({ ...prev, filters: {} })),
    []
  );

  const setLoading = useCallback(
    (isLoading: boolean) => setState((prev) => ({ ...prev, isLoading })),
    []
  );

  const setError = useCallback(
    (error: string | null) =>
      setState((prev) => ({ ...prev, error, isLoading: false })),
    []
  );

  const clearError = useCallback(
    () => setState((prev) => ({ ...prev, error: null })),
    []
  );

  const setTotalCount = useCallback(
    (totalCount: number) => setState((prev) => ({ ...prev, totalCount })),
    []
  );

  const reset = useCallback(() => setState(initialState), []);

  const value = useMemo<ContactsContextValue>(
    () => ({
      ...state,
      setContacts,
      addContact,
      updateContactInContext,
      setCurrentContact,
      setFilters,
      clearFilters,
      setLoading,
      setError,
      clearError,
      setTotalCount,
      reset,
    }),
    [
      state,
      setContacts,
      addContact,
      updateContactInContext,
      setCurrentContact,
      setFilters,
      clearFilters,
      setLoading,
      setError,
      clearError,
      setTotalCount,
      reset,
    ]
  );

  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  );
};

export const useContactsContext = (): ContactsContextValue => {
  const ctx = useContext(ContactsContext);
  if (!ctx) {
    throw new Error(
      'useContactsContext must be used within a ContactsProvider'
    );
  }
  return ctx;
};

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
  AddressState,
  AddressContextValue,
  JusoApiAddress,
  Address,
} from '../types';
import { serviceRegistry, initAddressService } from '../services';

const AddressContext = createContext<AddressContextValue | undefined>(
  undefined
);

const initialState: AddressState = {
  selectedAddress: null,
  savedAddresses: [],
  searchResults: [],
  isLoading: false,
  error: null,
};

export const AddressProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AddressState>(initialState);
  const apolloClient = useApolloClient();

  useLayoutEffect(() => {
    if (!serviceRegistry.isServiceInitialized('address')) {
      try {
        initAddressService(apolloClient);
      } catch (error) {
        console.error('❌ AnalyticsService initialization failed:', error);
      }
    }
  }, [apolloClient]);

  const setSelectedAddress = useCallback((address: JusoApiAddress | null) => {
    setState((prev) => ({ ...prev, selectedAddress: address }));
  }, []);

  const setSavedAddresses = useCallback((addresses: Address[]) => {
    setState((prev) => ({ ...prev, savedAddresses: addresses }));
  }, []);

  const setSearchResults = useCallback((results: JusoApiAddress[]) => {
    setState((prev) => ({ ...prev, searchResults: results }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error, isLoading: false }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const clearSearchResults = useCallback(() => {
    setState((prev) => ({ ...prev, searchResults: [] }));
  }, []);

  const clearSelectedAddress = useCallback(() => {
    setState((prev) => ({ ...prev, selectedAddress: null }));
  }, []);

  const reset = useCallback(() => setState(initialState), []);

  const value = useMemo<AddressContextValue>(
    () => ({
      ...state,
      setSelectedAddress,
      setSavedAddresses,
      setSearchResults,
      setLoading,
      setError,
      clearError,
      clearSearchResults,
      clearSelectedAddress,
      reset,
    }),
    [
      state,
      setSelectedAddress,
      setSavedAddresses,
      setSearchResults,
      setLoading,
      setError,
      clearError,
      clearSearchResults,
      clearSelectedAddress,
      reset,
    ]
  );

  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
};

export const useAddressContext = (): AddressContextValue => {
  const ctx = useContext(AddressContext);
  if (!ctx) {
    throw new Error('useAddressContext must be used within an AddressProvider');
  }
  return ctx;
};

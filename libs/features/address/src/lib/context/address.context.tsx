import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import type { Address, JusoApiAddress } from '@starcoex-frontend/graphql';

interface AddressState {
  selectedAddress: JusoApiAddress | null;
  savedAddresses: Partial<Address>[]; // ✅ Partial<Address> 사용
  isLoading: boolean;
  error: string | null;
  searchResults: JusoApiAddress[];
}

interface AddressContextValue extends AddressState {
  setSelectedAddress: (address: JusoApiAddress | null) => void;
  setSavedAddresses: (addresses: Partial<Address>[]) => void; // ✅ Partial<Address>
  setSearchResults: (results: JusoApiAddress[]) => void;
  setLoading: () => void;
  setError: (message: string | null) => void;
  clearError: () => void;
  clearSearchResults: () => void;
  clearSelectedAddress: () => void;
}

const AddressContext = createContext<AddressContextValue | undefined>(
  undefined
);

export const AddressProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AddressState>({
    selectedAddress: null,
    savedAddresses: [],
    isLoading: false,
    error: null,
    searchResults: [],
  });

  const setSelectedAddress = useCallback((address: JusoApiAddress | null) => {
    setState((prev) => ({
      ...prev,
      selectedAddress: address,
      error: null,
    }));
  }, []);

  const setSavedAddresses = useCallback((addresses: Partial<Address>[]) => {
    setState((prev) => ({
      ...prev,
      savedAddresses: addresses,
      isLoading: false,
    }));
  }, []);

  const setSearchResults = useCallback((results: JusoApiAddress[]) => {
    setState((prev) => ({
      ...prev,
      searchResults: results,
      isLoading: false,
      error: null,
    }));
  }, []);

  const setLoading = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
  }, []);

  const setError = useCallback((message: string | null) => {
    setState((prev) => ({
      ...prev,
      isLoading: false,
      error: message,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const clearSearchResults = useCallback(() => {
    setState((prev) => ({
      ...prev,
      searchResults: [],
      error: null,
    }));
  }, []);

  const clearSelectedAddress = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedAddress: null,
    }));
  }, []);

  const value = useMemo(
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
    ]
  );

  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
};

export const useAddressContext = (): AddressContextValue => {
  const ctx = useContext(AddressContext);
  if (!ctx) {
    throw new Error(
      'useAddressContext는 AddressProvider 내부에서만 사용해야 합니다.'
    );
  }
  return ctx;
};

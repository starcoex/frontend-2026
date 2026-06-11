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
  ApickState,
  ApickContextValue,
  GetApickFloodHistoryOutput,
  GetApickScrapHistoryOutput,
  GetApickSaleHistoryOutput,
  ApickSearchResult,
  ApickStatsSummary,
  ApickAccountInfo,
} from '../types';
import { serviceRegistry, initVehiclesService } from '../services';

const ApickContext = createContext<ApickContextValue | undefined>(undefined);

const initialState: ApickState = {
  floodHistory: null,
  scrapHistory: null,
  saleHistory: null,
  searchResult: null,
  stats: null,
  accountInfo: null,
  isLoading: false,
  error: null,
};

export const ApickProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ApickState>(initialState);
  const apolloClient = useApolloClient();

  useLayoutEffect(() => {
    if (!serviceRegistry.isServiceInitialized('vehicles')) {
      try {
        initVehiclesService(apolloClient);
      } catch (error) {
        console.error('❌ VehiclesService initialization failed:', error);
      }
    }
  }, [apolloClient]);

  const setFloodHistory = useCallback(
    (data: GetApickFloodHistoryOutput | null) => {
      setState((prev) => ({ ...prev, floodHistory: data }));
    },
    []
  );

  const setScrapHistory = useCallback(
    (data: GetApickScrapHistoryOutput | null) => {
      setState((prev) => ({ ...prev, scrapHistory: data }));
    },
    []
  );

  const setSaleHistory = useCallback(
    (data: GetApickSaleHistoryOutput | null) => {
      setState((prev) => ({ ...prev, saleHistory: data }));
    },
    []
  );

  const setSearchResult = useCallback((result: ApickSearchResult | null) => {
    setState((prev) => ({ ...prev, searchResult: result }));
  }, []);

  const setStats = useCallback((stats: ApickStatsSummary | null) => {
    setState((prev) => ({ ...prev, stats }));
  }, []);

  const setAccountInfo = useCallback((info: ApickAccountInfo | null) => {
    setState((prev) => ({ ...prev, accountInfo: info }));
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

  const reset = useCallback(() => setState(initialState), []);

  const value = useMemo<ApickContextValue>(
    () => ({
      ...state,
      setFloodHistory,
      setScrapHistory,
      setSaleHistory,
      setSearchResult,
      setStats,
      setAccountInfo,
      setLoading,
      setError,
      clearError,
      reset,
    }),
    [
      state,
      setFloodHistory,
      setScrapHistory,
      setSaleHistory,
      setSearchResult,
      setStats,
      setAccountInfo,
      setLoading,
      setError,
      clearError,
      reset,
    ]
  );

  return (
    <ApickContext.Provider value={value}>{children}</ApickContext.Provider>
  );
};

export const useApickContext = (): ApickContextValue => {
  const ctx = useContext(ApickContext);
  if (!ctx) {
    throw new Error('useApickContext must be used within an ApickProvider');
  }
  return ctx;
};

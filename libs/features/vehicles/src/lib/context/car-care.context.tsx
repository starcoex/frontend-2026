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
  CarCareState,
  CarCareContextValue,
  CarCarePrice,
  CarCareSurcharge,
} from '../types';
import { serviceRegistry, initVehiclesService } from '../services';

const CarCareContext = createContext<CarCareContextValue | undefined>(
  undefined
);

const initialState: CarCareState = {
  prices: [],
  surcharges: [],
  currentPrice: null,
  isLoading: false,
  error: null,
};

export const CarCareProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CarCareState>(initialState);
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

  const setPrices = useCallback((prices: CarCarePrice[]) => {
    setState((prev) => ({ ...prev, prices }));
  }, []);

  const addPrice = useCallback((price: CarCarePrice) => {
    setState((prev) => ({ ...prev, prices: [price, ...prev.prices] }));
  }, []);

  const updatePriceInContext = useCallback(
    (id: number, updates: Partial<CarCarePrice>) => {
      setState((prev) => ({
        ...prev,
        prices: prev.prices.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
        currentPrice:
          prev.currentPrice?.id === id
            ? { ...prev.currentPrice, ...updates }
            : prev.currentPrice,
      }));
    },
    []
  );

  const removePrice = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      prices: prev.prices.filter((p) => p.id !== id),
      currentPrice: prev.currentPrice?.id === id ? null : prev.currentPrice,
    }));
  }, []);

  const setCurrentPrice = useCallback((price: CarCarePrice | null) => {
    setState((prev) => ({ ...prev, currentPrice: price }));
  }, []);

  const setSurcharges = useCallback((surcharges: CarCareSurcharge[]) => {
    setState((prev) => ({ ...prev, surcharges }));
  }, []);

  const addSurcharge = useCallback((surcharge: CarCareSurcharge) => {
    setState((prev) => ({
      ...prev,
      surcharges: [surcharge, ...prev.surcharges],
    }));
  }, []);

  const updateSurchargeInContext = useCallback(
    (id: number, updates: Partial<CarCareSurcharge>) => {
      setState((prev) => ({
        ...prev,
        surcharges: prev.surcharges.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        ),
      }));
    },
    []
  );

  const removeSurcharge = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      surcharges: prev.surcharges.filter((s) => s.id !== id),
    }));
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

  const value = useMemo<CarCareContextValue>(
    () => ({
      ...state,
      setPrices,
      addPrice,
      updatePriceInContext,
      removePrice,
      setCurrentPrice,
      setSurcharges,
      addSurcharge,
      updateSurchargeInContext,
      removeSurcharge,
      setLoading,
      setError,
      clearError,
      reset,
    }),
    [
      state,
      setPrices,
      addPrice,
      updatePriceInContext,
      removePrice,
      setCurrentPrice,
      setSurcharges,
      addSurcharge,
      updateSurchargeInContext,
      removeSurcharge,
      setLoading,
      setError,
      clearError,
      reset,
    ]
  );

  return (
    <CarCareContext.Provider value={value}>{children}</CarCareContext.Provider>
  );
};

export const useCarCareContext = (): CarCareContextValue => {
  const ctx = useContext(CarCareContext);
  if (!ctx) {
    throw new Error('useCarCareContext must be used within a CarCareProvider');
  }
  return ctx;
};

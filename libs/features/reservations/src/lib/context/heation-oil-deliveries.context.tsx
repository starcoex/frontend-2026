import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useApolloClient } from '@apollo/client/react';
import type {
  HeatingOilDeliveriesState,
  HeatingOilDeliveriesContextValue,
  HeatingOilDeliveryFilters,
  HeatingOilDelivery,
} from '../types';
import { serviceRegistry, initReservationsService } from '../services';

const HeatingOilDeliveriesContext = createContext<
  HeatingOilDeliveriesContextValue | undefined
>(undefined);

const initialState: HeatingOilDeliveriesState = {
  deliveries: [],
  currentDelivery: null,
  filters: {},
  isLoading: false,
  error: null,
};

export const HeatingOilDeliveriesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, setState] = useState<HeatingOilDeliveriesState>(initialState);
  const apolloClient = useApolloClient();
  const [serviceInitialized, setServiceInitialized] = useState(false);

  useMemo(() => {
    if (!serviceRegistry.isServiceInitialized('reservations')) {
      try {
        initReservationsService(apolloClient);
        setServiceInitialized(true);
      } catch (error) {
        console.error('❌ ReservationsService initialization failed:', error);
      }
    } else {
      setServiceInitialized(true);
    }
  }, [apolloClient]);

  const setDeliveries = useCallback((deliveries: HeatingOilDelivery[]) => {
    setState((prev) => ({ ...prev, deliveries }));
  }, []);

  const addDelivery = useCallback((item: HeatingOilDelivery) => {
    setState((prev) => ({ ...prev, deliveries: [item, ...prev.deliveries] }));
  }, []);

  const updateDeliveryInContext = useCallback(
    (id: number, updates: Partial<HeatingOilDelivery>) => {
      setState((prev) => ({
        ...prev,
        deliveries: prev.deliveries.map((d) =>
          d.id === id ? { ...d, ...updates } : d
        ),
        currentDelivery:
          prev.currentDelivery?.id === id
            ? { ...prev.currentDelivery, ...updates }
            : prev.currentDelivery,
      }));
    },
    []
  );

  const removeDelivery = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      deliveries: prev.deliveries.filter((d) => d.id !== id),
    }));
  }, []);

  const setCurrentDelivery = useCallback((item: HeatingOilDelivery | null) => {
    setState((prev) => ({ ...prev, currentDelivery: item }));
  }, []);

  const setFilters = useCallback(
    (filters: Partial<HeatingOilDeliveryFilters>) => {
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, ...filters },
      }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setState((prev) => ({ ...prev, filters: {} }));
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

  const value = useMemo<HeatingOilDeliveriesContextValue>(
    () => ({
      ...state,
      setDeliveries,
      addDelivery,
      updateDeliveryInContext,
      removeDelivery,
      setCurrentDelivery,
      setFilters,
      clearFilters,
      setLoading,
      setError,
      clearError,
      reset,
    }),
    [
      state,
      setDeliveries,
      addDelivery,
      updateDeliveryInContext,
      removeDelivery,
      setCurrentDelivery,
      setFilters,
      clearFilters,
      setLoading,
      setError,
      clearError,
      reset,
    ]
  );

  if (!serviceInitialized) {
    return <div>Initializing HeatingOilDeliveries Service...</div>;
  }

  return (
    <HeatingOilDeliveriesContext.Provider value={value}>
      {children}
    </HeatingOilDeliveriesContext.Provider>
  );
};

export const useHeatingOilDeliveriesContext =
  (): HeatingOilDeliveriesContextValue => {
    const ctx = useContext(HeatingOilDeliveriesContext);
    if (!ctx) {
      throw new Error(
        'useHeatingOilDeliveriesContext must be used within a HeatingOilDeliveriesProvider'
      );
    }
    return ctx;
  };

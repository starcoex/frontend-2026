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
  OrdersState,
  OrdersContextValue,
  OrderFilters,
  Order,
} from '../types';
import { serviceRegistry, initOrdersService } from '../services';

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  filters: {},
  isLoading: false,
  error: null,
};

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<OrdersState>(initialState);
  const apolloClient = useApolloClient();
  const [serviceInitialized, setServiceInitialized] = useState(false);

  useMemo(() => {
    if (!serviceRegistry.isServiceInitialized('orders')) {
      try {
        initOrdersService(apolloClient);
        setServiceInitialized(true);
      } catch (error) {
        console.error('❌ NoticesService initialization failed:', error);
      }
    } else {
      setServiceInitialized(true);
    }
  }, [apolloClient]);

  const setOrders = useCallback((orders: Order[]) => {
    setState((prev) => ({ ...prev, orders }));
  }, []);

  const addOrder = useCallback((order: Order) => {
    setState((prev) => ({ ...prev, orders: [order, ...prev.orders] }));
  }, []);

  const updateOrderInContext = useCallback(
    (id: number, updates: Partial<Order>) => {
      setState((prev) => ({
        ...prev,
        orders: prev.orders.map((o) =>
          o.id === id ? { ...o, ...updates } : o
        ),
        currentOrder:
          prev.currentOrder?.id === id
            ? { ...prev.currentOrder, ...updates }
            : prev.currentOrder,
      }));
    },
    []
  );

  const setCurrentOrder = useCallback((order: Order | null) => {
    setState((prev) => ({ ...prev, currentOrder: order }));
  }, []);

  const setFilters = useCallback((filters: Partial<OrderFilters>) => {
    setState((prev) => ({ ...prev, filters: { ...prev.filters, ...filters } }));
  }, []);

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

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const value = useMemo<OrdersContextValue>(
    () => ({
      ...state,
      setOrders,
      addOrder,
      updateOrderInContext,
      setCurrentOrder,
      setFilters,
      clearFilters,
      setLoading,
      setError,
      clearError,
      reset,
    }),
    [
      state,
      setOrders,
      addOrder,
      updateOrderInContext,
      setCurrentOrder,
      setFilters,
      clearFilters,
      setLoading,
      setError,
      clearError,
      reset,
    ]
  );

  if (!serviceInitialized) {
    return <div>Initializing Orders Service...</div>;
  }

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
};

export const useOrdersContext = (): OrdersContextValue => {
  const ctx = useContext(OrdersContext);
  if (!ctx) {
    throw new Error('useOrdersContext must be used within an OrdersProvider');
  }
  return ctx;
};

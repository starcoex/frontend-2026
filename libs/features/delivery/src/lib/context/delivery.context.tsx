import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import { useApolloClient } from '@apollo/client/react';
import type {
  DeliveryState,
  DeliveryContextValue,
  DeliveryFilters,
  Delivery,
  DeliveryTrackingInfo,
  DeliveryRealtimeState,
  LiveDriverLocation,
} from '../types';
import { serviceRegistry, initDeliveryService } from '../services';

const DeliveryContext = createContext<DeliveryContextValue | undefined>(
  undefined
);

const initialPagination = {
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
};

const initialState: DeliveryState = {
  deliveries: [],
  currentDelivery: null,
  trackingInfo: null,
  pagination: initialPagination,
  filters: { page: 1, limit: 20 },
  isLoading: false,
  error: null,
};

const initialRealtimeState: DeliveryRealtimeState = {
  liveLocations: {},
  socketStatus: 'disconnected',
  subscribedDeliveryIds: [],
};

export const DeliveryProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<DeliveryState>(initialState);
  const [realtimeState, setRealtimeState] =
    useState<DeliveryRealtimeState>(initialRealtimeState);
  const apolloClient = useApolloClient();
  const [serviceInitialized, setServiceInitialized] = useState(false);

  useEffect(() => {
    if (!serviceRegistry.isServiceInitialized('delivery')) {
      try {
        initDeliveryService(apolloClient);
        setServiceInitialized(true);
      } catch (error) {
        console.error('❌ DeliveryService initialization failed:', error);
      }
    } else {
      setServiceInitialized(true);
    }
  }, [apolloClient]);

  // ── Delivery 액션 ───────────────────────────────────────────────────────────

  const setDeliveries = useCallback((deliveries: Delivery[]) => {
    setState((prev) => ({ ...prev, deliveries }));
  }, []);

  const addDelivery = useCallback((delivery: Delivery) => {
    setState((prev) => ({
      ...prev,
      deliveries: [delivery, ...prev.deliveries],
    }));
  }, []);

  const updateDeliveryInContext = useCallback(
    (id: number, updates: Partial<Delivery>) => {
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

  const setCurrentDelivery = useCallback((delivery: Delivery | null) => {
    setState((prev) => ({ ...prev, currentDelivery: delivery }));
  }, []);

  const setTrackingInfo = useCallback(
    (trackingInfo: DeliveryTrackingInfo | null) => {
      setState((prev) => ({ ...prev, trackingInfo }));
    },
    []
  );

  const setPagination = useCallback(
    (pagination: DeliveryState['pagination']) => {
      setState((prev) => ({ ...prev, pagination }));
    },
    []
  );

  const setFilters = useCallback((filters: Partial<DeliveryFilters>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setState((prev) => ({
      ...prev,
      filters: { page: 1, limit: 20 },
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

  const reset = useCallback(() => {
    setState(initialState);
    setRealtimeState(initialRealtimeState);
  }, []);

  // ── 실시간(Realtime) 액션 ──────────────────────────────────────────────────

  const setLiveLocation = useCallback((location: LiveDriverLocation) => {
    setRealtimeState((prev) => ({
      ...prev,
      liveLocations: {
        ...prev.liveLocations,
        [location.driverId]: location,
      },
    }));
  }, []);

  const clearLiveLocation = useCallback((driverId: number) => {
    setRealtimeState((prev) => {
      const next = { ...prev.liveLocations };
      delete next[driverId];
      return { ...prev, liveLocations: next };
    });
  }, []);

  const clearAllLiveLocations = useCallback(() => {
    setRealtimeState((prev) => ({ ...prev, liveLocations: {} }));
  }, []);

  const setSocketStatus = useCallback(
    (status: DeliveryRealtimeState['socketStatus']) => {
      setRealtimeState((prev) => ({ ...prev, socketStatus: status }));
    },
    []
  );

  const addSubscribedDelivery = useCallback((deliveryId: number) => {
    setRealtimeState((prev) => ({
      ...prev,
      subscribedDeliveryIds: prev.subscribedDeliveryIds.includes(deliveryId)
        ? prev.subscribedDeliveryIds
        : [...prev.subscribedDeliveryIds, deliveryId],
    }));
  }, []);

  const removeSubscribedDelivery = useCallback((deliveryId: number) => {
    setRealtimeState((prev) => ({
      ...prev,
      subscribedDeliveryIds: prev.subscribedDeliveryIds.filter(
        (id) => id !== deliveryId
      ),
    }));
  }, []);

  const value = useMemo<DeliveryContextValue>(
    () => ({
      // GraphQL 상태
      ...state,
      setDeliveries,
      addDelivery,
      updateDeliveryInContext,
      removeDelivery,
      setCurrentDelivery,
      setTrackingInfo,
      setPagination,
      setFilters,
      clearFilters,
      setLoading,
      setError,
      clearError,
      reset,
      // 실시간 상태
      ...realtimeState,
      setLiveLocation,
      clearLiveLocation,
      clearAllLiveLocations,
      setSocketStatus,
      addSubscribedDelivery,
      removeSubscribedDelivery,
    }),
    [
      state,
      realtimeState,
      setDeliveries,
      addDelivery,
      updateDeliveryInContext,
      removeDelivery,
      setCurrentDelivery,
      setTrackingInfo,
      setPagination,
      setFilters,
      clearFilters,
      setLoading,
      setError,
      clearError,
      reset,
      setLiveLocation,
      clearLiveLocation,
      clearAllLiveLocations,
      setSocketStatus,
      addSubscribedDelivery,
      removeSubscribedDelivery,
    ]
  );

  if (!serviceInitialized) {
    return null;
  }

  return (
    <DeliveryContext.Provider value={value}>
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDeliveryContext = (): DeliveryContextValue => {
  const ctx = useContext(DeliveryContext);
  if (!ctx) {
    throw new Error(
      'useDeliveryContext must be used within a DeliveryProvider'
    );
  }
  return ctx;
};

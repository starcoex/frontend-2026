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
  ReservationsState,
  ReservationsContextValue,
  ReservationFilters,
  Reservation,
  ReservationTimeSlot,
  WalkIn,
} from '../types';
import { serviceRegistry, initReservationsService } from '../services';

const ReservationsContext = createContext<ReservationsContextValue | undefined>(
  undefined
);

const initialState: ReservationsState = {
  reservations: [],
  currentReservation: null,
  availableSlots: [],
  walkIns: [],
  filters: {},
  pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
  isLoading: false,
  error: null,
};

export const ReservationsProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ReservationsState>(initialState);
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

  const setReservations = useCallback((reservations: Reservation[]) => {
    setState((prev) => ({ ...prev, reservations }));
  }, []);

  const addReservation = useCallback((reservation: Reservation) => {
    setState((prev) => ({
      ...prev,
      reservations: [reservation, ...prev.reservations],
    }));
  }, []);

  const updateReservationInContext = useCallback(
    (id: number, updates: Partial<Reservation>) => {
      setState((prev) => ({
        ...prev,
        reservations: prev.reservations.map((r) =>
          r.id === id ? { ...r, ...updates } : r
        ),
        currentReservation:
          prev.currentReservation?.id === id
            ? { ...prev.currentReservation, ...updates }
            : prev.currentReservation,
      }));
    },
    []
  );

  const removeReservation = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      reservations: prev.reservations.filter((r) => r.id !== id),
    }));
  }, []);

  const setCurrentReservation = useCallback(
    (reservation: Reservation | null) => {
      setState((prev) => ({ ...prev, currentReservation: reservation }));
    },
    []
  );

  const setAvailableSlots = useCallback((slots: ReservationTimeSlot[]) => {
    setState((prev) => ({ ...prev, availableSlots: slots }));
  }, []);

  const setWalkIns = useCallback((walkIns: WalkIn[]) => {
    setState((prev) => ({ ...prev, walkIns }));
  }, []);

  const updateWalkInInContext = useCallback(
    (id: number, updates: Partial<WalkIn>) => {
      setState((prev) => ({
        ...prev,
        walkIns: prev.walkIns.map((w) =>
          w.id === id ? { ...w, ...updates } : w
        ),
      }));
    },
    []
  );

  const setFilters = useCallback((filters: Partial<ReservationFilters>) => {
    setState((prev) => ({ ...prev, filters: { ...prev.filters, ...filters } }));
  }, []);

  const clearFilters = useCallback(() => {
    setState((prev) => ({ ...prev, filters: {} }));
  }, []);

  const setPagination = useCallback(
    (pagination: Partial<ReservationsState['pagination']>) => {
      setState((prev) => ({
        ...prev,
        pagination: { ...prev.pagination, ...pagination },
      }));
    },
    []
  );

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

  const value = useMemo<ReservationsContextValue>(
    () => ({
      ...state,
      setReservations,
      addReservation,
      updateReservationInContext,
      removeReservation,
      setCurrentReservation,
      setAvailableSlots,
      setWalkIns,
      updateWalkInInContext,
      setFilters,
      clearFilters,
      setPagination,
      setLoading,
      setError,
      clearError,
      reset,
    }),
    [
      state,
      setReservations,
      addReservation,
      updateReservationInContext,
      removeReservation,
      setCurrentReservation,
      setAvailableSlots,
      setWalkIns,
      updateWalkInInContext,
      setFilters,
      clearFilters,
      setPagination,
      setLoading,
      setError,
      clearError,
      reset,
    ]
  );

  if (!serviceInitialized) {
    return <div>Initializing Reservations Service...</div>;
  }

  return (
    <ReservationsContext.Provider value={value}>
      {children}
    </ReservationsContext.Provider>
  );
};

export const useReservationsContext = (): ReservationsContextValue => {
  const ctx = useContext(ReservationsContext);
  if (!ctx) {
    throw new Error(
      'useReservationsContext must be used within a ReservationsProvider'
    );
  }
  return ctx;
};

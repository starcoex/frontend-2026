import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useApolloClient } from '@apollo/client/react';
import { serviceRegistry, initReservationsService } from '../services';
import { FuelWalkIn } from '@starcoex-frontend/graphql';
import {
  FuelWalkInFilters,
  FuelWalkInsContextValue,
  FuelWalkInsState,
} from '../types';

const FuelWalkInsContext = createContext<FuelWalkInsContextValue | undefined>(
  undefined
);

const initialState: FuelWalkInsState = {
  fuelWalkIns: [],
  currentFuelWalkIn: null,
  filters: {},
  isLoading: false,
  error: null,
};

export const FuelWalkInsProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<FuelWalkInsState>(initialState);
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

  const setFuelWalkIns = useCallback((fuelWalkIns: FuelWalkIn[]) => {
    setState((prev) => ({ ...prev, fuelWalkIns }));
  }, []);

  const addFuelWalkIn = useCallback((item: FuelWalkIn) => {
    setState((prev) => ({ ...prev, fuelWalkIns: [item, ...prev.fuelWalkIns] }));
  }, []);

  const updateFuelWalkInInContext = useCallback(
    (id: number, updates: Partial<FuelWalkIn>) => {
      setState((prev) => ({
        ...prev,
        fuelWalkIns: prev.fuelWalkIns.map((f) =>
          f.id === id ? { ...f, ...updates } : f
        ),
        currentFuelWalkIn:
          prev.currentFuelWalkIn?.id === id
            ? { ...prev.currentFuelWalkIn, ...updates }
            : prev.currentFuelWalkIn,
      }));
    },
    []
  );

  const removeFuelWalkIn = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      fuelWalkIns: prev.fuelWalkIns.filter((f) => f.id !== id),
    }));
  }, []);

  const setCurrentFuelWalkIn = useCallback((item: FuelWalkIn | null) => {
    setState((prev) => ({ ...prev, currentFuelWalkIn: item }));
  }, []);

  const setFilters = useCallback((filters: Partial<FuelWalkInFilters>) => {
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

  const reset = useCallback(() => setState(initialState), []);

  const value = useMemo<FuelWalkInsContextValue>(
    () => ({
      ...state,
      setFuelWalkIns,
      addFuelWalkIn,
      updateFuelWalkInInContext,
      removeFuelWalkIn,
      setCurrentFuelWalkIn,
      setFilters,
      clearFilters,
      setLoading,
      setError,
      clearError,
      reset,
    }),
    [
      state,
      setFuelWalkIns,
      addFuelWalkIn,
      updateFuelWalkInInContext,
      removeFuelWalkIn,
      setCurrentFuelWalkIn,
      setFilters,
      clearFilters,
      setLoading,
      setError,
      clearError,
      reset,
    ]
  );

  if (!serviceInitialized) {
    return <div>Initializing FuelWalkIns Service...</div>;
  }

  return (
    <FuelWalkInsContext.Provider value={value}>
      {children}
    </FuelWalkInsContext.Provider>
  );
};

export const useFuelWalkInsContext = (): FuelWalkInsContextValue => {
  const ctx = useContext(FuelWalkInsContext);
  if (!ctx) {
    throw new Error(
      'useFuelWalkInsContext must be used within a FuelWalkInsProvider'
    );
  }
  return ctx;
};

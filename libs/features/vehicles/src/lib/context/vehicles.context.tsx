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
  VehicleState,
  VehicleContextValue,
  Vehicle,
  VehicleBrand,
  VehicleModel,
  VehicleDimensionRule,
} from '../types/vehicle.types';
import { serviceRegistry, initVehiclesService } from '../services';

const VehicleContext = createContext<VehicleContextValue | undefined>(
  undefined
);

const initialState: VehicleState = {
  vehicles: [],
  currentVehicle: null,
  brands: [],
  models: [],
  dimensionRules: [],
  isLoading: false,
  error: null,
};

export const VehicleProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<VehicleState>(initialState);
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

  const setVehicles = useCallback((vehicles: Vehicle[]) => {
    setState((prev) => ({ ...prev, vehicles }));
  }, []);

  const addVehicle = useCallback((vehicle: Vehicle) => {
    setState((prev) => ({ ...prev, vehicles: [vehicle, ...prev.vehicles] }));
  }, []);

  const updateVehicleInContext = useCallback(
    (id: number, updates: Partial<Vehicle>) => {
      setState((prev) => ({
        ...prev,
        vehicles: prev.vehicles.map((v) =>
          v.id === id ? { ...v, ...updates } : v
        ),
        currentVehicle:
          prev.currentVehicle?.id === id
            ? { ...prev.currentVehicle, ...updates }
            : prev.currentVehicle,
      }));
    },
    []
  );

  const removeVehicle = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      vehicles: prev.vehicles.filter((v) => v.id !== id),
      currentVehicle:
        prev.currentVehicle?.id === id ? null : prev.currentVehicle,
    }));
  }, []);

  const setCurrentVehicle = useCallback((vehicle: Vehicle | null) => {
    setState((prev) => ({ ...prev, currentVehicle: vehicle }));
  }, []);

  const setBrands = useCallback((brands: VehicleBrand[]) => {
    setState((prev) => ({ ...prev, brands }));
  }, []);

  const setModels = useCallback((models: VehicleModel[]) => {
    setState((prev) => ({ ...prev, models }));
  }, []);

  const setDimensionRules = useCallback(
    (dimensionRules: VehicleDimensionRule[]) => {
      setState((prev) => ({ ...prev, dimensionRules }));
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

  const value = useMemo<VehicleContextValue>(
    () => ({
      ...state,
      setVehicles,
      addVehicle,
      updateVehicleInContext,
      removeVehicle,
      setCurrentVehicle,
      setBrands,
      setModels,
      setDimensionRules,
      setLoading,
      setError,
      clearError,
      reset,
    }),
    [
      state,
      setVehicles,
      addVehicle,
      updateVehicleInContext,
      removeVehicle,
      setCurrentVehicle,
      setBrands,
      setModels,
      setDimensionRules,
      setLoading,
      setError,
      clearError,
      reset,
    ]
  );

  return (
    <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>
  );
};

export const useVehicleContext = (): VehicleContextValue => {
  const ctx = useContext(VehicleContext);
  if (!ctx) {
    throw new Error('useVehicleContext must be used within a VehicleProvider');
  }
  return ctx;
};

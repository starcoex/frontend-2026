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
  InventoryState,
  InventoryContextValue,
  InventoryFilters,
  StoreInventory,
} from '../types';
import { serviceRegistry, initInventoryService } from '../services';

const InventoryContext = createContext<InventoryContextValue | undefined>(
  undefined
);

const initialState: InventoryState = {
  inventories: [],
  currentInventory: null,
  lowStockInventories: [],
  filters: {},
  isLoading: false,
  error: null,
};

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<InventoryState>(initialState);
  const apolloClient = useApolloClient();
  const [serviceInitialized, setServiceInitialized] = useState(false);

  useMemo(() => {
    if (!serviceRegistry.isServiceInitialized('inventory')) {
      try {
        initInventoryService(apolloClient);
        setServiceInitialized(true);
      } catch (error) {
        console.error('❌ NoticesService initialization failed:', error);
      }
    } else {
      setServiceInitialized(true);
    }
  }, [apolloClient]);

  const setInventories = useCallback((inventories: StoreInventory[]) => {
    setState((prev) => ({ ...prev, inventories }));
  }, []);

  const addInventory = useCallback((inventory: StoreInventory) => {
    setState((prev) => ({
      ...prev,
      inventories: [inventory, ...prev.inventories],
    }));
  }, []);

  const updateInventoryInContext = useCallback(
    (id: number, updates: Partial<StoreInventory>) => {
      setState((prev) => ({
        ...prev,
        inventories: prev.inventories.map((inv) =>
          inv.id === id ? { ...inv, ...updates } : inv
        ),
        currentInventory:
          prev.currentInventory?.id === id
            ? { ...prev.currentInventory, ...updates }
            : prev.currentInventory,
      }));
    },
    []
  );

  const removeInventory = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      inventories: prev.inventories.filter((inv) => inv.id !== id),
    }));
  }, []);

  const setCurrentInventory = useCallback(
    (inventory: StoreInventory | null) => {
      setState((prev) => ({ ...prev, currentInventory: inventory }));
    },
    []
  );

  const setLowStockInventories = useCallback(
    (inventories: StoreInventory[]) => {
      setState((prev) => ({ ...prev, lowStockInventories: inventories }));
    },
    []
  );

  const setFilters = useCallback((filters: Partial<InventoryFilters>) => {
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

  const value = useMemo<InventoryContextValue>(
    () => ({
      ...state,
      setInventories,
      addInventory,
      updateInventoryInContext,
      removeInventory,
      setCurrentInventory,
      setLowStockInventories,
      setFilters,
      clearFilters,
      setLoading,
      setError,
      clearError,
      reset,
    }),
    [
      state,
      setInventories,
      addInventory,
      updateInventoryInContext,
      removeInventory,
      setCurrentInventory,
      setLowStockInventories,
      setFilters,
      clearFilters,
      setLoading,
      setError,
      clearError,
      reset,
    ]
  );

  if (!serviceInitialized) {
    return <div>Initializing Inventory Service...</div>;
  }

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventoryContext = (): InventoryContextValue => {
  const ctx = useContext(InventoryContext);
  if (!ctx) {
    throw new Error(
      'useInventoryContext must be used within an InventoryProvider'
    );
  }
  return ctx;
};

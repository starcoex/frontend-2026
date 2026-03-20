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
  ProductsState,
  ProductsContextValue,
  ProductFilters,
  Product,
} from '../types';
import { serviceRegistry, initProductsService } from '../services';

const ProductsContext = createContext<ProductsContextValue | undefined>(
  undefined
);

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  filters: {},
  isLoading: false,
  error: null,
};

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ProductsState>(initialState);
  const apolloClient = useApolloClient();
  const [serviceInitialized, setServiceInitialized] = useState(false);

  useMemo(() => {
    if (!serviceRegistry.isServiceInitialized('products')) {
      try {
        initProductsService(apolloClient);
        setServiceInitialized(true);
      } catch (error) {
        console.error('❌ NoticesService initialization failed:', error);
      }
    } else {
      setServiceInitialized(true);
    }
  }, [apolloClient]);

  const setProducts = useCallback((products: Product[]) => {
    setState((prev) => ({ ...prev, products }));
  }, []);

  const addProduct = useCallback((product: Product) => {
    setState((prev) => ({
      ...prev,
      products: [product, ...prev.products],
    }));
  }, []);

  const updateProductInContext = useCallback(
    (id: number, updates: Partial<Product>) => {
      setState((prev) => ({
        ...prev,
        products: prev.products.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
        currentProduct:
          prev.currentProduct?.id === id
            ? { ...prev.currentProduct, ...updates }
            : prev.currentProduct,
      }));
    },
    []
  );

  const removeProduct = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }));
  }, []);

  const setCurrentProduct = useCallback((product: Product | null) => {
    setState((prev) => ({ ...prev, currentProduct: product }));
  }, []);

  const setFilters = useCallback((filters: Partial<ProductFilters>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
    }));
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

  const value = useMemo<ProductsContextValue>(
    () => ({
      ...state,
      setProducts,
      addProduct,
      updateProductInContext,
      removeProduct,
      setCurrentProduct,
      setFilters,
      clearFilters,
      setLoading,
      setError,
      clearError,
      reset,
    }),
    [
      state,
      setProducts,
      addProduct,
      updateProductInContext,
      removeProduct,
      setCurrentProduct,
      setFilters,
      clearFilters,
      setLoading,
      setError,
      clearError,
      reset,
    ]
  );

  if (!serviceInitialized) {
    return <div>Initializing Products Service...</div>;
  }

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = (): ProductsContextValue => {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error(
      'useProductsContext must be used within a ProductsProvider'
    );
  }
  return ctx;
};

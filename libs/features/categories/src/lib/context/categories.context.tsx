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
  CategoriesState,
  CategoriesContextValue,
  Category,
} from '../types';
import { serviceRegistry, initCategoriesService } from '../services';

const CategoriesContext = createContext<CategoriesContextValue | undefined>(
  undefined
);

const initialState: CategoriesState = {
  categories: [],
  categoryTree: [],
  currentCategory: null,
  isLoading: false,
  error: null,
};

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CategoriesState>(initialState);
  const apolloClient = useApolloClient();
  const [serviceInitialized, setServiceInitialized] = useState(false);

  useMemo(() => {
    if (!serviceRegistry.isServiceInitialized('categories')) {
      try {
        initCategoriesService(apolloClient);
        setServiceInitialized(true);
      } catch (error) {
        console.error('❌ CategoriesService initialization failed:', error);
      }
    } else {
      setServiceInitialized(true);
    }
  }, [apolloClient]);

  const setCategories = useCallback((categories: Category[]) => {
    setState((prev) => ({ ...prev, categories }));
  }, []);

  const setCategoryTree = useCallback((categoryTree: Category[]) => {
    setState((prev) => ({ ...prev, categoryTree }));
  }, []);

  const addCategory = useCallback((category: Category) => {
    setState((prev) => ({
      ...prev,
      categories: [category, ...prev.categories],
    }));
  }, []);

  const updateCategoryInContext = useCallback(
    (id: number, updates: Partial<Category>) => {
      setState((prev) => ({
        ...prev,
        categories: prev.categories.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
        currentCategory:
          prev.currentCategory?.id === id
            ? { ...prev.currentCategory, ...updates }
            : prev.currentCategory,
      }));
    },
    []
  );

  const removeCategory = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
    }));
  }, []);

  const setCurrentCategory = useCallback((category: Category | null) => {
    setState((prev) => ({ ...prev, currentCategory: category }));
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

  const value = useMemo<CategoriesContextValue>(
    () => ({
      ...state,
      setCategories,
      setCategoryTree,
      addCategory,
      updateCategoryInContext,
      removeCategory,
      setCurrentCategory,
      setLoading,
      setError,
      clearError,
      reset,
    }),
    [
      state,
      setCategories,
      setCategoryTree,
      addCategory,
      updateCategoryInContext,
      removeCategory,
      setCurrentCategory,
      setLoading,
      setError,
      clearError,
      reset,
    ]
  );

  if (!serviceInitialized) {
    return <div>Initializing Categories Service...</div>;
  }

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategoriesContext = (): CategoriesContextValue => {
  const ctx = useContext(CategoriesContext);
  if (!ctx) {
    throw new Error(
      'useCategoriesContext must be used within a CategoriesProvider'
    );
  }
  return ctx;
};

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
  SuggestionsState,
  SuggestionsContextValue,
  Suggestion,
  GetSuggestionsInput,
} from '../types';
import { serviceRegistry, initSuggestionsService } from '../services';

const SuggestionsContext = createContext<SuggestionsContextValue | undefined>(
  undefined
);

const initialState: SuggestionsState = {
  suggestions: [],
  currentSuggestion: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
  filters: {},
  isLoading: false,
  error: null,
};

export const SuggestionsProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<SuggestionsState>(initialState);
  const apolloClient = useApolloClient();
  const [serviceInitialized, setServiceInitialized] = useState(false);

  useMemo(() => {
    if (!serviceRegistry.isServiceInitialized('suggestions')) {
      try {
        initSuggestionsService(apolloClient);
        setServiceInitialized(true);
      } catch (error) {
        console.error('❌ SuggestionsService initialization failed:', error);
      }
    } else {
      setServiceInitialized(true);
    }
  }, [apolloClient]);

  const setSuggestions = useCallback(
    (
      suggestions: Suggestion[],
      pagination?: Partial<
        Pick<
          SuggestionsState,
          'totalCount' | 'currentPage' | 'totalPages' | 'hasNext' | 'hasPrev'
        >
      >
    ) => {
      setState((prev) => ({ ...prev, suggestions, ...pagination }));
    },
    []
  );

  const addSuggestion = useCallback((suggestion: Suggestion) => {
    setState((prev) => ({
      ...prev,
      suggestions: [suggestion, ...prev.suggestions],
      totalCount: prev.totalCount + 1,
    }));
  }, []);

  const updateSuggestionInContext = useCallback(
    (id: number, updates: Partial<Suggestion>) => {
      setState((prev) => ({
        ...prev,
        suggestions: prev.suggestions.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        ),
        currentSuggestion:
          prev.currentSuggestion?.id === id
            ? { ...prev.currentSuggestion, ...updates }
            : prev.currentSuggestion,
      }));
    },
    []
  );

  const removeSuggestion = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      suggestions: prev.suggestions.filter((s) => s.id !== id),
      totalCount: Math.max(0, prev.totalCount - 1),
    }));
  }, []);

  const setCurrentSuggestion = useCallback((suggestion: Suggestion | null) => {
    setState((prev) => ({ ...prev, currentSuggestion: suggestion }));
  }, []);

  const setFilters = useCallback((filters: Partial<GetSuggestionsInput>) => {
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

  const value = useMemo<SuggestionsContextValue>(
    () => ({
      ...state,
      setSuggestions,
      addSuggestion,
      updateSuggestionInContext,
      removeSuggestion,
      setCurrentSuggestion,
      setFilters,
      clearFilters,
      setLoading,
      setError,
      clearError,
      reset,
    }),
    [
      state,
      setSuggestions,
      addSuggestion,
      updateSuggestionInContext,
      removeSuggestion,
      setCurrentSuggestion,
      setFilters,
      clearFilters,
      setLoading,
      setError,
      clearError,
      reset,
    ]
  );

  if (!serviceInitialized) {
    return <div>Initializing Suggestions Service...</div>;
  }

  return (
    <SuggestionsContext.Provider value={value}>
      {children}
    </SuggestionsContext.Provider>
  );
};

export const useSuggestionsContext = (): SuggestionsContextValue => {
  const ctx = useContext(SuggestionsContext);
  if (!ctx) {
    throw new Error(
      'useSuggestionsContext must be used within a SuggestionsProvider'
    );
  }
  return ctx;
};

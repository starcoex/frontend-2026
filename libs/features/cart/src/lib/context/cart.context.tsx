import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { useApolloClient } from '@apollo/client/react';
import type { CartState, CartContextValue, Cart } from '../types';
import { serviceRegistry, initCartService } from '../services';

const CartContext = createContext<CartContextValue | undefined>(undefined);

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CartState>(initialState);
  const apolloClient = useApolloClient();
  const [serviceInitialized, setServiceInitialized] = useState(false);

  useEffect(() => {
    if (!serviceRegistry.isServiceInitialized('cart')) {
      try {
        initCartService(apolloClient);
        setServiceInitialized(true);
      } catch (error) {
        console.error('❌ CartService initialization failed:', error);
      }
    } else {
      setServiceInitialized(true);
    }
  }, [apolloClient]);

  const setCart = useCallback((cart: Cart | null) => {
    setState((prev) => ({ ...prev, cart }));
  }, []);

  const updateCartInContext = useCallback((updates: Partial<Cart>) => {
    setState((prev) => ({
      ...prev,
      cart: prev.cart ? { ...prev.cart, ...updates } : null,
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

  const reset = useCallback(() => setState(initialState), []);

  const value = useMemo<CartContextValue>(
    () => ({
      ...state,
      setCart,
      updateCartInContext,
      setLoading,
      setError,
      clearError,
      reset,
    }),
    [
      state,
      setCart,
      updateCartInContext,
      setLoading,
      setError,
      clearError,
      reset,
    ]
  );

  if (!serviceInitialized) {
    return <div>Initializing Cart Service...</div>;
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return ctx;
};

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
import type { CartState, CartContextValue, Cart } from '../types';
import { serviceRegistry, initCartService } from '../services';

const CartContext = createContext<CartContextValue | undefined>(undefined);

const initialState: CartState = {
  cart: null,
  carts: [],
  cartsTotal: 0,
  isLoading: false,
  error: null,
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CartState>(initialState);
  const apolloClient = useApolloClient();

  useLayoutEffect(() => {
    if (!serviceRegistry.isServiceInitialized('cart')) {
      try {
        initCartService(apolloClient);
      } catch (error) {
        console.error('❌ CartService initialization failed:', error);
      }
    }
  }, [apolloClient]);

  const setCart = useCallback((cart: Cart | null) => {
    setState((prev) => ({ ...prev, cart }));
  }, []);

  const setCarts = useCallback((carts: Cart[]) => {
    setState((prev) => ({ ...prev, carts }));
  }, []);

  const setCartsTotal = useCallback((cartsTotal: number) => {
    setState((prev) => ({ ...prev, cartsTotal }));
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
      setCarts,
      setCartsTotal,
      updateCartInContext,
      setLoading,
      setError,
      clearError,
      reset,
    }),
    [
      state,
      setCart,
      setCarts,
      setCartsTotal,
      updateCartInContext,
      setLoading,
      setError,
      clearError,
      reset,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return ctx;
};

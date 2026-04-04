import { useCallback, useRef } from 'react';
import { useCartContext } from '../context';
import { getCartService } from '../services';
import type {
  ApiResponse,
  AddToCartInput,
  UpdateCartItemInput,
  RemoveFromCartInput,
  AddToCartOutput,
  UpdateCartItemOutput,
  RemoveFromCartOutput,
} from '../types';

export const useCart = () => {
  const context = useCartContext();

  const {
    setCart,
    setLoading,
    setError,
    clearError,
    isLoading: contextIsLoading,
    cart,
  } = context;

  const isLoadingRef = useRef(contextIsLoading);
  isLoadingRef.current = contextIsLoading;

  // ============================================================================
  // 공통 로딩 래퍼
  // ============================================================================

  const withLoading = useCallback(
    async <T>(
      operation: () => Promise<ApiResponse<T>>,
      defaultErrorMessage: string
    ): Promise<ApiResponse<T>> => {
      try {
        if (!isLoadingRef.current) setLoading(true);
        clearError();
        const res = await operation();
        if (!res.success) {
          setError(res.error?.message ?? defaultErrorMessage);
        }
        return res;
      } catch (e) {
        console.error(e);
        setError(defaultErrorMessage);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setError]
  );

  // ============================================================================
  // Queries
  // ============================================================================

  const fetchMyCart = useCallback(
    async () =>
      withLoading(async () => {
        const service = getCartService();
        const res = await service.getMyCart();
        if (res.success && res.data) {
          setCart(res.data);
        }
        return res;
      }, '장바구니를 불러오는데 실패했습니다.'),
    [withLoading, setCart]
  );

  // ============================================================================
  // Mutations
  // ============================================================================

  const addToCart = useCallback(
    async (input: AddToCartInput): Promise<ApiResponse<AddToCartOutput>> =>
      withLoading(async () => {
        const service = getCartService();
        const res = await service.addToCart(input);
        if (res.success && res.data?.cart) {
          setCart(res.data.cart);
        }
        return res;
      }, '장바구니 추가에 실패했습니다.'),
    [withLoading, setCart]
  );

  const updateCartItem = useCallback(
    async (
      input: UpdateCartItemInput
    ): Promise<ApiResponse<UpdateCartItemOutput>> =>
      withLoading(async () => {
        const service = getCartService();
        const res = await service.updateCartItem(input);
        if (res.success && res.data?.cart) {
          setCart(res.data.cart);
        }
        return res;
      }, '장바구니 수정에 실패했습니다.'),
    [withLoading, setCart]
  );

  const removeFromCart = useCallback(
    async (
      input: RemoveFromCartInput
    ): Promise<ApiResponse<RemoveFromCartOutput>> =>
      withLoading(async () => {
        const service = getCartService();
        const res = await service.removeFromCart(input);
        if (res.success && res.data?.cart) {
          setCart(res.data.cart);
        }
        return res;
      }, '장바구니 삭제에 실패했습니다.'),
    [withLoading, setCart]
  );

  const clearCart = useCallback(
    async (): Promise<ApiResponse<boolean>> =>
      withLoading(async () => {
        const service = getCartService();
        const res = await service.clearCart();
        if (res.success) {
          // ✅ null 처리 제거 — clearCart 후 서버에서 최신 cart 상태 재조회
          const cartRes = await service.getMyCart();
          if (cartRes.success && cartRes.data) {
            setCart(cartRes.data);
          }
        }
        return res;
      }, '장바구니 비우기에 실패했습니다.'),
    [withLoading, setCart]
  );

  // ============================================================================
  // 편의 계산값
  // ============================================================================

  const cartItemCount = cart?.itemCount ?? 0;
  const cartTotalAmount = cart?.totalAmount ?? 0;
  const isCartEmpty = cart?.isEmpty ?? true;
  const isCartExpired = cart?.isExpired ?? false;

  return {
    ...context,

    // Queries
    fetchMyCart,

    // Mutations
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,

    // 편의 값
    cart,
    cartItemCount,
    cartTotalAmount,
    isCartEmpty,
    isCartExpired,
  };
};

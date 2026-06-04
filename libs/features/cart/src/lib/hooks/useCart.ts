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
  AdminCartsFilter,
  AdminCartsOutput,
} from '../types';

export const useCart = () => {
  const context = useCartContext();

  const {
    setCart,
    setCarts,
    setCartsTotal,
    setLoading,
    setError,
    clearError,
    isLoading: contextIsLoading,
    cart,
    carts,
    cartsTotal,
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

  const fetchAdminCarts = useCallback(
    async (filter?: AdminCartsFilter): Promise<ApiResponse<AdminCartsOutput>> =>
      withLoading(async () => {
        const service = getCartService();
        const res = await service.getAdminCarts(filter);
        if (res.success && res.data) {
          setCarts(res.data.carts);
          setCartsTotal(res.data.totalCount);
        }
        return res;
      }, '장바구니 목록을 불러오는데 실패했습니다.'),
    [withLoading, setCarts, setCartsTotal]
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
          // clearCart 후 서버에서 최신 cart 상태 재조회
          const cartRes = await service.getMyCart();
          if (cartRes.success && cartRes.data) {
            setCart(cartRes.data);
          }
        }
        return res;
      }, '장바구니 비우기에 실패했습니다.'),
    [withLoading, setCart]
  );

  const adminCleanupCarts = useCallback(
    async (): Promise<ApiResponse<number>> =>
      withLoading(async () => {
        const service = getCartService();
        const res = await service.adminCleanupCarts();
        if (res.success) {
          // 정리 후 어드민 목록 갱신 — filter 없이 서버 기본값 사용
          const listRes = await service.getAdminCarts();
          if (listRes.success && listRes.data) {
            setCarts(listRes.data.carts);
            setCartsTotal(listRes.data.totalCount);
          }
        }
        return res;
      }, '장바구니 정리에 실패했습니다.'),
    [withLoading, setCarts, setCartsTotal]
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
    fetchAdminCarts,

    // Mutations
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    adminCleanupCarts,

    // 편의 값
    cart,
    carts,
    cartsTotal,
    cartItemCount,
    cartTotalAmount,
    isCartEmpty,
    isCartExpired,
  };
};

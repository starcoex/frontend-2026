import type { ApiResponse } from '../types';

// ============================================================================
// 엔티티
// ============================================================================

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  storeId: number;
  quantity: number;
  appliedPromotionId?: number | null;
  product?: { id: number } | null;
  store?: { id: number } | null;
  subtotal: number;
  currentPrice?: number | null;
  isPriceChanged: boolean;
  isAvailable: boolean;
  availableStock?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Cart {
  id: number;
  userId: number;
  expiresAt?: string | null;
  lastAccessedAt: string;
  items?: CartItem[] | null;
  itemCount: number;
  totalAmount: number;
  estimatedShipping?: number | null;
  isEmpty: boolean;
  isExpired: boolean;
  daysUntilExpiry?: number | null;
  user?: { id: number } | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// ============================================================================
// Input 타입
// ============================================================================

export interface AddToCartInput {
  productId: number;
  storeId: number;
  quantity: number;
  appliedPromotionId?: number;
}

export interface UpdateCartItemInput {
  productId: number;
  storeId: number;
  quantity: number;
}

export interface RemoveFromCartInput {
  productId: number;
  storeId: number;
}

// ============================================================================
// Output 타입
// ============================================================================

export interface CartErrorInfo {
  code?: string | null;
  message: string;
  details?: string | null;
}

export interface AddToCartOutput {
  success?: boolean | null;
  error?: CartErrorInfo | null;
  cart?: Cart | null;
  message?: string | null;
}

export interface UpdateCartItemOutput {
  success?: boolean | null;
  error?: CartErrorInfo | null;
  cart?: Cart | null;
  message?: string | null;
}

export interface RemoveFromCartOutput {
  success?: boolean | null;
  error?: CartErrorInfo | null;
  cart?: Cart | null;
  message?: string | null;
}

// ============================================================================
// 서비스 인터페이스
// ============================================================================

export interface ICartService {
  getMyCart(): Promise<ApiResponse<Cart>>;
  addToCart(input: AddToCartInput): Promise<ApiResponse<AddToCartOutput>>;
  updateCartItem(
    input: UpdateCartItemInput
  ): Promise<ApiResponse<UpdateCartItemOutput>>;
  removeFromCart(
    input: RemoveFromCartInput
  ): Promise<ApiResponse<RemoveFromCartOutput>>;
  clearCart(): Promise<ApiResponse<boolean>>;
}

// ============================================================================
// Context 상태 타입
// ============================================================================

export interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

export interface CartContextActions {
  setCart: (cart: Cart | null) => void;
  updateCartInContext: (updates: Partial<Cart>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type CartContextValue = CartState & CartContextActions;

import type { ApiResponse } from '../types';
import { CreateOrderInput } from '@starcoex-frontend/graphql';

// ============================================================================
// Enum 타입
// ============================================================================

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'RETURNED';

export type OrderItemStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'OUT_OF_STOCK'
  | 'PREPARING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export type FulfillmentType = 'DELIVERY' | 'PICKUP' | 'ON_SITE';

export type OrderPaymentStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED';

// ============================================================================
// 엔티티 타입
// ============================================================================

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  storeId: number;
  productSnapshot: Record<string, any>;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedOptions?: Record<string, any> | null;
  status: OrderItemStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface OrderStatusHistory {
  id: number;
  orderId: number;
  fromStatus?: OrderStatus | null;
  toStatus: OrderStatus;
  reason?: string | null;
  metadata?: Record<string, any> | null;
  createdById?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null; // ← 추가
}

export interface Order {
  id: number;
  orderNumber: string;
  storeId: number;
  storeName: string;
  status: OrderStatus;
  fulfillmentType: FulfillmentType;
  totalAmount: number;
  deliveryAmount: number;
  finalAmount: number;
  userId?: number | null;
  guestEmail?: string | null;
  customerInfo: Record<string, any>;
  deliveryAddress?: Record<string, any> | null;
  pickupTime?: string | null;
  deliveryMemo?: string | null;
  paymentId?: number | null;
  paymentStatus: OrderPaymentStatus;
  confirmedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  items: OrderItem[];
  OrderStatusHistory: OrderStatusHistory[];
}

export interface ErrorInfo {
  code?: string | null;
  message: string;
  details?: string | null;
}

// ============================================================================
// Output 타입
// ============================================================================

export interface CreateOrderOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  order?: Order | null;
  creationMessage?: string | null;
  paymentUrl?: string | null;
  inventoryMessage?: string | null;
  notificationMessage?: string | null;
}

export interface UpdateOrderOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  order?: Order | null;
  updateMessage?: string | null;
  notificationSent?: boolean | null;
  statusChangeMessage?: string | null;
}

// ============================================================================
// Input 타입
// ============================================================================

export interface CreateOrderItemInput {
  productId: number;
  storeId: number;
  productSnapshot: Record<string, any>;
  quantity: number;
  unitPrice: number;
  selectedOptions?: Record<string, any>;
}

// export interface CreateOrderInput {
//   storeId: number;
//   storeName: string;
//   fulfillmentType: FulfillmentType;
//   totalAmount: number;
//   deliveryAmount: number;
//   deliveryMemo?: string;
//   guestEmail?: string;
//   customerInfo: Record<string, any>;
//   items: CreateOrderItemInput[];
//   deliveryAddress?: Record<string, any>;
//   pickupTime?: string;
//   paymentMethodId?: string;
//   couponCode?: string;
//   usePoints?: boolean;
//   pointsToUse?: number;
// }

export interface UpdateOrderStatusInput {
  orderId: number;
  status: OrderStatus;
  reason?: string;
  metadata?: Record<string, any>;
}

export interface AttachPaymentToOrderInput {
  orderId: number;
  paymentId: number;
  paymentStatus: OrderPaymentStatus;
}

// ============================================================================
// 서비스 인터페이스
// ============================================================================

export interface IOrdersService {
  getOrderById(id: number): Promise<ApiResponse<Order>>;
  getMyOrders(limit?: number, offset?: number): Promise<ApiResponse<Order[]>>;
  createOrder(input: CreateOrderInput): Promise<ApiResponse<CreateOrderOutput>>;
  updateOrderStatus(
    input: UpdateOrderStatusInput
  ): Promise<ApiResponse<UpdateOrderOutput>>;
  updateOrderItemStatus(
    itemId: number,
    status: OrderItemStatus
  ): Promise<ApiResponse<OrderItem>>;
  attachPaymentToOrder(
    input: AttachPaymentToOrderInput
  ): Promise<ApiResponse<Order>>;
  deleteOrder(id: number): Promise<ApiResponse<boolean>>;
  deleteOrders(ids: number[]): Promise<ApiResponse<boolean>>;
}

// ============================================================================
// Context 상태 타입
// ============================================================================

export interface OrderFilters {
  search?: string;
  status?: OrderStatus;
  paymentStatus?: OrderPaymentStatus;
  fulfillmentType?: FulfillmentType;
  storeId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  filters: OrderFilters;
  isLoading: boolean;
  error: string | null;
}

export interface OrdersContextActions {
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrderInContext: (id: number, updates: Partial<Order>) => void;
  setCurrentOrder: (order: Order | null) => void;
  setFilters: (filters: Partial<OrderFilters>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type OrdersContextValue = OrdersState & OrdersContextActions;

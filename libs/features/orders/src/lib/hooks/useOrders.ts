import { useCallback, useRef } from 'react';
import type { ApiResponse } from '../types';
import { useOrdersContext } from '../context';
import { getOrdersService } from '../services';
import type {
  UpdateOrderStatusInput,
  AttachPaymentToOrderInput,
  OrderItemStatus,
} from '../types';
import { CreateOrderInput } from '@starcoex-frontend/graphql';

export const useOrders = () => {
  const context = useOrdersContext();

  const {
    setOrders,
    addOrder,
    updateOrderInContext,
    setCurrentOrder,
    setLoading,
    setError,
    clearError,
    isLoading: contextIsLoading,
    orders,
    currentOrder,
    filters,
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

  const fetchOrders = useCallback(
    async (limit = 20, offset = 0) =>
      withLoading(async () => {
        const service = getOrdersService();
        const res = await service.getMyOrders(limit, offset);
        if (res.success && res.data) {
          setOrders(res.data);
        }
        return res;
      }, '주문 목록을 불러오는데 실패했습니다.'),
    [withLoading, setOrders]
  );

  const fetchOrderById = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getOrdersService();
        const res = await service.getOrderById(id);
        if (res.success && res.data) {
          setCurrentOrder(res.data);
          updateOrderInContext(id, res.data);
        }
        return res;
      }, '주문 정보를 불러오는데 실패했습니다.'),
    [withLoading, setCurrentOrder, updateOrderInContext]
  );

  // ============================================================================
  // Mutations
  // ============================================================================

  const createOrder = useCallback(
    async (input: CreateOrderInput) =>
      withLoading(async () => {
        const service = getOrdersService();
        const res = await service.createOrder(input);
        if (res.success && res.data?.order) {
          addOrder(res.data.order);
        }
        return res;
      }, '주문 생성에 실패했습니다.'),
    [withLoading, addOrder]
  );

  const updateOrderStatus = useCallback(
    async (input: UpdateOrderStatusInput) =>
      withLoading(async () => {
        const service = getOrdersService();
        const res = await service.updateOrderStatus(input);
        if (res.success && res.data?.order) {
          updateOrderInContext(input.orderId, res.data.order);
        }
        return res;
      }, '주문 상태 변경에 실패했습니다.'),
    [withLoading, updateOrderInContext]
  );

  const updateOrderItemStatus = useCallback(
    async (itemId: number, status: OrderItemStatus) =>
      withLoading(async () => {
        const service = getOrdersService();
        const res = await service.updateOrderItemStatus(itemId, status);
        if (res.success && res.data) {
          const order = orders.find((o) =>
            o.items.some((item) => item.id === itemId)
          );
          if (order) {
            updateOrderInContext(order.id, {
              items: order.items.map((item) =>
                item.id === itemId ? res.data! : item
              ),
            });
          }
        }
        return res;
      }, '주문 아이템 상태 변경에 실패했습니다.'),
    [withLoading, orders, updateOrderInContext]
  );

  const attachPaymentToOrder = useCallback(
    async (input: AttachPaymentToOrderInput) =>
      withLoading(async () => {
        const service = getOrdersService();
        const res = await service.attachPaymentToOrder(input);
        if (res.success && res.data) {
          updateOrderInContext(input.orderId, res.data);
        }
        return res;
      }, '결제 연결에 실패했습니다.'),
    [withLoading, updateOrderInContext]
  );

  const deleteOrder = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const service = getOrdersService();
        const res = await service.deleteOrder(id);
        if (res.success) {
          setOrders(orders.filter((o) => o.id !== id));
          if (currentOrder?.id === id) setCurrentOrder(null);
        }
        return res;
      }, '주문 삭제에 실패했습니다.'),
    [withLoading, orders, setOrders, currentOrder, setCurrentOrder]
  );

  const deleteOrders = useCallback(
    async (ids: number[]) =>
      withLoading(async () => {
        const service = getOrdersService();
        const res = await service.deleteOrders(ids);
        if (res.success) {
          setOrders(orders.filter((o) => !ids.includes(o.id)));
          if (currentOrder && ids.includes(currentOrder.id)) {
            setCurrentOrder(null);
          }
        }
        return res;
      }, '주문 다건 삭제에 실패했습니다.'),
    [withLoading, orders, setOrders, currentOrder, setCurrentOrder]
  );

  // ============================================================================
  // 클라이언트 사이드 필터링
  // ============================================================================

  const filteredOrders = useCallback(() => {
    let result = [...orders];

    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(s) ||
          o.storeName.toLowerCase().includes(s) ||
          JSON.stringify(o.customerInfo).toLowerCase().includes(s)
      );
    }
    if (filters.status) {
      result = result.filter((o) => o.status === filters.status);
    }
    if (filters.paymentStatus) {
      result = result.filter((o) => o.paymentStatus === filters.paymentStatus);
    }
    if (filters.fulfillmentType) {
      result = result.filter(
        (o) => o.fulfillmentType === filters.fulfillmentType
      );
    }
    if (filters.storeId) {
      result = result.filter((o) => o.storeId === filters.storeId);
    }
    if (filters.dateFrom) {
      result = result.filter(
        (o) => new Date(o.createdAt) >= new Date(filters.dateFrom!)
      );
    }
    if (filters.dateTo) {
      result = result.filter(
        (o) => new Date(o.createdAt) <= new Date(filters.dateTo!)
      );
    }

    return result;
  }, [orders, filters]);

  return {
    ...context,

    // Queries
    fetchOrders,
    fetchOrderById,
    filteredOrders,

    // Mutations
    createOrder,
    updateOrderStatus,
    updateOrderItemStatus,
    attachPaymentToOrder,
    deleteOrder,
    deleteOrders,

    // 편의 값
    orders,
    currentOrder,
    filters,
  };
};

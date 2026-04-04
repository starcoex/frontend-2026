import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  GET_ORDER_BY_ID,
  GET_MY_ORDERS,
  CREATE_ORDER,
  UPDATE_ORDER_STATUS,
  UPDATE_ORDER_ITEM_STATUS,
  ATTACH_PAYMENT_TO_ORDER,
  DELETE_ORDER,
  DELETE_ORDERS,
  CreateOrderInput,
} from '@starcoex-frontend/graphql';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors';
import type { ApiResponse } from '../types';
import type {
  IOrdersService,
  Order,
  OrderItem,
  OrderItemStatus,
  CreateOrderOutput,
  UpdateOrderStatusInput,
  UpdateOrderOutput,
  AttachPaymentToOrderInput,
} from '../types';

export class OrdersService implements IOrdersService {
  constructor(private client: ApolloClient) {}

  // ============================================================================
  // 공통 헬퍼
  // ============================================================================

  private async query<
    TData = any,
    TVars extends OperationVariables = OperationVariables
  >(query: any, variables?: TVars): Promise<ApiResponse<TData>> {
    try {
      const result = await this.client.query<TData, TVars>({
        query,
        variables: variables as TVars,
        errorPolicy: 'all',
        fetchPolicy: 'network-only',
      });

      const { data, error, extensions } = result as {
        data?: TData;
        error?: { message?: string };
        extensions?: Record<string, unknown>;
      };

      if (error) {
        const gqlError: GraphQLFormattedError = {
          message: error.message ?? '요청 처리 중 오류가 발생했습니다.',
          locations: undefined,
          path: undefined,
          extensions: extensions ?? {},
        };
        return createErrorResponse<TData>(
          apiErrorFromGraphQLErrors([gqlError])
        );
      }

      return { success: true, data: data as TData };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse<TData>(apiError);
    }
  }

  private async mutate<
    TData = any,
    TVars extends OperationVariables = OperationVariables
  >(mutation: any, variables: TVars): Promise<ApiResponse<TData>> {
    try {
      const { data, error, extensions } = await this.client.mutate<
        TData,
        TVars
      >({
        mutation,
        variables,
        errorPolicy: 'all',
        fetchPolicy: 'network-only',
      });

      if (error) {
        const gqlError: GraphQLFormattedError = {
          message: error.message ?? '요청 처리 중 오류가 발생했습니다.',
          locations: undefined,
          path: undefined,
          extensions: (extensions ?? {}) as Record<string, unknown>,
        };
        return createErrorResponse<TData>(
          apiErrorFromGraphQLErrors([gqlError])
        );
      }

      return { success: true, data: data as TData };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse<TData>(apiError);
    }
  }

  // ============================================================================
  // Queries
  // ============================================================================

  async getOrderById(id: number): Promise<ApiResponse<Order>> {
    const res = await this.query<{ getOrderById: Order }>(GET_ORDER_BY_ID, {
      id,
    });
    if (res.success && res.data?.getOrderById) {
      return { success: true, data: res.data.getOrderById };
    }
    return res as unknown as ApiResponse<Order>;
  }

  async getMyOrders(limit = 20, offset = 0): Promise<ApiResponse<Order[]>> {
    const res = await this.query<{ myOrders: Order[] }>(GET_MY_ORDERS, {
      limit,
      offset,
    });
    if (res.success && res.data?.myOrders) {
      return { success: true, data: res.data.myOrders };
    }
    return res as unknown as ApiResponse<Order[]>;
  }

  // ============================================================================
  // Mutations
  // ============================================================================

  async createOrder(
    input: CreateOrderInput
  ): Promise<ApiResponse<CreateOrderOutput>> {
    const res = await this.mutate<{ createOrder: CreateOrderOutput }>(
      CREATE_ORDER,
      { input }
    );
    if (res.success && res.data?.createOrder) {
      return { success: true, data: res.data.createOrder };
    }
    return res as unknown as ApiResponse<CreateOrderOutput>;
  }

  async updateOrderStatus(
    input: UpdateOrderStatusInput
  ): Promise<ApiResponse<UpdateOrderOutput>> {
    const res = await this.mutate<{ updateOrderStatus: UpdateOrderOutput }>(
      UPDATE_ORDER_STATUS,
      { input }
    );
    if (res.success && res.data?.updateOrderStatus) {
      return { success: true, data: res.data.updateOrderStatus };
    }
    return res as unknown as ApiResponse<UpdateOrderOutput>;
  }

  async updateOrderItemStatus(
    itemId: number,
    status: OrderItemStatus
  ): Promise<ApiResponse<OrderItem>> {
    const res = await this.mutate<{ updateOrderItemStatus: OrderItem }>(
      UPDATE_ORDER_ITEM_STATUS,
      { itemId, status }
    );
    if (res.success && res.data?.updateOrderItemStatus) {
      return { success: true, data: res.data.updateOrderItemStatus };
    }
    return res as unknown as ApiResponse<OrderItem>;
  }

  async attachPaymentToOrder(
    input: AttachPaymentToOrderInput
  ): Promise<ApiResponse<Order>> {
    const res = await this.mutate<{ attachPaymentToOrder: Order }>(
      ATTACH_PAYMENT_TO_ORDER,
      { input }
    );
    if (res.success && res.data?.attachPaymentToOrder) {
      return { success: true, data: res.data.attachPaymentToOrder };
    }
    return res as unknown as ApiResponse<Order>;
  }

  async deleteOrder(id: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteOrder: boolean }>(DELETE_ORDER, {
      id,
    });
    if (res.success) {
      return { success: true, data: res.data?.deleteOrder ?? false };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  async deleteOrders(ids: number[]): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteOrders: boolean }>(DELETE_ORDERS, {
      ids,
    });
    if (res.success) {
      return { success: true, data: res.data?.deleteOrders ?? false };
    }
    return res as unknown as ApiResponse<boolean>;
  }
}

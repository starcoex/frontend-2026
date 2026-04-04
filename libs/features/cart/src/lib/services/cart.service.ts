import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  GET_MY_CART,
  ADD_TO_CART,
  UPDATE_CART_ITEM,
  REMOVE_FROM_CART,
  CLEAR_CART,
} from '@starcoex-frontend/graphql';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors';
import type {
  ApiResponse,
  ICartService,
  Cart,
  AddToCartInput,
  AddToCartOutput,
  UpdateCartItemInput,
  UpdateCartItemOutput,
  RemoveFromCartInput,
  RemoveFromCartOutput,
} from '../types';

export class CartService implements ICartService {
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
  >(
    mutation: any,
    variables: TVars = {} as TVars
  ): Promise<ApiResponse<TData>> {
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
        const apiError = apiErrorFromGraphQLErrors([gqlError]);
        return createErrorResponse<TData>(apiError);
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

  async getMyCart(): Promise<ApiResponse<Cart>> {
    const res = await this.query<{ myCart: Cart }>(GET_MY_CART);
    if (res.success && res.data?.myCart) {
      return { success: true, data: res.data.myCart };
    }
    return res as unknown as ApiResponse<Cart>;
  }

  // ============================================================================
  // Mutations
  // ============================================================================

  async addToCart(
    input: AddToCartInput
  ): Promise<ApiResponse<AddToCartOutput>> {
    const res = await this.mutate<{ addToCart: AddToCartOutput }>(ADD_TO_CART, {
      input,
    });
    if (res.success && res.data?.addToCart) {
      return { success: true, data: res.data.addToCart };
    }
    return res as unknown as ApiResponse<AddToCartOutput>;
  }

  async updateCartItem(
    input: UpdateCartItemInput
  ): Promise<ApiResponse<UpdateCartItemOutput>> {
    const res = await this.mutate<{ updateCartItem: UpdateCartItemOutput }>(
      UPDATE_CART_ITEM,
      { input }
    );
    if (res.success && res.data?.updateCartItem) {
      return { success: true, data: res.data.updateCartItem };
    }
    return res as unknown as ApiResponse<UpdateCartItemOutput>;
  }

  async removeFromCart(
    input: RemoveFromCartInput
  ): Promise<ApiResponse<RemoveFromCartOutput>> {
    const res = await this.mutate<{ removeFromCart: RemoveFromCartOutput }>(
      REMOVE_FROM_CART,
      { input }
    );
    if (res.success && res.data?.removeFromCart) {
      return { success: true, data: res.data.removeFromCart };
    }
    return res as unknown as ApiResponse<RemoveFromCartOutput>;
  }

  async clearCart(): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ clearCart: boolean }>(CLEAR_CART);
    if (res.success && res.data?.clearCart === true) {
      return { success: true, data: true };
    }
    return res as unknown as ApiResponse<boolean>;
  }
}

import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';

import {
  SMART_SEARCH_ADDRESSES,
  SEARCH_ADDRESSES_FROM_API,
  SEARCH_USER_ADDRESSES,
  GET_USER_ADDRESS_BY_ID,
  GET_USER_ADDRESSES,
  GET_USER_ADDRESS_STATS,
  GET_USER_SEARCH_LOGS, // ✅ 추가
  SAVE_ADDRESS,
  UPDATE_ADDRESS,
  REMOVE_ADDRESS,
  CREATE_ADDRESS_POPUP_URL,
  SmartSearchInput,
  ExternalAddressSearchInput,
  SearchAddressInput,
  FilterAddressInput,
  SearchAddressLogInput, // ✅ 추가
  SaveAddressInput,
  UpdateAddressInput,
  CreateAddressPopupInput,
  SmartSearchAddressesQuery,
  SmartSearchAddressesQueryVariables,
  SearchAddressesFromApiQuery,
  SearchAddressesFromApiQueryVariables,
  SearchUserAddressesQuery,
  SearchUserAddressesQueryVariables,
  GetUserAddressByIdQuery,
  GetUserAddressByIdQueryVariables,
  GetUserAddressesQuery,
  GetUserAddressesQueryVariables,
  GetUserAddressStatsQuery,
  GetUserSearchLogsQuery, // ✅ 추가
  GetUserSearchLogsQueryVariables, // ✅ 추가
  SaveAddressMutation,
  SaveAddressMutationVariables,
  UpdateAddressMutation,
  UpdateAddressMutationVariables,
  RemoveAddressMutation,
  RemoveAddressMutationVariables,
  CreateAddressPopupUrlMutation,
  CreateAddressPopupUrlMutationVariables,
} from '@starcoex-frontend/graphql';

import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors/api-error';
import { IAddressService, ApiResponse } from '../types';

export class AddressService implements IAddressService {
  constructor(private client: ApolloClient) {}

  // 공통 mutation helper
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

        const apiError = apiErrorFromGraphQLErrors([gqlError]);
        return createErrorResponse<TData>(apiError);
      }

      return {
        success: true,
        data: data as TData,
      };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse<TData>(apiError);
    }
  }

  // 공통 query helper
  private async query<
    TData = any,
    TVars extends OperationVariables = OperationVariables
  >(
    query: any,
    variables?: TVars,
    options?: {
      fetchPolicy?: 'cache-first' | 'network-only' | 'cache-and-network';
    }
  ): Promise<ApiResponse<TData>> {
    try {
      const result = await this.client.query<TData, TVars>({
        query,
        variables: variables as TVars,
        errorPolicy: 'all',
        fetchPolicy: options?.fetchPolicy || 'cache-first',
      } as any);

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

        const apiError = apiErrorFromGraphQLErrors([gqlError]);
        return createErrorResponse<TData>(apiError);
      }

      return {
        success: true,
        data: data as TData,
      };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse<TData>(apiError);
    }
  }

  // ============================================================================
  // 주소 검색 API
  // ============================================================================

  async smartSearchAddresses(
    input: SmartSearchInput
  ): Promise<ApiResponse<SmartSearchAddressesQuery>> {
    return this.query<
      SmartSearchAddressesQuery,
      SmartSearchAddressesQueryVariables
    >(SMART_SEARCH_ADDRESSES, { input }, { fetchPolicy: 'network-only' });
  }

  async searchAddressesFromAPI(
    input: ExternalAddressSearchInput
  ): Promise<ApiResponse<SearchAddressesFromApiQuery>> {
    return this.query<
      SearchAddressesFromApiQuery,
      SearchAddressesFromApiQueryVariables
    >(SEARCH_ADDRESSES_FROM_API, { input }, { fetchPolicy: 'network-only' });
  }

  async searchUserAddresses(
    input: SearchAddressInput
  ): Promise<ApiResponse<SearchUserAddressesQuery>> {
    return this.query<
      SearchUserAddressesQuery,
      SearchUserAddressesQueryVariables
    >(SEARCH_USER_ADDRESSES, { input }, { fetchPolicy: 'cache-first' });
  }

  async getUserAddressById(
    id: number
  ): Promise<ApiResponse<GetUserAddressByIdQuery>> {
    if (!id || id <= 0 || isNaN(id)) {
      return {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '유효하지 않은 주소 ID입니다.',
        },
      };
    }

    return this.query<
      GetUserAddressByIdQuery,
      GetUserAddressByIdQueryVariables
    >(GET_USER_ADDRESS_BY_ID, { id }, { fetchPolicy: 'network-only' });
  }

  async getUserAddresses(
    filter: FilterAddressInput
  ): Promise<ApiResponse<GetUserAddressesQuery>> {
    return this.query<GetUserAddressesQuery, GetUserAddressesQueryVariables>(
      GET_USER_ADDRESSES,
      { filter },
      { fetchPolicy: 'cache-first' }
    );
  }

  async getUserAddressStats(): Promise<ApiResponse<GetUserAddressStatsQuery>> {
    return this.query<GetUserAddressStatsQuery>(
      GET_USER_ADDRESS_STATS,
      undefined,
      { fetchPolicy: 'cache-first' }
    );
  }

  // ✅ 새로운 메서드 추가
  async getUserSearchLogs(
    filter: SearchAddressLogInput
  ): Promise<ApiResponse<GetUserSearchLogsQuery>> {
    return this.query<GetUserSearchLogsQuery, GetUserSearchLogsQueryVariables>(
      GET_USER_SEARCH_LOGS,
      { filter },
      { fetchPolicy: 'cache-first' }
    );
  }

  // ============================================================================
  // 주소 관리 Mutations
  // ============================================================================

  async saveAddress(
    input: SaveAddressInput
  ): Promise<ApiResponse<SaveAddressMutation>> {
    return this.mutate<SaveAddressMutation, SaveAddressMutationVariables>(
      SAVE_ADDRESS,
      { input }
    );
  }

  async updateAddress(
    input: UpdateAddressInput
  ): Promise<ApiResponse<UpdateAddressMutation>> {
    return this.mutate<UpdateAddressMutation, UpdateAddressMutationVariables>(
      UPDATE_ADDRESS,
      { input }
    );
  }

  async removeAddress(id: number): Promise<ApiResponse<RemoveAddressMutation>> {
    if (!id || id <= 0 || isNaN(id)) {
      return {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '유효하지 않은 주소 ID입니다.',
        },
      };
    }

    return this.mutate<RemoveAddressMutation, RemoveAddressMutationVariables>(
      REMOVE_ADDRESS,
      { id }
    );
  }

  // ============================================================================
  // 팝업 URL 생성
  // ============================================================================

  async createAddressPopupUrl(
    input: CreateAddressPopupInput
  ): Promise<ApiResponse<CreateAddressPopupUrlMutation>> {
    return this.mutate<
      CreateAddressPopupUrlMutation,
      CreateAddressPopupUrlMutationVariables
    >(CREATE_ADDRESS_POPUP_URL, { input });
  }

  // ============================================================================
  // 유틸리티
  // ============================================================================

  clearAddressCache(): void {
    this.client
      .clearStore()
      .catch((err) =>
        console.error('[AddressService] clearAddressCache error', err)
      );
  }
}

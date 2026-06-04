import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  SMART_SEARCH_ADDRESSES,
  SEARCH_ADDRESSES_FROM_API,
  SEARCH_USER_ADDRESSES,
  GET_USER_ADDRESS_BY_ID,
  GET_USER_ADDRESSES,
  GET_USER_ADDRESS_STATS,
  GET_USER_SEARCH_LOGS,
  SAVE_ADDRESS,
  UPDATE_ADDRESS,
  REMOVE_ADDRESS,
  BULK_REMOVE_ADDRESSES,
  CREATE_ADDRESS_POPUP_URL,
  ADMIN_GET_ALL_ADDRESSES,
  ADMIN_GET_SEARCH_LOGS,
  ADMIN_GET_API_LOGS,
  ADMIN_GET_ADDRESS_STATS,
  ADMIN_UPDATE_ADDRESS_STATUS,
  ADMIN_BULK_REMOVE_ADDRESSES,
} from '@starcoex-frontend/graphql';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors';
import type { ApiResponse } from '../types';
import type {
  IAddressService,
  SmartSearchInput,
  SmartSearchResult,
  ExternalAddressSearchInput,
  ExternalAddressSearchResult,
  SearchAddressInput,
  AddressSearchResult,
  FilterAddressInput,
  SearchAddressLogInput,
  PaginatedSearchLogResult,
  SaveAddressInput,
  UpdateAddressInput,
  BulkRemoveAddressInput,
  BulkRemoveResult,
  CreateAddressPopupInput,
  AddressPopupUrlResult,
  Address,
  AddressStatsResult,
  AdminAddressFilterInput,
  AdminAddressListResult,
  AdminSearchLogFilterInput,
  AdminSearchLogListResult,
  AdminApiLogFilterInput,
  AdminApiLogListResult,
  AdminAddressStatsResult,
  AdminUpdateAddressStatusInput,
} from '../types';

export class AddressService implements IAddressService {
  constructor(private client: ApolloClient) {}

  // ============================================================================
  // 공통 헬퍼
  // ============================================================================

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

  private isValidId(id: number): boolean {
    return !!id && id > 0 && !isNaN(id);
  }

  // ============================================================================
  // 주소 검색
  // ============================================================================

  async smartSearchAddresses(
    input: SmartSearchInput
  ): Promise<ApiResponse<SmartSearchResult>> {
    const res = await this.query<{ smartSearchAddresses: SmartSearchResult }>(
      SMART_SEARCH_ADDRESSES,
      { input },
      { fetchPolicy: 'network-only' }
    );
    if (res.success && res.data?.smartSearchAddresses) {
      return { success: true, data: res.data.smartSearchAddresses };
    }
    return res as unknown as ApiResponse<SmartSearchResult>;
  }

  async searchAddressesFromAPI(
    input: ExternalAddressSearchInput
  ): Promise<ApiResponse<ExternalAddressSearchResult>> {
    const res = await this.query<{
      searchAddressesFromAPI: ExternalAddressSearchResult;
    }>(SEARCH_ADDRESSES_FROM_API, { input }, { fetchPolicy: 'network-only' });
    if (res.success && res.data?.searchAddressesFromAPI) {
      return { success: true, data: res.data.searchAddressesFromAPI };
    }
    return res as unknown as ApiResponse<ExternalAddressSearchResult>;
  }

  async searchUserAddresses(
    input: SearchAddressInput
  ): Promise<ApiResponse<AddressSearchResult>> {
    const res = await this.query<{ searchUserAddresses: AddressSearchResult }>(
      SEARCH_USER_ADDRESSES,
      { input },
      { fetchPolicy: 'network-only' }
    );
    if (res.success && res.data?.searchUserAddresses) {
      return { success: true, data: res.data.searchUserAddresses };
    }
    return res as unknown as ApiResponse<AddressSearchResult>;
  }

  async getUserAddressById(id: number): Promise<ApiResponse<Address>> {
    if (!this.isValidId(id)) {
      return {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '유효하지 않은 주소 ID입니다.',
        },
      };
    }
    const res = await this.query<{ getUserAddressById: Address }>(
      GET_USER_ADDRESS_BY_ID,
      { id },
      { fetchPolicy: 'network-only' }
    );
    if (res.success && res.data?.getUserAddressById) {
      return { success: true, data: res.data.getUserAddressById };
    }
    return res as unknown as ApiResponse<Address>;
  }

  async getUserAddresses(
    filter: FilterAddressInput
  ): Promise<ApiResponse<AddressSearchResult>> {
    const res = await this.query<{ getUserAddresses: AddressSearchResult }>(
      GET_USER_ADDRESSES,
      { filter },
      { fetchPolicy: 'cache-first' }
    );
    if (res.success && res.data?.getUserAddresses) {
      return { success: true, data: res.data.getUserAddresses };
    }
    return res as unknown as ApiResponse<AddressSearchResult>;
  }

  async getUserAddressStats(): Promise<ApiResponse<AddressStatsResult>> {
    const res = await this.query<{ getUserAddressStats: AddressStatsResult }>(
      GET_USER_ADDRESS_STATS,
      undefined,
      { fetchPolicy: 'cache-first' }
    );
    if (res.success && res.data?.getUserAddressStats) {
      return { success: true, data: res.data.getUserAddressStats };
    }
    return res as unknown as ApiResponse<AddressStatsResult>;
  }

  async getUserSearchLogs(
    filter: SearchAddressLogInput
  ): Promise<ApiResponse<PaginatedSearchLogResult>> {
    const res = await this.query<{
      getUserSearchLogs: PaginatedSearchLogResult;
    }>(GET_USER_SEARCH_LOGS, { filter }, { fetchPolicy: 'cache-first' });
    if (res.success && res.data?.getUserSearchLogs) {
      return { success: true, data: res.data.getUserSearchLogs };
    }
    return res as unknown as ApiResponse<PaginatedSearchLogResult>;
  }

  // ============================================================================
  // 주소 관리
  // ============================================================================

  async saveAddress(input: SaveAddressInput): Promise<ApiResponse<Address>> {
    const res = await this.mutate<{ saveAddress: Address }>(SAVE_ADDRESS, {
      input,
    });
    if (res.success && res.data?.saveAddress) {
      return { success: true, data: res.data.saveAddress };
    }
    return res as unknown as ApiResponse<Address>;
  }

  async updateAddress(
    input: UpdateAddressInput
  ): Promise<ApiResponse<Address>> {
    const res = await this.mutate<{ updateAddress: Address }>(UPDATE_ADDRESS, {
      input,
    });
    if (res.success && res.data?.updateAddress) {
      return { success: true, data: res.data.updateAddress };
    }
    return res as unknown as ApiResponse<Address>;
  }

  async removeAddress(id: number): Promise<ApiResponse<boolean>> {
    if (!this.isValidId(id)) {
      return {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '유효하지 않은 주소 ID입니다.',
        },
      };
    }
    const res = await this.mutate<{ removeAddress: boolean }>(REMOVE_ADDRESS, {
      id,
    });
    if (res.success && res.data?.removeAddress === true) {
      return { success: true, data: true };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  async bulkRemoveAddresses(
    input: BulkRemoveAddressInput
  ): Promise<ApiResponse<BulkRemoveResult>> {
    const res = await this.mutate<{ bulkRemoveAddresses: BulkRemoveResult }>(
      BULK_REMOVE_ADDRESSES,
      { input }
    );
    if (res.success && res.data?.bulkRemoveAddresses) {
      return { success: true, data: res.data.bulkRemoveAddresses };
    }
    return res as unknown as ApiResponse<BulkRemoveResult>;
  }

  // ============================================================================
  // 팝업 URL 생성
  // ============================================================================

  async createAddressPopupUrl(
    input: CreateAddressPopupInput
  ): Promise<ApiResponse<AddressPopupUrlResult>> {
    const res = await this.mutate<{
      createAddressPopupUrl: AddressPopupUrlResult;
    }>(CREATE_ADDRESS_POPUP_URL, { input });
    if (res.success && res.data?.createAddressPopupUrl) {
      return { success: true, data: res.data.createAddressPopupUrl };
    }
    return res as unknown as ApiResponse<AddressPopupUrlResult>;
  }

  // ============================================================================
  // 어드민
  // ============================================================================

  async adminGetAllAddresses(
    filter: AdminAddressFilterInput
  ): Promise<ApiResponse<AdminAddressListResult>> {
    const res = await this.query<{
      adminGetAllAddresses: AdminAddressListResult;
    }>(ADMIN_GET_ALL_ADDRESSES, { filter }, { fetchPolicy: 'network-only' });
    if (res.success && res.data?.adminGetAllAddresses) {
      return { success: true, data: res.data.adminGetAllAddresses };
    }
    return res as unknown as ApiResponse<AdminAddressListResult>;
  }

  async adminGetSearchLogs(
    filter: AdminSearchLogFilterInput
  ): Promise<ApiResponse<AdminSearchLogListResult>> {
    const res = await this.query<{
      adminGetSearchLogs: AdminSearchLogListResult;
    }>(ADMIN_GET_SEARCH_LOGS, { filter }, { fetchPolicy: 'network-only' });
    if (res.success && res.data?.adminGetSearchLogs) {
      return { success: true, data: res.data.adminGetSearchLogs };
    }
    return res as unknown as ApiResponse<AdminSearchLogListResult>;
  }

  async adminGetApiLogs(
    filter: AdminApiLogFilterInput
  ): Promise<ApiResponse<AdminApiLogListResult>> {
    const res = await this.query<{ adminGetApiLogs: AdminApiLogListResult }>(
      ADMIN_GET_API_LOGS,
      { filter },
      { fetchPolicy: 'network-only' }
    );
    if (res.success && res.data?.adminGetApiLogs) {
      return { success: true, data: res.data.adminGetApiLogs };
    }
    return res as unknown as ApiResponse<AdminApiLogListResult>;
  }

  async adminGetAddressStats(): Promise<ApiResponse<AdminAddressStatsResult>> {
    const res = await this.query<{
      adminGetAddressStats: AdminAddressStatsResult;
    }>(ADMIN_GET_ADDRESS_STATS, undefined, { fetchPolicy: 'network-only' });
    if (res.success && res.data?.adminGetAddressStats) {
      return { success: true, data: res.data.adminGetAddressStats };
    }
    return res as unknown as ApiResponse<AdminAddressStatsResult>;
  }

  async adminUpdateAddressStatus(
    input: AdminUpdateAddressStatusInput
  ): Promise<ApiResponse<Address>> {
    const res = await this.mutate<{ adminUpdateAddressStatus: Address }>(
      ADMIN_UPDATE_ADDRESS_STATUS,
      { input }
    );
    if (res.success && res.data?.adminUpdateAddressStatus) {
      return { success: true, data: res.data.adminUpdateAddressStatus };
    }
    return res as unknown as ApiResponse<Address>;
  }

  async adminBulkRemoveAddresses(
    input: BulkRemoveAddressInput
  ): Promise<ApiResponse<BulkRemoveResult>> {
    const res = await this.mutate<{
      adminBulkRemoveAddresses: BulkRemoveResult;
    }>(ADMIN_BULK_REMOVE_ADDRESSES, { input });
    if (res.success && res.data?.adminBulkRemoveAddresses) {
      return { success: true, data: res.data.adminBulkRemoveAddresses };
    }
    return res as unknown as ApiResponse<BulkRemoveResult>;
  }

  // ============================================================================
  // 유틸리티
  // ============================================================================

  clearAddressCache(): void {
    this.client
      .clearStore()
      .catch((err) =>
        console.error('[AnalyticsService] clearAddressCache error', err)
      );
  }
}

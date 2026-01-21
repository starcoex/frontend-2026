import { useCallback, useRef } from 'react';
import { useAddressContext } from '../context'; // ✅ context/index.ts에서 import
import { getAddressService } from '../services';
import {
  SmartSearchInput,
  ExternalAddressSearchInput,
  SearchAddressInput,
  FilterAddressInput,
  SaveAddressInput,
  UpdateAddressInput,
  CreateAddressPopupInput,
  SmartSearchAddressesQuery,
  SearchAddressesFromApiQuery,
  SearchUserAddressesQuery,
  GetUserAddressByIdQuery,
  GetUserAddressesQuery,
  GetUserAddressStatsQuery,
  SaveAddressMutation,
  UpdateAddressMutation,
  RemoveAddressMutation,
  CreateAddressPopupUrlMutation,
  JusoApiAddress,
  Address,
} from '@starcoex-frontend/graphql';
import type { ApiResponse } from '../types';

interface UseAddressReturn {
  // Context 상태
  selectedAddress: JusoApiAddress | null;
  savedAddresses: Partial<Address>[]; // ✅ Partial<Address>
  searchResults: JusoApiAddress[];
  isLoading: boolean;
  error: string | null;

  // 주소 검색
  smartSearchAddresses: (
    input: SmartSearchInput
  ) => Promise<ApiResponse<SmartSearchAddressesQuery>>;
  searchAddressesFromAPI: (
    input: ExternalAddressSearchInput
  ) => Promise<ApiResponse<SearchAddressesFromApiQuery>>;
  searchUserAddresses: (
    input: SearchAddressInput
  ) => Promise<ApiResponse<SearchUserAddressesQuery>>;
  getUserAddressById: (
    id: number
  ) => Promise<ApiResponse<GetUserAddressByIdQuery>>;
  getUserAddresses: (
    filter: FilterAddressInput
  ) => Promise<ApiResponse<GetUserAddressesQuery>>;
  getUserAddressStats: () => Promise<ApiResponse<GetUserAddressStatsQuery>>;

  // 주소 관리
  saveAddress: (
    input: SaveAddressInput
  ) => Promise<ApiResponse<SaveAddressMutation>>;
  updateAddress: (
    input: UpdateAddressInput
  ) => Promise<ApiResponse<UpdateAddressMutation>>;
  removeAddress: (id: number) => Promise<ApiResponse<RemoveAddressMutation>>;

  // 팝업 URL
  createAddressPopupUrl: (
    input: CreateAddressPopupInput
  ) => Promise<ApiResponse<CreateAddressPopupUrlMutation>>;

  // Context 액션
  setSelectedAddress: (address: JusoApiAddress | null) => void;
  clearError: () => void;
  clearSearchResults: () => void;
  clearSelectedAddress: () => void;
  clearAddressCache: () => void;
}

export const useAddress = (): UseAddressReturn => {
  const context = useAddressContext();
  const pendingOperations = useRef(new Set<string>());

  const withLoading = useCallback(
    async <T>(
      operation: () => Promise<ApiResponse<T>>,
      defaultErrorMessage: string,
      options?: {
        operationId?: string;
        preventDuplicate?: boolean;
        updateContext?: (data: T) => void;
      }
    ): Promise<ApiResponse<T>> => {
      const {
        operationId,
        preventDuplicate = false,
        updateContext,
      } = options || {};

      if (preventDuplicate && operationId) {
        if (pendingOperations.current.has(operationId)) {
          console.warn(`⚠️ Operation "${operationId}" already in progress`);
          return {
            success: false,
            error: {
              code: 'ALREADY_LOADING',
              message: '이미 요청이 진행 중입니다.',
            },
          };
        }
        pendingOperations.current.add(operationId);
      }

      try {
        if (!context.isLoading) {
          context.setLoading();
        }
        context.clearError();

        const res = await operation();

        if (!res.success) {
          let errorMsg = defaultErrorMessage;

          if (res.graphQLErrors && res.graphQLErrors.length > 0) {
            errorMsg = res.graphQLErrors[0].message;
          } else if (res.error?.message) {
            errorMsg = res.error.message;
          }

          context.setError(errorMsg);
        } else if (updateContext && res.data) {
          updateContext(res.data);
        }

        return res;
      } catch (err) {
        console.error('[withLoading] Operation failed:', err);
        const errorMsg =
          err instanceof Error ? err.message : defaultErrorMessage;
        context.setError(errorMsg);

        return {
          success: false,
          error: {
            code: 'OPERATION_FAILED',
            message: errorMsg,
          },
        } as ApiResponse<T>;
      } finally {
        if (preventDuplicate && operationId) {
          pendingOperations.current.delete(operationId);
        }
      }
    },
    [context]
  );

  // ============================================================================
  // 주소 검색
  // ============================================================================

  const smartSearchAddresses = useCallback(
    (input: SmartSearchInput) =>
      withLoading(
        () => getAddressService().smartSearchAddresses(input),
        '스마트 주소 검색에 실패했습니다',
        {
          updateContext: (data: SmartSearchAddressesQuery) => {
            context.setSearchResults(data.smartSearchAddresses.results.juso);
          },
        }
      ),
    [withLoading, context]
  );

  const searchAddressesFromAPI = useCallback(
    (input: ExternalAddressSearchInput) =>
      withLoading(
        () => getAddressService().searchAddressesFromAPI(input),
        '주소 검색에 실패했습니다',
        {
          updateContext: (data: SearchAddressesFromApiQuery) => {
            context.setSearchResults(data.searchAddressesFromAPI.results.juso);
          },
        }
      ),
    [withLoading, context]
  );

  const searchUserAddresses = useCallback(
    (input: SearchAddressInput) =>
      withLoading(
        () => getAddressService().searchUserAddresses(input),
        '사용자 주소 검색에 실패했습니다'
      ),
    [withLoading]
  );

  const getUserAddressById = useCallback(
    (id: number) =>
      withLoading(
        () => getAddressService().getUserAddressById(id),
        '주소 조회에 실패했습니다'
      ),
    [withLoading]
  );

  const getUserAddresses = useCallback(
    (filter: FilterAddressInput) =>
      withLoading(
        () => getAddressService().getUserAddresses(filter),
        '주소 목록 조회에 실패했습니다',
        {
          updateContext: (data: GetUserAddressesQuery) => {
            // ✅ Partial<Address>[]로 자동 호환됨
            context.setSavedAddresses(data.getUserAddresses.addresses);
          },
        }
      ),
    [withLoading, context]
  );

  const getUserAddressStats = useCallback(
    () =>
      withLoading(
        () => getAddressService().getUserAddressStats(),
        '주소 통계 조회에 실패했습니다'
      ),
    [withLoading]
  );

  // ============================================================================
  // 주소 관리
  // ============================================================================

  const saveAddress = useCallback(
    (input: SaveAddressInput) =>
      withLoading(
        () => getAddressService().saveAddress(input),
        '주소 저장에 실패했습니다',
        {
          operationId: `save-address-${input.roadFullAddr}`,
          preventDuplicate: true,
        }
      ),
    [withLoading]
  );

  const updateAddress = useCallback(
    (input: UpdateAddressInput) =>
      withLoading(
        () => getAddressService().updateAddress(input),
        '주소 수정에 실패했습니다',
        {
          operationId: `update-address-${input.id}`,
          preventDuplicate: true,
        }
      ),
    [withLoading]
  );

  const removeAddress = useCallback(
    (id: number) =>
      withLoading(
        () => getAddressService().removeAddress(id),
        '주소 삭제에 실패했습니다',
        {
          operationId: `remove-address-${id}`,
          preventDuplicate: true,
        }
      ),
    [withLoading]
  );

  // ============================================================================
  // 팝업 URL
  // ============================================================================

  const createAddressPopupUrl = useCallback(
    (input: CreateAddressPopupInput) =>
      withLoading(
        () => getAddressService().createAddressPopupUrl(input),
        '팝업 URL 생성에 실패했습니다'
      ),
    [withLoading]
  );

  // ============================================================================
  // 유틸리티
  // ============================================================================

  const clearAddressCache = useCallback(() => {
    getAddressService().clearAddressCache();
  }, []);

  return {
    // Context 상태
    selectedAddress: context.selectedAddress,
    savedAddresses: context.savedAddresses,
    searchResults: context.searchResults,
    isLoading: context.isLoading,
    error: context.error,

    // API 메서드
    smartSearchAddresses,
    searchAddressesFromAPI,
    searchUserAddresses,
    getUserAddressById,
    getUserAddresses,
    getUserAddressStats,

    saveAddress,
    updateAddress,
    removeAddress,

    createAddressPopupUrl,

    // Context 액션
    setSelectedAddress: context.setSelectedAddress,
    clearError: context.clearError,
    clearSearchResults: context.clearSearchResults,
    clearSelectedAddress: context.clearSelectedAddress,
    clearAddressCache,
  };
};

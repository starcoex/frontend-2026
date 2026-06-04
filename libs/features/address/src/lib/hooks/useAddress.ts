import { useCallback, useRef } from 'react';
import { useAddressContext } from '../context';
import { getAddressService } from '../services';
import type { ApiResponse } from '../types';
import type {
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

export const useAddress = () => {
  const context = useAddressContext();

  const {
    setSelectedAddress,
    setSavedAddresses,
    setSearchResults,
    setLoading,
    setError,
    clearError,
    isLoading: contextIsLoading,
    selectedAddress,
    savedAddresses,
    searchResults,
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
  // 주소 검색
  // ============================================================================

  const smartSearchAddresses = useCallback(
    async (input: SmartSearchInput): Promise<ApiResponse<SmartSearchResult>> =>
      withLoading(async () => {
        const service = getAddressService();
        const res = await service.smartSearchAddresses(input);
        if (res.success && res.data) {
          setSearchResults(res.data.results.juso);
        }
        return res;
      }, '스마트 주소 검색에 실패했습니다.'),
    [withLoading, setSearchResults]
  );

  const searchAddressesFromAPI = useCallback(
    async (
      input: ExternalAddressSearchInput
    ): Promise<ApiResponse<ExternalAddressSearchResult>> =>
      withLoading(async () => {
        const service = getAddressService();
        const res = await service.searchAddressesFromAPI(input);
        if (res.success && res.data) {
          setSearchResults(res.data.results.juso);
        }
        return res;
      }, '주소 검색에 실패했습니다.'),
    [withLoading, setSearchResults]
  );

  const searchUserAddresses = useCallback(
    async (
      input: SearchAddressInput
    ): Promise<ApiResponse<AddressSearchResult>> =>
      withLoading(async () => {
        const service = getAddressService();
        return service.searchUserAddresses(input);
      }, '사용자 주소 검색에 실패했습니다.'),
    [withLoading]
  );

  const getUserAddressById = useCallback(
    async (id: number): Promise<ApiResponse<Address>> =>
      withLoading(async () => {
        const service = getAddressService();
        return service.getUserAddressById(id);
      }, '주소 조회에 실패했습니다.'),
    [withLoading]
  );

  const getUserAddresses = useCallback(
    async (
      filter: FilterAddressInput
    ): Promise<ApiResponse<AddressSearchResult>> =>
      withLoading(async () => {
        const service = getAddressService();
        const res = await service.getUserAddresses(filter);
        if (res.success && res.data) {
          setSavedAddresses(res.data.addresses);
        }
        return res;
      }, '주소 목록 조회에 실패했습니다.'),
    [withLoading, setSavedAddresses]
  );

  const getUserAddressStats = useCallback(
    async (): Promise<ApiResponse<AddressStatsResult>> =>
      withLoading(async () => {
        const service = getAddressService();
        return service.getUserAddressStats();
      }, '주소 통계 조회에 실패했습니다.'),
    [withLoading]
  );

  const getUserSearchLogs = useCallback(
    async (
      filter: SearchAddressLogInput
    ): Promise<ApiResponse<PaginatedSearchLogResult>> =>
      withLoading(async () => {
        const service = getAddressService();
        return service.getUserSearchLogs(filter);
      }, '검색 로그 조회에 실패했습니다.'),
    [withLoading]
  );

  // ============================================================================
  // 주소 관리
  // ============================================================================

  const saveAddress = useCallback(
    async (input: SaveAddressInput): Promise<ApiResponse<Address>> =>
      withLoading(async () => {
        const service = getAddressService();
        const res = await service.saveAddress(input);
        if (res.success && res.data) {
          const listRes = await service.getUserAddresses({
            page: 1,
            limit: 20,
          });
          if (listRes.success && listRes.data) {
            setSavedAddresses(listRes.data.addresses);
          }
        }
        return res;
      }, '주소 저장에 실패했습니다.'),
    [withLoading, setSavedAddresses]
  );

  const updateAddress = useCallback(
    async (input: UpdateAddressInput): Promise<ApiResponse<Address>> =>
      withLoading(async () => {
        const service = getAddressService();
        const res = await service.updateAddress(input);
        if (res.success && res.data) {
          const listRes = await service.getUserAddresses({
            page: 1,
            limit: 20,
          });
          if (listRes.success && listRes.data) {
            setSavedAddresses(listRes.data.addresses);
          }
        }
        return res;
      }, '주소 수정에 실패했습니다.'),
    [withLoading, setSavedAddresses]
  );

  const removeAddress = useCallback(
    async (id: number): Promise<ApiResponse<boolean>> =>
      withLoading(async () => {
        const service = getAddressService();
        const res = await service.removeAddress(id);
        if (res.success) {
          const listRes = await service.getUserAddresses({
            page: 1,
            limit: 20,
          });
          if (listRes.success && listRes.data) {
            setSavedAddresses(listRes.data.addresses);
          }
        }
        return res;
      }, '주소 삭제에 실패했습니다.'),
    [withLoading, setSavedAddresses]
  );

  const bulkRemoveAddresses = useCallback(
    async (
      input: BulkRemoveAddressInput
    ): Promise<ApiResponse<BulkRemoveResult>> =>
      withLoading(async () => {
        const service = getAddressService();
        const res = await service.bulkRemoveAddresses(input);
        if (res.success) {
          const listRes = await service.getUserAddresses({
            page: 1,
            limit: 20,
          });
          if (listRes.success && listRes.data) {
            setSavedAddresses(listRes.data.addresses);
          }
        }
        return res;
      }, '주소 일괄 삭제에 실패했습니다.'),
    [withLoading, setSavedAddresses]
  );

  // ============================================================================
  // 팝업 URL
  // ============================================================================

  const createAddressPopupUrl = useCallback(
    async (
      input: CreateAddressPopupInput
    ): Promise<ApiResponse<AddressPopupUrlResult>> =>
      withLoading(async () => {
        const service = getAddressService();
        return service.createAddressPopupUrl(input);
      }, '팝업 URL 생성에 실패했습니다.'),
    [withLoading]
  );

  // ============================================================================
  // 어드민
  // ============================================================================

  const adminGetAllAddresses = useCallback(
    async (
      filter: AdminAddressFilterInput
    ): Promise<ApiResponse<AdminAddressListResult>> =>
      withLoading(async () => {
        const service = getAddressService();
        return service.adminGetAllAddresses(filter);
      }, '어드민 주소 목록 조회에 실패했습니다.'),
    [withLoading]
  );

  const adminGetSearchLogs = useCallback(
    async (
      filter: AdminSearchLogFilterInput
    ): Promise<ApiResponse<AdminSearchLogListResult>> =>
      withLoading(async () => {
        const service = getAddressService();
        return service.adminGetSearchLogs(filter);
      }, '어드민 검색 로그 조회에 실패했습니다.'),
    [withLoading]
  );

  const adminGetApiLogs = useCallback(
    async (
      filter: AdminApiLogFilterInput
    ): Promise<ApiResponse<AdminApiLogListResult>> =>
      withLoading(async () => {
        const service = getAddressService();
        return service.adminGetApiLogs(filter);
      }, '어드민 API 로그 조회에 실패했습니다.'),
    [withLoading]
  );

  const adminGetAddressStats = useCallback(
    async (): Promise<ApiResponse<AdminAddressStatsResult>> =>
      withLoading(async () => {
        const service = getAddressService();
        return service.adminGetAddressStats();
      }, '어드민 주소 통계 조회에 실패했습니다.'),
    [withLoading]
  );

  const adminUpdateAddressStatus = useCallback(
    async (
      input: AdminUpdateAddressStatusInput
    ): Promise<ApiResponse<Address>> =>
      withLoading(async () => {
        const service = getAddressService();
        return service.adminUpdateAddressStatus(input);
      }, '주소 상태 변경에 실패했습니다.'),
    [withLoading]
  );

  const adminBulkRemoveAddresses = useCallback(
    async (
      input: BulkRemoveAddressInput
    ): Promise<ApiResponse<BulkRemoveResult>> =>
      withLoading(async () => {
        const service = getAddressService();
        return service.adminBulkRemoveAddresses(input);
      }, '어드민 주소 일괄 삭제에 실패했습니다.'),
    [withLoading]
  );

  // ============================================================================
  // 유틸리티
  // ============================================================================

  const clearAddressCache = useCallback(() => {
    getAddressService().clearAddressCache();
  }, []);

  // ============================================================================
  // Return
  // ============================================================================

  return {
    ...context,

    // 주소 검색
    smartSearchAddresses,
    searchAddressesFromAPI,
    searchUserAddresses,
    getUserAddressById,
    getUserAddresses,
    getUserAddressStats,
    getUserSearchLogs,

    // 주소 관리
    saveAddress,
    updateAddress,
    removeAddress,
    bulkRemoveAddresses,

    // 팝업 URL
    createAddressPopupUrl,

    // 어드민
    adminGetAllAddresses,
    adminGetSearchLogs,
    adminGetApiLogs,
    adminGetAddressStats,
    adminUpdateAddressStatus,
    adminBulkRemoveAddresses,

    // 상태 직접 접근
    selectedAddress,
    savedAddresses,
    searchResults,

    // 유틸리티
    setSelectedAddress,
    clearAddressCache,
  };
};

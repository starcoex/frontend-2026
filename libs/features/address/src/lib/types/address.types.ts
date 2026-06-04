import type { ApiResponse } from '../types';

// ============================================================================
// 열거형
// ============================================================================

export type AddressSearchType = 'ROAD' | 'JIBUN' | 'ALL';
export type AddressResultType =
  | 'BASIC'
  | 'WITH_JIBUN'
  | 'WITH_BUILDING'
  | 'FULL_DETAIL';
export type UseDetailAddrType = 'YES' | 'NO';
export type AddressBuildingType = 'APARTMENT' | 'SINGLE_HOUSE';
export type AddressUndergroundType = 'GROUND' | 'UNDERGROUND';
export type AddressMountainType = 'LAND' | 'MOUNTAIN';
export type AddressStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'DELETED';
export type AddressDataSource =
  | 'JUSO_API'
  | 'MANUAL_INPUT'
  | 'IMPORT_EXCEL'
  | 'EXTERNAL_API';
export type SearchStrategyType =
  | 'REGION_SPECIFIC'
  | 'ADDRESS_WITH_NUMBER'
  | 'GENERAL_SEARCH'
  | 'USER_PREFERENCE';
export type AddressApiType = 'POPUP_URL' | 'SEARCH' | 'SAVE' | 'STATS';

// ============================================================================
// 엔티티
// ============================================================================

export interface JusoApiCommon {
  totalCount: string;
  currentPage: string;
  countPerPage: string;
  errorCode: string;
  errorMessage: string;
}

export interface JusoApiAddress {
  roadAddr: string;
  jibunAddr: string;
  zipNo: string;
  siNm?: string | null;
  sggNm?: string | null;
  emdNm?: string | null;
  rn?: string | null;
  buldMnnm?: string | null;
  buldSlno?: string | null;
  bdNm?: string | null;
  admCd?: string | null;
  bdMgtSn?: string | null;
  rnMgtSn?: string | null;
  engAddr?: string | null;
}

export interface JusoApiResults {
  common: JusoApiCommon;
  juso: JusoApiAddress[];
}

export interface Address {
  id: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  userId?: number | null;
  roadFullAddr: string;
  roadAddrPart1: string;
  roadAddrPart2?: string | null;
  jibunAddr: string;
  engAddr: string;
  zipNo: string;
  admCd: string;
  siNm: string;
  sggNm?: string | null;
  emdNm: string;
  liNm?: string | null;
  rn: string;
  rnMgtSn: string;
  bdMgtSn: string;
  bdNm?: string | null;
  buildingType: AddressBuildingType;
  detBdNmList?: string | null;
  undergroundType: AddressUndergroundType;
  buldMnnm: number;
  buldSlno: number;
  mountainType: AddressMountainType;
  lnbrMnnm: number;
  lnbrSlno: number;
  emdNo: string;
  addrDetail?: string | null;
  status: AddressStatus;
  dataSource: AddressDataSource;
  usageCount: number;
  lastUsedAt: string;
}

export interface AddressSearchLog {
  id: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  keyword: string;
  searchType: AddressSearchType;
  resultType: AddressResultType;
  useDetailAddr: UseDetailAddrType;
  resultCount: number;
  executionTime: number;
  page: number;
  limit: number;
  userIp?: string | null;
  userAgent?: string | null;
  sessionId?: string | null;
  userId?: number | null;
  selectedAddressId?: number | null;
}

export interface SearchStrategy {
  type: SearchStrategyType;
  region?: string | null;
  district?: string | null;
  keyword: string;
  priority: number;
}

export interface ExternalAddressResult {
  zipNo: string;
  siNm: string;
  sggNm: string;
  emdNm?: string | null;
  roadAddr: string;
  jibunAddr?: string | null;
  rn?: string | null;
  bdNm?: string | null;
  buldMnnm?: string | null;
  buldSlno?: string | null;
}

export interface GroupedSearchResult {
  region: string;
  count: number;
  addresses: ExternalAddressResult[];
}

export interface AdminApiLogItem {
  id: number;
  apiType: string;
  endpoint: string;
  success: boolean;
  statusCode: number;
  executionTime: number;
  errorCode?: string | null;
  errorMessage?: string | null;
  userIp?: string | null;
  userId?: number | null;
  createdAt: string;
}

// ============================================================================
// Input 타입
// ============================================================================

export interface SmartSearchInput {
  keyword: string;
  currentPage?: number;
  countPerPage?: number;
  userId?: number;
  region?: string;
  district?: string;
  userLatitude?: number;
  userLongitude?: number;
}

export interface ExternalAddressSearchInput {
  keyword: string;
  currentPage?: number;
  countPerPage?: number;
}

export interface SearchAddressInput {
  keyword: string;
  type?: AddressSearchType;
  page?: number;
  limit?: number;
}

export interface FilterAddressInput {
  zipNo?: string;
  siNm?: string;
  sggNm?: string;
  emdNm?: string;
  buildingType?: AddressBuildingType;
  status?: AddressStatus;
  dataSource?: AddressDataSource;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

export interface SearchAddressLogInput {
  keyword?: string;
  searchType?: AddressSearchType;
  resultType?: AddressResultType;
  userIp?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface SaveAddressInput {
  roadFullAddr: string;
  roadAddrPart1: string;
  roadAddrPart2?: string;
  jibunAddr: string;
  engAddr: string;
  zipNo: string;
  admCd: string;
  siNm: string;
  sggNm?: string;
  emdNm: string;
  liNm?: string;
  rn: string;
  rnMgtSn: string;
  bdMgtSn: string;
  bdNm?: string;
  buildingType?: AddressBuildingType;
  detBdNmList?: string;
  undergroundType?: AddressUndergroundType;
  buldMnnm: number;
  buldSlno: number;
  mountainType?: AddressMountainType;
  lnbrMnnm: number;
  lnbrSlno: number;
  emdNo: string;
  addrDetail?: string;
  status?: AddressStatus;
  dataSource?: AddressDataSource;
}

export interface UpdateAddressInput {
  id: number;
  roadFullAddr?: string;
  roadAddrPart1?: string;
  roadAddrPart2?: string;
  jibunAddr?: string;
  engAddr?: string;
  zipNo?: string;
  admCd?: string;
  siNm?: string;
  sggNm?: string;
  emdNm?: string;
  liNm?: string;
  rn?: string;
  rnMgtSn?: string;
  bdMgtSn?: string;
  bdNm?: string;
  buildingType?: AddressBuildingType;
  detBdNmList?: string;
  undergroundType?: AddressUndergroundType;
  buldMnnm?: number;
  buldSlno?: number;
  mountainType?: AddressMountainType;
  lnbrMnnm?: number;
  lnbrSlno?: number;
  emdNo?: string;
  addrDetail?: string;
  status?: AddressStatus;
  dataSource?: AddressDataSource;
  usageCount?: number;
}

export interface BulkRemoveAddressInput {
  ids: number[];
}

export interface CreateAddressPopupInput {
  returnUrl: string;
  resultType?: AddressResultType;
  useDetailAddr?: UseDetailAddrType;
}

export interface AdminAddressFilterInput {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: AddressStatus;
  dataSource?: AddressDataSource;
  buildingType?: AddressBuildingType;
  siNm?: string;
  sggNm?: string;
  userId?: number;
  zipNo?: string;
  startDate?: string;
  endDate?: string;
}

export interface AdminSearchLogFilterInput {
  page?: number;
  limit?: number;
  keyword?: string;
  userId?: number;
  userIp?: string;
  startDate?: string;
  endDate?: string;
}

export interface AdminApiLogFilterInput {
  page?: number;
  limit?: number;
  success?: boolean;
  errorCode?: string;
  minExecutionTime?: number;
  startDate?: string;
  endDate?: string;
}

export interface AdminUpdateAddressStatusInput {
  id: number;
  status: AddressStatus;
}

// ============================================================================
// Output 타입
// ============================================================================

export interface SmartSearchResult {
  results: JusoApiResults;
  searchKeyword: string;
  searchTime: string;
  searchedAt: string;
  strategy: SearchStrategy;
  suggestions: string[];
  groupedResults?: GroupedSearchResult[] | null;
  isFiltered: boolean;
  recommendedRegions: string[];
}

export interface ExternalAddressSearchResult {
  results: JusoApiResults;
  searchKeyword: string;
  searchTime: string;
  searchedAt: string;
}

export interface AddressSearchResult {
  addresses: Address[];
  total: number;
  page: number;
  totalPages: number;
  keyword: string;
  searchType: AddressSearchType;
  searchTime: string;
  searchLog?: AddressSearchLog | null;
}

export interface AddressStatsResult {
  totalAddresses: number;
  activeAddresses: number;
  frequentAddresses: number;
  topRegions: string[];
  totalSearches: number;
  recentSearches: AddressSearchLog[];
  generatedAt: string;
}

export interface PaginatedSearchLogResult {
  data: AddressSearchLog[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface AddressPopupUrlResult {
  popupUrl: string;
  success: boolean;
  message?: string | null;
  resultTypeDescription: string;
}

export interface BulkRemoveResult {
  deletedCount: number;
  failedIds: number[];
  success: boolean;
}

export interface AdminAddressListResult {
  addresses: Address[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminSearchLogListResult {
  data: AddressSearchLog[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminApiLogListResult {
  data: AdminApiLogItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminAddressStatsResult {
  totalAddresses: number;
  activeAddresses: number;
  inactiveAddresses: number;
  deletedAddresses: number;
  totalSearchLogs: number;
  totalApiLogs: number;
  successApiLogs: number;
  failedApiLogs: number;
  topSearchKeywords: string[];
  topRegions: string[];
  generatedAt: string;
}

// ============================================================================
// 서비스 인터페이스
// ============================================================================

export interface IAddressService {
  // 주소 검색
  smartSearchAddresses(
    input: SmartSearchInput
  ): Promise<ApiResponse<SmartSearchResult>>;
  searchAddressesFromAPI(
    input: ExternalAddressSearchInput
  ): Promise<ApiResponse<ExternalAddressSearchResult>>;
  searchUserAddresses(
    input: SearchAddressInput
  ): Promise<ApiResponse<AddressSearchResult>>;
  getUserAddressById(id: number): Promise<ApiResponse<Address>>;
  getUserAddresses(
    filter: FilterAddressInput
  ): Promise<ApiResponse<AddressSearchResult>>;
  getUserAddressStats(): Promise<ApiResponse<AddressStatsResult>>;
  getUserSearchLogs(
    filter: SearchAddressLogInput
  ): Promise<ApiResponse<PaginatedSearchLogResult>>;

  // 주소 관리
  saveAddress(input: SaveAddressInput): Promise<ApiResponse<Address>>;
  updateAddress(input: UpdateAddressInput): Promise<ApiResponse<Address>>;
  removeAddress(id: number): Promise<ApiResponse<boolean>>;
  bulkRemoveAddresses(
    input: BulkRemoveAddressInput
  ): Promise<ApiResponse<BulkRemoveResult>>;

  // 팝업 URL 생성
  createAddressPopupUrl(
    input: CreateAddressPopupInput
  ): Promise<ApiResponse<AddressPopupUrlResult>>;

  // 어드민
  adminGetAllAddresses(
    filter: AdminAddressFilterInput
  ): Promise<ApiResponse<AdminAddressListResult>>;
  adminGetSearchLogs(
    filter: AdminSearchLogFilterInput
  ): Promise<ApiResponse<AdminSearchLogListResult>>;
  adminGetApiLogs(
    filter: AdminApiLogFilterInput
  ): Promise<ApiResponse<AdminApiLogListResult>>;
  adminGetAddressStats(): Promise<ApiResponse<AdminAddressStatsResult>>;
  adminUpdateAddressStatus(
    input: AdminUpdateAddressStatusInput
  ): Promise<ApiResponse<Address>>;
  adminBulkRemoveAddresses(
    input: BulkRemoveAddressInput
  ): Promise<ApiResponse<BulkRemoveResult>>;

  // 유틸리티
  clearAddressCache(): void;
}

// ============================================================================
// Context 상태 타입
// ============================================================================

export interface AddressState {
  selectedAddress: JusoApiAddress | null;
  savedAddresses: Address[];
  searchResults: JusoApiAddress[];
  isLoading: boolean;
  error: string | null;
}

export interface AddressContextActions {
  setSelectedAddress: (address: JusoApiAddress | null) => void;
  setSavedAddresses: (addresses: Address[]) => void;
  setSearchResults: (results: JusoApiAddress[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearSearchResults: () => void;
  clearSelectedAddress: () => void;
  reset: () => void;
}

export type AddressContextValue = AddressState & AddressContextActions;

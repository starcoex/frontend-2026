import { gql } from '@apollo/client';

// ============================================================================
// Fragments
// ============================================================================

export const JUSO_API_COMMON_FIELDS = gql`
  fragment JusoApiCommonFields on JusoApiCommon {
    totalCount
    currentPage
    countPerPage
    errorCode
    errorMessage
  }
`;

export const JUSO_API_ADDRESS_FIELDS = gql`
  fragment JusoApiAddressFields on JusoApiAddress {
    roadAddr
    jibunAddr
    zipNo
    siNm
    sggNm
    emdNm
    rn
    buldMnnm
    buldSlno
    bdNm
    admCd
    bdMgtSn
    rnMgtSn
    engAddr
  }
`;

export const JUSO_API_RESULTS_FIELDS = gql`
  ${JUSO_API_COMMON_FIELDS}
  ${JUSO_API_ADDRESS_FIELDS}
  fragment JusoApiResultsFields on JusoApiResults {
    common {
      ...JusoApiCommonFields
    }
    juso {
      ...JusoApiAddressFields
    }
  }
`;

export const SEARCH_STRATEGY_FIELDS = gql`
  fragment SearchStrategyFields on SearchStrategy {
    type
    region
    district
    keyword
    priority
  }
`;

export const EXTERNAL_ADDRESS_RESULT_FIELDS = gql`
  fragment ExternalAddressResultFields on ExternalAddressResult {
    zipNo
    siNm
    sggNm
    emdNm
    roadAddr
    jibunAddr
    rn
    bdNm
    buldMnnm
    buldSlno
  }
`;

export const GROUPED_SEARCH_RESULT_FIELDS = gql`
  ${EXTERNAL_ADDRESS_RESULT_FIELDS}
  fragment GroupedSearchResultFields on GroupedSearchResult {
    region
    count
    addresses {
      ...ExternalAddressResultFields
    }
  }
`;

export const ADDRESS_FIELDS = gql`
  fragment AddressFields on Address {
    id
    deletedAt
    createdAt
    updatedAt
    userId
    roadFullAddr
    roadAddrPart1
    roadAddrPart2
    jibunAddr
    engAddr
    zipNo
    admCd
    siNm
    sggNm
    emdNm
    liNm
    rn
    rnMgtSn
    bdMgtSn
    bdNm
    buildingType
    detBdNmList
    undergroundType
    buldMnnm
    buldSlno
    mountainType
    lnbrMnnm
    lnbrSlno
    emdNo
    addrDetail
    status
    dataSource
    usageCount
    lastUsedAt
  }
`;

export const ADDRESS_SEARCH_LOG_FIELDS = gql`
  fragment AddressSearchLogFields on AddressSearchLog {
    id
    deletedAt
    createdAt
    updatedAt
    keyword
    searchType
    resultType
    useDetailAddr
    resultCount
    executionTime
    page
    limit
    userIp
    userAgent
    sessionId
    userId
    selectedAddressId
  }
`;

// ============================================================================
// Queries
// ============================================================================

export const SMART_SEARCH_ADDRESSES = gql`
  ${JUSO_API_RESULTS_FIELDS}
  ${SEARCH_STRATEGY_FIELDS}
  ${GROUPED_SEARCH_RESULT_FIELDS}
  query SmartSearchAddresses($input: SmartSearchInput!) {
    smartSearchAddresses(input: $input) {
      results {
        ...JusoApiResultsFields
      }
      searchKeyword
      searchTime
      searchedAt
      strategy {
        ...SearchStrategyFields
      }
      suggestions
      groupedResults {
        ...GroupedSearchResultFields
      }
      isFiltered
      recommendedRegions
    }
  }
`;

export const SEARCH_ADDRESSES_FROM_API = gql`
  ${JUSO_API_RESULTS_FIELDS}
  query SearchAddressesFromAPI($input: ExternalAddressSearchInput!) {
    searchAddressesFromAPI(input: $input) {
      results {
        ...JusoApiResultsFields
      }
      searchKeyword
      searchTime
      searchedAt
    }
  }
`;

export const SEARCH_USER_ADDRESSES = gql`
  ${ADDRESS_FIELDS}
  ${ADDRESS_SEARCH_LOG_FIELDS}
  query SearchUserAddresses($input: SearchAddressInput!) {
    searchUserAddresses(input: $input) {
      addresses {
        ...AddressFields
      }
      total
      page
      totalPages
      keyword
      searchType
      searchTime
      searchLog {
        ...AddressSearchLogFields
      }
    }
  }
`;

export const GET_USER_ADDRESS_BY_ID = gql`
  ${ADDRESS_FIELDS}
  query GetUserAddressById($id: Int!) {
    getUserAddressById(id: $id) {
      ...AddressFields
    }
  }
`;

export const GET_USER_ADDRESSES = gql`
  ${ADDRESS_FIELDS}
  ${ADDRESS_SEARCH_LOG_FIELDS}
  query GetUserAddresses($filter: FilterAddressInput!) {
    getUserAddresses(filter: $filter) {
      addresses {
        ...AddressFields
      }
      total
      page
      totalPages
      keyword
      searchType
      searchTime
      searchLog {
        ...AddressSearchLogFields
      }
    }
  }
`;

export const GET_USER_ADDRESS_STATS = gql`
  ${ADDRESS_SEARCH_LOG_FIELDS}
  query GetUserAddressStats {
    getUserAddressStats {
      totalAddresses
      activeAddresses
      frequentAddresses
      topRegions
      totalSearches
      recentSearches {
        ...AddressSearchLogFields
      }
      generatedAt
    }
  }
`;

export const GET_USER_SEARCH_LOGS = gql`
  ${ADDRESS_SEARCH_LOG_FIELDS}
  query GetUserSearchLogs($filter: SearchAddressLogInput!) {
    getUserSearchLogs(filter: $filter) {
      data {
        ...AddressSearchLogFields
      }
      total
      page
      totalPages
      limit
    }
  }
`;

// ============================================================================
// Admin Queries
// ============================================================================

export const ADMIN_GET_ALL_ADDRESSES = gql`
  ${ADDRESS_FIELDS}
  query AdminGetAllAddresses($filter: AdminAddressFilterInput!) {
    adminGetAllAddresses(filter: $filter) {
      addresses {
        ...AddressFields
      }
      total
      page
      totalPages
    }
  }
`;

export const ADMIN_GET_SEARCH_LOGS = gql`
  ${ADDRESS_SEARCH_LOG_FIELDS}
  query AdminGetSearchLogs($filter: AdminSearchLogFilterInput!) {
    adminGetSearchLogs(filter: $filter) {
      data {
        ...AddressSearchLogFields
      }
      total
      page
      totalPages
    }
  }
`;

export const ADMIN_GET_API_LOGS = gql`
  query AdminGetApiLogs($filter: AdminApiLogFilterInput!) {
    adminGetApiLogs(filter: $filter) {
      data {
        id
        apiType
        endpoint
        success
        statusCode
        executionTime
        errorCode
        errorMessage
        userIp
        userId
        createdAt
      }
      total
      page
      totalPages
    }
  }
`;

export const ADMIN_GET_ADDRESS_STATS = gql`
  query AdminGetAddressStats {
    adminGetAddressStats {
      totalAddresses
      activeAddresses
      inactiveAddresses
      deletedAddresses
      totalSearchLogs
      totalApiLogs
      successApiLogs
      failedApiLogs
      topSearchKeywords
      topRegions
      generatedAt
    }
  }
`;

// ============================================================================
// Mutations
// ============================================================================

export const SAVE_ADDRESS = gql`
  ${ADDRESS_FIELDS}
  mutation SaveAddress($input: SaveAddressInput!) {
    saveAddress(input: $input) {
      ...AddressFields
    }
  }
`;

export const UPDATE_ADDRESS = gql`
  ${ADDRESS_FIELDS}
  mutation UpdateAddress($input: UpdateAddressInput!) {
    updateAddress(input: $input) {
      ...AddressFields
    }
  }
`;

export const REMOVE_ADDRESS = gql`
  mutation RemoveAddress($id: Int!) {
    removeAddress(id: $id)
  }
`;

export const BULK_REMOVE_ADDRESSES = gql`
  mutation BulkRemoveAddresses($input: BulkRemoveAddressInput!) {
    bulkRemoveAddresses(input: $input) {
      deletedCount
      failedIds
      success
    }
  }
`;

export const CREATE_ADDRESS_POPUP_URL = gql`
  mutation CreateAddressPopupUrl($input: CreateAddressPopupInput!) {
    createAddressPopupUrl(input: $input) {
      popupUrl
      success
      message
      resultTypeDescription
    }
  }
`;

// ============================================================================
// Admin Mutations
// ============================================================================

export const ADMIN_UPDATE_ADDRESS_STATUS = gql`
  ${ADDRESS_FIELDS}
  mutation AdminUpdateAddressStatus($input: AdminUpdateAddressStatusInput!) {
    adminUpdateAddressStatus(input: $input) {
      ...AddressFields
    }
  }
`;

export const ADMIN_BULK_REMOVE_ADDRESSES = gql`
  mutation AdminBulkRemoveAddresses($input: BulkRemoveAddressInput!) {
    adminBulkRemoveAddresses(input: $input) {
      deletedCount
      failedIds
      success
    }
  }
`;

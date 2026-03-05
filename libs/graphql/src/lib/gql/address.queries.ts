import { gql } from '@apollo/client';

// ============================================================================
// Fragments
// ============================================================================

/**
 * Juso API 공통 응답 정보
 */
export const JUSO_API_COMMON_FIELDS = gql`
  fragment JusoApiCommonFields on JusoApiCommon {
    totalCount
    currentPage
    countPerPage
    errorCode
    errorMessage
  }
`;

/**
 * Juso API 주소 정보
 */
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

/**
 * Juso API 응답 결과
 */
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

/**
 * 검색 전략 정보
 */
export const SEARCH_STRATEGY_FIELDS = gql`
  fragment SearchStrategyFields on SearchStrategy {
    type
    region
    district
    keyword
    priority
  }
`;

/**
 * 외부 API 주소 결과
 */
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

/**
 * 지역별 그루핑 결과
 */
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

/**
 * 주소 정보 엔티티 (전체 필드)
 */
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

/**
 * 주소 검색 로그
 */
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

/**
 * 스마트 주소 검색 (AI 최적화, 추천)
 */
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

/**
 * 외부 API 직접 검색 (도로명주소 API)
 */
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

/**
 * 사용자의 저장된 주소 검색 (내부 DB)
 */
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

/**
 * ID로 특정 주소 조회
 */
export const GET_USER_ADDRESS_BY_ID = gql`
  ${ADDRESS_FIELDS}
  query GetUserAddressById($id: Int!) {
    getUserAddressById(id: $id) {
      ...AddressFields
    }
  }
`;

/**
 * 사용자의 모든 주소 조회 (필터링 및 페이징)
 */
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

/**
 * 사용자별 주소 통계
 */
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

/**
 * 사용자의 주소 검색 로그 조회
 */
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
// Mutations
// ============================================================================

/**
 * 주소 저장 (도로명주소 API 데이터)
 */
export const SAVE_ADDRESS = gql`
  ${ADDRESS_FIELDS}
  mutation SaveAddress($input: SaveAddressInput!) {
    saveAddress(input: $input) {
      ...AddressFields
    }
  }
`;

/**
 * 주소 정보 수정
 */
export const UPDATE_ADDRESS = gql`
  ${ADDRESS_FIELDS}
  mutation UpdateAddress($input: UpdateAddressInput!) {
    updateAddress(input: $input) {
      ...AddressFields
    }
  }
`;

/**
 * 주소 삭제 (소프트 삭제)
 */
export const REMOVE_ADDRESS = gql`
  mutation RemoveAddress($id: Int!) {
    removeAddress(id: $id)
  }
`;

/**
 * 도로명주소 팝업 URL 생성
 */
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

import { gql } from '@apollo/client';

// ============================================================================
// Fragments
// ============================================================================

export const ADDRESS_COMMON_FIELDS = gql`
  fragment AddressCommonFields on JusoApiCommon {
    totalCount
    currentPage
    countPerPage
    errorCode
    errorMessage
  }
`;

export const ADDRESS_JUSO_FIELDS = gql`
  fragment AddressJusoFields on JusoApiAddress {
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
  }
`;

export const ADDRESS_RESULTS_FIELDS = gql`
  ${ADDRESS_COMMON_FIELDS}
  ${ADDRESS_JUSO_FIELDS}
  fragment AddressResultsFields on JusoApiResults {
    common {
      ...AddressCommonFields
    }
    juso {
      ...AddressJusoFields
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

export const GROUPED_SEARCH_RESULT_FIELDS = gql`
  fragment GroupedSearchResultFields on GroupedSearchResult {
    region
    count
    addresses {
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
  }
`;

export const ADDRESS_FIELDS = gql`
  fragment AddressFields on Address {
    id
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
    createdAt
    updatedAt
    deletedAt
  }
`;

// ============================================================================
// Queries
// ============================================================================

/**
 * 스마트 주소 검색 (추천)
 * 사용자 맞춤형 검색 결과 제공
 */
export const SMART_SEARCH_ADDRESSES = gql`
  ${ADDRESS_RESULTS_FIELDS}
  ${SEARCH_STRATEGY_FIELDS}
  ${GROUPED_SEARCH_RESULT_FIELDS}
  query SmartSearchAddresses($input: SmartSearchInput!) {
    smartSearchAddresses(input: $input) {
      results {
        ...AddressResultsFields
      }
      strategy {
        ...SearchStrategyFields
      }
      suggestions
      groupedResults {
        ...GroupedSearchResultFields
      }
      isFiltered
      recommendedRegions
      searchKeyword
      searchTime
      searchedAt
    }
  }
`;

/**
 * 외부 API 직접 검색
 */
export const SEARCH_ADDRESSES_FROM_API = gql`
  ${ADDRESS_RESULTS_FIELDS}
  query SearchAddressesFromAPI($input: ExternalAddressSearchInput!) {
    searchAddressesFromAPI(input: $input) {
      results {
        ...AddressResultsFields
      }
      searchKeyword
      searchTime
      searchedAt
    }
  }
`;

/**
 * 사용자의 저장된 주소 검색
 */
export const SEARCH_USER_ADDRESSES = gql`
  ${ADDRESS_FIELDS}
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
    }
  }
`;

/**
 * 사용자별 주소 통계
 */
export const GET_USER_ADDRESS_STATS = gql`
  query GetUserAddressStats {
    getUserAddressStats {
      totalAddresses
      activeAddresses
      frequentAddresses
      topRegions
      totalSearches
      generatedAt
    }
  }
`;

// ============================================================================
// Mutations
// ============================================================================

/**
 * 주소 저장 (인증 필요)
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

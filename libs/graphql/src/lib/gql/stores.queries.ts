import { gql } from '@apollo/client';
import { ERROR_INFO_FIELDS } from './auth.queries.js';

// ============================================================================
// Fragments
// ============================================================================

/**
 * Brand Fragment (최소 필드, stores 제외)
 */
export const BRAND_FIELDS = gql`
  fragment BrandFields on Brand {
    id
    deletedAt
    createdAt
    updatedAt
    name
    slug
    description
    logoUrl
    brandColor
    metadata
    isActive
    createdById
    updatedById
  }
`;

/**
 * Store Fragment (Address Service 연동)
 */
export const STORE_FIELDS = gql`
  ${BRAND_FIELDS}
  fragment StoreFields on Store {
    id
    deletedAt
    createdAt
    updatedAt
    name
    slug
    brandId
    addressId
    address
    addressSnapshot
    latitude
    longitude
    location
    phone
    email
    businessHours
    services
    deliverySettings
    pickupEnabled
    isActive
    isVisible
    orderCount
    rating
    createdById
    updatedById
    brand {
      ...BrandFields
    }
  }
`;

/**
 * 현재 통계 Fragment
 */
export const CURRENT_STATS_FIELDS = gql`
  fragment CurrentStatsFields on CurrentStats {
    totalStores
    activeStores
    inactiveStores
    hiddenStores
  }
`;

/**
 * 이전 통계 Fragment
 */
export const PREVIOUS_STATS_FIELDS = gql`
  fragment PreviousStatsFields on PreviousStats {
    totalStores
    activeStores
    inactiveStores
    hiddenStores
  }
`;

/**
 * 증가율 Fragment
 */
export const GROWTH_RATE_FIELDS = gql`
  fragment GrowthRateFields on GrowthRate {
    totalStores
    activeStores
    inactiveStores
    hiddenStores
  }
`;

/**
 * 매장 통계 Fragment
 */
export const STORE_STATS_FIELDS = gql`
  ${CURRENT_STATS_FIELDS}
  ${PREVIOUS_STATS_FIELDS}
  ${GROWTH_RATE_FIELDS}
  fragment StoreStatsFields on StoreStatsOutput {
    current {
      ...CurrentStatsFields
    }
    previous {
      ...PreviousStatsFields
    }
    growthRate {
      ...GrowthRateFields
    }
    generatedAt
    comparisonPeriod
  }
`;

/**
 * CreateStoreOutput Fragment
 */
export const CREATE_STORE_OUTPUT_FIELDS = gql`
  ${ERROR_INFO_FIELDS}
  ${STORE_FIELDS}
  fragment CreateStoreOutputFields on CreateStoreOutput {
    success
    creationMessage
    notificationMessage
    store {
      ...StoreFields
    }
    error {
      ...ErrorInfoFields
    }
  }
`;

/**
 * UpdateStoreOutput Fragment
 */
export const UPDATE_STORE_OUTPUT_FIELDS = gql`
  ${ERROR_INFO_FIELDS}
  ${STORE_FIELDS}
  fragment UpdateStoreOutputFields on UpdateStoreOutput {
    success
    creationMessage
    notificationMessage
    store {
      ...StoreFields
    }
    error {
      ...ErrorInfoFields
    }
  }
`;

/**
 * DeleteStoreOutput Fragment
 */
export const DELETE_STORE_OUTPUT_FIELDS = gql`
  ${ERROR_INFO_FIELDS}
  fragment DeleteStoreOutputFields on DeleteStoreOutput {
    success
    storeId
    message
    error {
      ...ErrorInfoFields
    }
  }
`;

/**
 * CreateBrandOutput Fragment
 */
export const CREATE_BRAND_OUTPUT_FIELDS = gql`
  ${ERROR_INFO_FIELDS}
  ${BRAND_FIELDS}
  fragment CreateBrandOutputFields on CreateBrandOutput {
    success
    creationMessage
    notificationMessage
    brand {
      ...BrandFields
    }
    error {
      ...ErrorInfoFields
    }
  }
`;

/**
 * UpdateBrandOutput Fragment
 */
export const UPDATE_BRAND_OUTPUT_FIELDS = gql`
  ${ERROR_INFO_FIELDS}
  ${BRAND_FIELDS}
  fragment UpdateBrandOutputFields on UpdateBrandOutput {
    success
    creationMessage
    notificationMessage
    brand {
      ...BrandFields
    }
    error {
      ...ErrorInfoFields
    }
  }
`;

/**
 * DeleteBrandOutput Fragment
 */
export const DELETE_BRAND_OUTPUT_FIELDS = gql`
  ${ERROR_INFO_FIELDS}
  fragment DeleteBrandOutputFields on DeleteBrandOutput {
    success
    brandId
    message
    error {
      ...ErrorInfoFields
    }
  }
`;

// ============================================================================
// Queries
// ============================================================================

/**
 * 매장 통계 조회 (증가율 포함)
 */
export const GET_STORE_STATISTICS = gql`
  ${STORE_STATS_FIELDS}
  query GetStoreStatistics {
    getStoreStatistics {
      ...StoreStatsFields
    }
  }
`;

/**
 * 전체 매장 목록 조회
 */
export const LIST_STORES = gql`
  ${STORE_FIELDS}
  query ListStores {
    listStores {
      ...StoreFields
    }
  }
`;

/**
 * ID로 특정 매장 조회
 */
export const GET_STORE_BY_ID = gql`
  ${STORE_FIELDS}
  query GetStoreById($id: Int!) {
    getStoreById(id: $id) {
      ...StoreFields
    }
  }
`;

/**
 * 전체 브랜드 목록 조회
 */
export const LIST_BRANDS = gql`
  ${BRAND_FIELDS}
  query ListBrands {
    listBrands {
      ...BrandFields
    }
  }
`;

/**
 * ID로 특정 브랜드 조회
 */
export const GET_BRAND_BY_ID = gql`
  ${BRAND_FIELDS}
  query GetBrandById($id: Int!) {
    getBrandById(id: $id) {
      ...BrandFields
    }
  }
`;

// ============================================================================
// Mutations
// ============================================================================

/**
 * 매장 생성 (Address Service 연동)
 */
export const CREATE_STORE = gql`
  ${CREATE_STORE_OUTPUT_FIELDS}
  mutation CreateStore($input: CreateStoreInput!) {
    createStore(input: $input) {
      ...CreateStoreOutputFields
    }
  }
`;

/**
 * 매장 정보 수정
 */
export const UPDATE_STORE = gql`
  ${UPDATE_STORE_OUTPUT_FIELDS}
  mutation UpdateStore($input: UpdateStoreInput!) {
    updateStore(input: $input) {
      ...UpdateStoreOutputFields
    }
  }
`;

/**
 * 매장 삭제 (소프트 삭제)
 */
export const DELETE_STORE = gql`
  ${DELETE_STORE_OUTPUT_FIELDS}
  mutation DeleteStore($input: DeleteStoreInput!) {
    deleteStore(input: $input) {
      ...DeleteStoreOutputFields
    }
  }
`;

/**
 * 브랜드 생성
 */
export const CREATE_BRAND = gql`
  ${CREATE_BRAND_OUTPUT_FIELDS}
  mutation CreateBrand($input: CreateBrandInput!) {
    createBrand(input: $input) {
      ...CreateBrandOutputFields
    }
  }
`;

/**
 * 브랜드 정보 수정
 */
export const UPDATE_BRAND = gql`
  ${UPDATE_BRAND_OUTPUT_FIELDS}
  mutation UpdateBrand($input: UpdateBrandInput!) {
    updateBrand(input: $input) {
      ...UpdateBrandOutputFields
    }
  }
`;

/**
 * 브랜드 삭제 (소프트 삭제)
 */
export const DELETE_BRAND = gql`
  ${DELETE_BRAND_OUTPUT_FIELDS}
  mutation DeleteBrand($input: DeleteBrandInput!) {
    deleteBrand(input: $input) {
      ...DeleteBrandOutputFields
    }
  }
`;

import { gql } from '@apollo/client';
import { ERROR_INFO_FIELDS } from './auth.queries.js';

// ============================================================================
// Fragments
// ============================================================================

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
    businessTypes {
      brandId
      businessTypeId
      businessType {
        id
        code
        name
        description
        isActive
        sortOrder
        allowedServices {
          id
          code
          name
          description
          isActive
          sortOrder
        }
      }
    }
  }
`;

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
    businessTypeId
    addressId
    address
    addressSnapshot
    latitude
    longitude
    location
    phone
    email
    businessHours
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
    businessType {
      id
      code
      name
      description
      isActive
      sortOrder
      allowedServices {
        id
        code
        name
        description
        isActive
        sortOrder
      }
    }
    storeServices {
      id
      deletedAt
      createdAt
      updatedAt
      storeId
      serviceTypeId
      isActive
      isAvailable
      settings
      serviceType {
        id
        code
        name
        description
        isActive
        sortOrder
      }
    }
    storeManagers {
      id
      storeId
      userId
      role
      isActive
      assignedAt
    }
  }
`;

export const CURRENT_STATS_FIELDS = gql`
  fragment CurrentStatsFields on CurrentStats {
    totalStores
    activeStores
    inactiveStores
    hiddenStores
  }
`;

export const PREVIOUS_STATS_FIELDS = gql`
  fragment PreviousStatsFields on PreviousStats {
    totalStores
    activeStores
    inactiveStores
    hiddenStores
  }
`;

export const GROWTH_RATE_FIELDS = gql`
  fragment GrowthRateFields on GrowthRate {
    totalStores
    activeStores
    inactiveStores
    hiddenStores
  }
`;

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

export const ADD_STORE_SERVICE_OUTPUT_FIELDS = gql`
  ${ERROR_INFO_FIELDS}
  fragment AddStoreServiceOutputFields on AddStoreServiceOutput {
    success
    message
    error {
      ...ErrorInfoFields
    }
  }
`;

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

export const GET_STORE_STATISTICS = gql`
  ${STORE_STATS_FIELDS}
  query GetStoreStatistics {
    getStoreStatistics {
      ...StoreStatsFields
    }
  }
`;

export const LIST_STORES = gql`
  ${STORE_FIELDS}
  query ListStores {
    listStores {
      ...StoreFields
    }
  }
`;

export const GET_STORE_BY_ID = gql`
  ${STORE_FIELDS}
  query GetStoreById($id: Int!) {
    getStoreById(id: $id) {
      ...StoreFields
    }
  }
`;

export const LIST_BRANDS = gql`
  ${BRAND_FIELDS}
  query ListBrands {
    listBrands {
      ...BrandFields
    }
  }
`;

export const GET_BRAND_BY_ID = gql`
  ${BRAND_FIELDS}
  query GetBrandById($id: Int!) {
    getBrandById(id: $id) {
      ...BrandFields
    }
  }
`;

// ✅ 신규 — 서비스 타입 마스터 목록
export const LIST_SERVICE_TYPES = gql`
  query ListServiceTypes {
    listServiceTypes {
      id
      code
      name
      description
      isActive
      sortOrder
    }
  }
`;

// ✅ 신규 — 비즈니스 타입 마스터 목록
export const LIST_BUSINESS_TYPES = gql`
  query ListBusinessTypes {
    listBusinessTypes {
      id
      code
      name
      description
      isActive
      sortOrder
      allowedServices {
        id
        code
        name
        description
        isActive
        sortOrder
      }
    }
  }
`;

// ============================================================================
// Mutations
// ============================================================================

export const CREATE_STORE = gql`
  ${CREATE_STORE_OUTPUT_FIELDS}
  mutation CreateStore($input: CreateStoreInput!) {
    createStore(input: $input) {
      ...CreateStoreOutputFields
    }
  }
`;

export const UPDATE_STORE = gql`
  ${UPDATE_STORE_OUTPUT_FIELDS}
  mutation UpdateStore($input: UpdateStoreInput!) {
    updateStore(input: $input) {
      ...UpdateStoreOutputFields
    }
  }
`;

export const DELETE_STORE = gql`
  ${DELETE_STORE_OUTPUT_FIELDS}
  mutation DeleteStore($input: DeleteStoreInput!) {
    deleteStore(input: $input) {
      ...DeleteStoreOutputFields
    }
  }
`;

export const DELETE_STORES = gql`
  mutation DeleteStores($ids: [Int!]!) {
    deleteStores(ids: $ids)
  }
`;

// ✅ 신규 — StoreService 관리
export const ADD_STORE_SERVICE = gql`
  ${ADD_STORE_SERVICE_OUTPUT_FIELDS}
  mutation AddStoreService($input: AddStoreServiceInput!) {
    addStoreService(input: $input) {
      ...AddStoreServiceOutputFields
    }
  }
`;

export const REMOVE_STORE_SERVICE = gql`
  ${ADD_STORE_SERVICE_OUTPUT_FIELDS}
  mutation RemoveStoreService($input: RemoveStoreServiceInput!) {
    removeStoreService(input: $input) {
      ...AddStoreServiceOutputFields
    }
  }
`;

// ✅ 신규 — StoreManager 관리
export const ADD_STORE_MANAGER = gql`
  ${ADD_STORE_SERVICE_OUTPUT_FIELDS}
  mutation AddStoreManager($input: AddStoreManagerInput!) {
    addStoreManager(input: $input) {
      ...AddStoreServiceOutputFields
    }
  }
`;

export const REMOVE_STORE_MANAGER = gql`
  ${ADD_STORE_SERVICE_OUTPUT_FIELDS}
  mutation RemoveStoreManager($input: RemoveStoreManagerInput!) {
    removeStoreManager(input: $input) {
      ...AddStoreServiceOutputFields
    }
  }
`;

export const CREATE_BRAND = gql`
  ${CREATE_BRAND_OUTPUT_FIELDS}
  mutation CreateBrand($input: CreateBrandInput!) {
    createBrand(input: $input) {
      ...CreateBrandOutputFields
    }
  }
`;

export const UPDATE_BRAND = gql`
  ${UPDATE_BRAND_OUTPUT_FIELDS}
  mutation UpdateBrand($input: UpdateBrandInput!) {
    updateBrand(input: $input) {
      ...UpdateBrandOutputFields
    }
  }
`;

export const DELETE_BRAND = gql`
  ${DELETE_BRAND_OUTPUT_FIELDS}
  mutation DeleteBrand($input: DeleteBrandInput!) {
    deleteBrand(input: $input) {
      ...DeleteBrandOutputFields
    }
  }
`;

export const DELETE_BRANDS = gql`
  mutation DeleteBrands($ids: [Int!]!) {
    deleteBrands(ids: $ids)
  }
`;

// ============================================================================
// BusinessType / ServiceType Output Fragments
// ============================================================================

export const BUSINESS_TYPE_FIELDS = gql`
  fragment BusinessTypeFields on BusinessType {
    id
    code
    name
    description
    isActive
    sortOrder
    allowedServices {
      id
      code
      name
      description
      isActive
      sortOrder
    }
  }
`;

export const SERVICE_TYPE_FIELDS = gql`
  fragment ServiceTypeFields on ServiceType {
    id
    code
    name
    description
    isActive
    sortOrder
  }
`;

export const CREATE_BUSINESS_TYPE_OUTPUT_FIELDS = gql`
  fragment CreateBusinessTypeOutputFields on CreateBusinessTypeOutput {
    success
    businessType {
      ...BusinessTypeFields
    }
  }
  ${BUSINESS_TYPE_FIELDS}
`;

export const UPDATE_BUSINESS_TYPE_OUTPUT_FIELDS = gql`
  fragment UpdateBusinessTypeOutputFields on UpdateBusinessTypeOutput {
    success
    businessType {
      ...BusinessTypeFields
    }
  }
  ${BUSINESS_TYPE_FIELDS}
`;

export const CREATE_SERVICE_TYPE_OUTPUT_FIELDS = gql`
  fragment CreateServiceTypeOutputFields on CreateServiceTypeOutput {
    success
    serviceType {
      ...ServiceTypeFields
    }
  }
  ${SERVICE_TYPE_FIELDS}
`;

export const UPDATE_SERVICE_TYPE_OUTPUT_FIELDS = gql`
  fragment UpdateServiceTypeOutputFields on UpdateServiceTypeOutput {
    success
    serviceType {
      ...ServiceTypeFields
    }
  }
  ${SERVICE_TYPE_FIELDS}
`;

// ============================================================================
// BusinessType / ServiceType Mutations (슈퍼 어드민 전용)
// ============================================================================

export const CREATE_BUSINESS_TYPE = gql`
  ${CREATE_BUSINESS_TYPE_OUTPUT_FIELDS}
  mutation CreateBusinessType($input: CreateBusinessTypeInput!) {
    createBusinessType(input: $input) {
      ...CreateBusinessTypeOutputFields
    }
  }
`;

export const UPDATE_BUSINESS_TYPE = gql`
  ${UPDATE_BUSINESS_TYPE_OUTPUT_FIELDS}
  mutation UpdateBusinessType($input: UpdateBusinessTypeInput!) {
    updateBusinessType(input: $input) {
      ...UpdateBusinessTypeOutputFields
    }
  }
`;

export const CREATE_SERVICE_TYPE = gql`
  ${CREATE_SERVICE_TYPE_OUTPUT_FIELDS}
  mutation CreateServiceType($input: CreateServiceTypeInput!) {
    createServiceType(input: $input) {
      ...CreateServiceTypeOutputFields
    }
  }
`;

export const UPDATE_SERVICE_TYPE = gql`
  ${UPDATE_SERVICE_TYPE_OUTPUT_FIELDS}
  mutation UpdateServiceType($input: UpdateServiceTypeInput!) {
    updateServiceType(input: $input) {
      ...UpdateServiceTypeOutputFields
    }
  }
`;

import { gql } from '@apollo/client';
import { ERROR_INFO_FIELDS } from './auth.queries.js';

// ============================================================================
// Fragments
// ============================================================================

// ✅ Brand는 stores 없이 최소 필드만 가져오기
export const BRAND_FIELDS = gql`
  fragment BrandFields on Brand {
    id
    name
    slug
    description
    logoUrl
    brandColor
    metadata
    isActive
    createdById
    updatedById
    createdAt
    updatedAt
    deletedAt
  }
`;

// ✅ Store의 brand 관계는 BRAND_FIELDS 재사용 (순환 참조 방지)
export const STORE_FIELDS = gql`
  ${BRAND_FIELDS}
  fragment StoreFields on Store {
    id
    name
    slug
    brandId
    location
    address
    coordinates
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
    createdAt
    updatedAt
    deletedAt
    brand {
      ...BrandFields
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

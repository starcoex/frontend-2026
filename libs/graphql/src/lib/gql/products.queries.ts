import { gql } from '@apollo/client';
import { ERROR_INFO_FIELDS } from './auth.queries.js';

// ============================================================================
// Fragments
// ============================================================================

// ✅ 최소 필드만 가져오기 (타입 충돌 방지)
export const PRODUCT_INVENTORY_FIELDS = gql`
  fragment ProductInventoryFields on ProductInventory {
    id
    productId
    storeId
    stock
    minStock
    maxStock
    storePrice
    isAvailable
    createdAt
    updatedAt
    deletedAt
  }
`;

export const PRODUCT_FIELDS = gql`
  ${PRODUCT_INVENTORY_FIELDS}
  fragment ProductFields on Product {
    id
    name
    slug
    description
    brandId
    categoryId
    metadata
    imageUrl
    imageUrls
    basePrice
    salePrice
    sku
    barcode
    baseStock
    isActive
    isAvailable
    isFeatured
    sortOrder
    viewCount
    orderCount
    rating
    reviewCount
    createdById
    updatedById
    createdAt
    updatedAt
    deletedAt
    inventories {
      ...ProductInventoryFields
    }
  }
`;

export const CREATE_PRODUCT_OUTPUT_FIELDS = gql`
  ${ERROR_INFO_FIELDS}
  ${PRODUCT_FIELDS}
  fragment CreateProductOutputFields on CreateProductOutput {
    success
    creationMessage
    notificationMessage
    inventoryMessage
    product {
      ...ProductFields
    }
    error {
      ...ErrorInfoFields
    }
  }
`;

export const UPDATE_PRODUCT_OUTPUT_FIELDS = gql`
  ${ERROR_INFO_FIELDS}
  ${PRODUCT_FIELDS}
  fragment UpdateProductOutputFields on UpdateProductOutput {
    success
    updateMessage
    notificationSent
    inventoryUpdateMessage
    product {
      ...ProductFields
    }
    error {
      ...ErrorInfoFields
    }
  }
`;

// ============================================================================
// Queries
// ============================================================================

export const LIST_PRODUCTS = gql`
  ${PRODUCT_FIELDS}
  query ListProductsNew {
    listProductsNew {
      ...ProductFields
    }
  }
`;

export const FIND_PRODUCT_BY_ID = gql`
  ${PRODUCT_FIELDS}
  query FindProductById($id: Int!) {
    findProductById(id: $id) {
      ...ProductFields
    }
  }
`;

// ============================================================================
// Mutations
// ============================================================================

export const CREATE_PRODUCT = gql`
  ${CREATE_PRODUCT_OUTPUT_FIELDS}
  mutation CreateProductNew($input: CreateProductInput!) {
    createProductNew(input: $input) {
      ...CreateProductOutputFields
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  ${UPDATE_PRODUCT_OUTPUT_FIELDS}
  mutation UpdateProductNew($input: UpdateProductInput!) {
    updateProductNew(input: $input) {
      ...UpdateProductOutputFields
    }
  }
`;

export const CREATE_PRODUCT_INVENTORY = gql`
  ${PRODUCT_INVENTORY_FIELDS}
  mutation CreateProductInventory($input: CreateProductInventoryInput!) {
    createProductInventory(input: $input) {
      ...ProductInventoryFields
    }
  }
`;

export const UPDATE_PRODUCT_INVENTORY = gql`
  ${PRODUCT_INVENTORY_FIELDS}
  mutation UpdateProductInventory($input: UpdateProductInventoryInput!) {
    updateProductInventory(input: $input) {
      ...ProductInventoryFields
    }
  }
`;

export const DELETE_PRODUCT_INVENTORY = gql`
  mutation DeleteProductInventory($id: Int!) {
    deleteProductInventory(id: $id)
  }
`;

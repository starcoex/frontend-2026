import { gql } from '@apollo/client';

// ─── Fragments ───────────────────────────────────────────────────────────────

export const PRODUCT_ERROR_INFO_FIELDS = gql`
  fragment ProductErrorInfoFields on ErrorInfo {
    code
    message
    details
  }
`;

export const PRODUCT_TYPE_FIELDS = gql`
  fragment ProductTypeFields on ProductType {
    id
    code
    name
    description
    isActive
    sortOrder
    metadataSchema
    createdAt
    updatedAt
    deletedAt
  }
`;

export const PRODUCT_INVENTORY_FIELDS = gql`
  fragment ProductInventoryFields on ProductInventory {
    id
    productId
    storeId
    stock
    minStock
    maxStock
    reorderPoint
    reorderQuantity
    storePrice
    costPrice
    isAvailable
    createdById
    updatedById
    createdAt
    updatedAt
    deletedAt
    store {
      id
    }
  }
`;

export const PRODUCT_FIELDS = gql`
  ${PRODUCT_INVENTORY_FIELDS}
  ${PRODUCT_TYPE_FIELDS}
  fragment ProductFields on Product {
    id
    name
    slug
    description
    brandId
    categoryId
    productTypeId
    metadata
    imageUrl
    imageUrls
    basePrice
    salePrice
    sku
    barcode
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
    category {
      id
    }
    brand {
      id
    }
    productType {
      ...ProductTypeFields
    }
  }
`;

export const CREATE_PRODUCT_OUTPUT_FIELDS = gql`
  ${PRODUCT_ERROR_INFO_FIELDS}
  ${PRODUCT_FIELDS}
  fragment CreateProductOutputFields on CreateProductOutput {
    success
    error {
      ...ProductErrorInfoFields
    }
    product {
      ...ProductFields
    }
    message
  }
`;

export const DELETE_PRODUCT_OUTPUT_FIELDS = gql`
  ${PRODUCT_ERROR_INFO_FIELDS}
  fragment DeleteProductOutputFields on DeleteProductOutput {
    success
    error {
      ...ProductErrorInfoFields
    }
    deleteMessage
  }
`;

export const UPDATE_PRODUCT_OUTPUT_FIELDS = gql`
  ${PRODUCT_ERROR_INFO_FIELDS}
  ${PRODUCT_FIELDS}
  fragment UpdateProductOutputFields on UpdateProductOutput {
    success
    error {
      ...ProductErrorInfoFields
    }
    product {
      ...ProductFields
    }
    updateMessage
    notificationSent
    inventoryUpdateMessage
  }
`;

// ✅ 뮤테이션보다 먼저 정의
export const CREATE_PRODUCT_TYPE_OUTPUT_FIELDS = gql`
  ${PRODUCT_TYPE_FIELDS}
  fragment CreateProductTypeOutputFields on CreateProductTypeOutput {
    success
    productType {
      ...ProductTypeFields
    }
  }
`;

export const UPDATE_PRODUCT_TYPE_OUTPUT_FIELDS = gql`
  ${PRODUCT_TYPE_FIELDS}
  fragment UpdateProductTypeOutputFields on UpdateProductTypeOutput {
    success
    productType {
      ...ProductTypeFields
    }
  }
`;

// ─── ProductType Queries ──────────────────────────────────────────────────────

export const LIST_PRODUCT_TYPES = gql`
  ${PRODUCT_TYPE_FIELDS}
  query ListProductTypes {
    listProductTypes {
      ...ProductTypeFields
    }
  }
`;

export const GET_PRODUCT_TYPE_BY_ID = gql`
  ${PRODUCT_TYPE_FIELDS}
  query ProductTypeById($id: Int!) {
    productTypeById(id: $id) {
      ...ProductTypeFields
    }
  }
`;

export const GET_PRODUCT_TYPE_BY_CODE = gql`
  ${PRODUCT_TYPE_FIELDS}
  query ProductTypeByCode($code: String!) {
    productTypeByCode(code: $code) {
      ...ProductTypeFields
    }
  }
`;

// ─── ProductType Mutations ────────────────────────────────────────────────────

export const CREATE_PRODUCT_TYPE = gql`
  ${CREATE_PRODUCT_TYPE_OUTPUT_FIELDS}
  mutation CreateProductType($input: CreateProductTypeInput!) {
    createProductType(input: $input) {
      ...CreateProductTypeOutputFields
    }
  }
`;

export const UPDATE_PRODUCT_TYPE = gql`
  ${UPDATE_PRODUCT_TYPE_OUTPUT_FIELDS}
  mutation UpdateProductType($input: UpdateProductTypeInput!) {
    updateProductType(input: $input) {
      ...UpdateProductTypeOutputFields
    }
  }
`;

// ─── Product Queries ──────────────────────────────────────────────────────────

export const LIST_PRODUCTS = gql`
  ${PRODUCT_FIELDS}
  query ListProductsNew {
    listProductsNew {
      ...ProductFields
    }
  }
`;

export const GET_PRODUCT_BY_BARCODE = gql`
  ${PRODUCT_FIELDS}
  query ProductByBarcode($barcode: String!) {
    productByBarcode(barcode: $barcode) {
      ...ProductFields
    }
  }
`;

export const GET_PRODUCT = gql`
  ${PRODUCT_FIELDS}
  query FindProductById($id: Int!) {
    findProductById(id: $id) {
      ...ProductFields
    }
  }
`;

// ─── Product Mutations ────────────────────────────────────────────────────────

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

export const DELETE_PRODUCT = gql`
  ${DELETE_PRODUCT_OUTPUT_FIELDS}
  mutation DeleteProductNew($id: Int!) {
    deleteProductNew(id: $id) {
      ...DeleteProductOutputFields
    }
  }
`;

export const DELETE_PRODUCTS = gql`
  mutation DeleteProductsNew($ids: [Int!]!) {
    deleteProductsNew(ids: $ids)
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
